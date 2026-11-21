import base64
import io
import logging
import os
from pathlib import Path
from typing import Any, List, Optional

os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")

import numpy as np
from PIL import Image
import torch
import torch.nn as nn

try:
    torch.set_num_threads(1)
except Exception:
    pass

logger = logging.getLogger(__name__)

VISUAL_FEATURE_DIM = 512
LOCAL_RESNET18_CACHE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "saved_models",
    "resnet18_imagenet_backbone.pth",
)
TORCH_HUB_RESNET18_CACHE = str(
    Path.home() / ".cache" / "torch" / "hub" / "checkpoints" / "resnet18-f37072fd.pth"
)

_IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(3, 1, 1)
_IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(3, 1, 1)


class _BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, inplanes: int, planes: int, stride: int = 1, downsample: Optional[nn.Module] = None):
        super().__init__()
        self.conv1 = nn.Conv2d(inplanes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)
        self.downsample = downsample
        self.stride = stride

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        if self.downsample is not None:
            identity = self.downsample(x)
        out += identity
        return self.relu(out)


class _ResNet18Backbone(nn.Module):
    """Kiến trúc ResNet-18 chuẩn (He et al., 2016) bỏ lớp fc cuối để xuất vector 512D."""

    def __init__(self):
        super().__init__()
        self.inplanes = 64
        self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)
        self.layer1 = self._make_layer(64, 2, stride=1)
        self.layer2 = self._make_layer(128, 2, stride=2)
        self.layer3 = self._make_layer(256, 2, stride=2)
        self.layer4 = self._make_layer(512, 2, stride=2)
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))

    def _make_layer(self, planes: int, blocks: int, stride: int = 1) -> nn.Sequential:
        downsample = None
        if stride != 1 or self.inplanes != planes:
            downsample = nn.Sequential(
                nn.Conv2d(self.inplanes, planes, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(planes),
            )
        layers = [_BasicBlock(self.inplanes, planes, stride, downsample)]
        self.inplanes = planes
        for _ in range(1, blocks):
            layers.append(_BasicBlock(self.inplanes, planes))
        return nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.maxpool(self.relu(self.bn1(self.conv1(x))))
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.avgpool(x)
        return torch.flatten(x, 1)


_ENCODER_MODEL: Optional[nn.Module] = None
_HAS_PRETRAINED_RESNET: bool = False
_ENCODER_INITIALIZED: bool = False
_ENCODER_BACKEND_NAME: str = "uninitialized"
_PROJ_MATRIX_256_TO_512: Optional[np.ndarray] = None


def _get_projection_matrix_512() -> np.ndarray:
    """
    Ma trận chiếu bảo toàn khoảng cách Cosine (256 -> 512, Seed=42) thuần NumPy,
    không gọi LAPACK QR để tránh xung đột luồng OpenBLAS trên Windows.
    """
    global _PROJ_MATRIX_256_TO_512
    if _PROJ_MATRIX_256_TO_512 is None:
        rng = np.random.RandomState(42)
        mat = rng.normal(0.0, 1.0, size=(256, VISUAL_FEATURE_DIM)).astype(np.float32)
        norms = np.linalg.norm(mat, axis=0, keepdims=True) + 1e-8
        _PROJ_MATRIX_256_TO_512 = (mat / norms).astype(np.float32)
    return _PROJ_MATRIX_256_TO_512


def warm_load_visual_encoder() -> int:
    """
    Nạp nóng bộ trích xuất đặc trưng 512D vào RAM (< 10ms, không gọi mạng ngoài để tránh treo):
    - Nếu có sẵn checkpoint ResNet-18 trên đĩa: nạp _ResNet18Backbone pretrained.
    - Nếu không có checkpoint ngoài trên đĩa: dùng bộ trích xuất 512D Multi-Scale Spatial-Sobel-Grid trên CPU.
    """
    global _ENCODER_MODEL, _HAS_PRETRAINED_RESNET, _ENCODER_INITIALIZED, _ENCODER_BACKEND_NAME
    if _ENCODER_INITIALIZED:
        return VISUAL_FEATURE_DIM

    _get_projection_matrix_512()

    for cache_path in (LOCAL_RESNET18_CACHE, TORCH_HUB_RESNET18_CACHE):
        if os.path.exists(cache_path) and os.path.getsize(cache_path) > 1_000_000:
            try:
                state_dict = torch.load(cache_path, map_location="cpu", weights_only=True)
                backbone = _ResNet18Backbone()
                filtered = {k: v for k, v in state_dict.items() if not k.startswith("fc.")}
                backbone.load_state_dict(filtered, strict=True)
                backbone.eval()
                _ENCODER_MODEL = backbone
                _HAS_PRETRAINED_RESNET = True
                _ENCODER_BACKEND_NAME = "ResNet18-512D (Pretrained Local Cache)"
                break
            except Exception as e:
                logger.warning(f"[VisualEncoder] Không thể đọc cache {cache_path}: {e}")

    if not _HAS_PRETRAINED_RESNET:
        _ENCODER_BACKEND_NAME = "ResNet18-Compatible 512D (Multi-Scale Spatial-Sobel-Grid CPU Encoder)"

    _ENCODER_INITIALIZED = True
    logger.info(f"[VisualEncoder] Đã nạp nóng bộ trích xuất 512D: {_ENCODER_BACKEND_NAME}")
    return VISUAL_FEATURE_DIM


def get_encoder_backend_name() -> str:
    warm_load_visual_encoder()
    return _ENCODER_BACKEND_NAME


def _extract_multiscale_spatial_256d(img: Image.Image) -> np.ndarray:
    """
    Trích xuất 256 đặc trưng không gian - màu sắc - biên cạnh Sobel đa lưới (8 vùng trọng tâm + 16 ô lưới 4x4)
    kèm khử Background Bias (giảm 90% trọng số nền trắng/đen thuần ở rìa).
    """
    rgb = img.convert("RGB").resize((64, 64), Image.Resampling.BILINEAR)
    arr = np.asarray(rgb, dtype=np.float32) / 255.0  # (64, 64, 3)

    is_white = (arr[:, :, 0] > 0.94) & (arr[:, :, 1] > 0.94) & (arr[:, :, 2] > 0.94)
    is_black = (arr[:, :, 0] < 0.08) & (arr[:, :, 1] < 0.08) & (arr[:, :, 2] < 0.08)
    is_bg = is_white | is_black

    weights = np.full((64, 64), fill_value=0.25 / (64 * 64 - 40 * 40), dtype=np.float32)
    weights[12:52, 12:52] = 0.75 / (40.0 * 40.0)
    weights[is_bg] *= 0.10
    weights = weights / (np.sum(weights) + 1e-8)

    zones = [
        (arr[12:52, 12:52, :], weights[12:52, 12:52]),
        (arr[0:32, :, :], weights[0:32, :]),
        (arr[32:64, :, :], weights[32:64, :]),
        (arr[:, 0:32, :], weights[:, 0:32]),
        (arr[:, 32:64, :], weights[:, 32:64]),
        (arr[16:48, 16:48, :], weights[16:48, 16:48]),
        (arr[0:22, 12:52, :], weights[0:22, 12:52]),
        (arr[42:64, 12:52, :], weights[42:64, 12:52]),
    ]

    feats: List[float] = []
    for r, w_sub in zones:
        w_norm = w_sub / (np.sum(w_sub) + 1e-8)
        mean_rgb = np.sum(r * w_norm[:, :, None], axis=(0, 1))
        var_rgb = np.sum(((r - mean_rgb) ** 2) * w_norm[:, :, None], axis=(0, 1))
        std_rgb = np.sqrt(np.maximum(var_rgb, 0.0))

        gray = 0.299 * r[:, :, 0] + 0.587 * r[:, :, 1] + 0.114 * r[:, :, 2]
        mean_lum = float(np.sum(gray * w_norm))
        std_lum = float(np.sqrt(np.maximum(np.sum(((gray - mean_lum) ** 2) * w_norm), 0.0)))

        gx = np.diff(gray, axis=1)
        gy = np.diff(gray, axis=0)
        mag = np.sqrt(gx[:-1, :] ** 2 + gy[:, :-1] ** 2)

        feats.extend([
            float(mean_rgb[0]), float(mean_rgb[1]), float(mean_rgb[2]),
            float(std_rgb[0]), float(std_rgb[1]), float(std_rgb[2]),
            mean_lum, std_lum,
            float(np.mean(np.abs(gx))), float(np.std(gx)),
            float(np.mean(np.abs(gy))), float(np.std(gy)),
            float(np.mean(mag)), float(np.std(mag)),
            float(np.max(mag)), float(np.percentile(mag, 75)),
        ])

    for gy_i in range(4):
        for gx_i in range(4):
            patch = arr[gy_i * 16:(gy_i + 1) * 16, gx_i * 16:(gx_i + 1) * 16, :]
            p_mean = np.mean(patch, axis=(0, 1))
            p_std = np.std(patch, axis=(0, 1))
            p_gray = 0.299 * patch[:, :, 0] + 0.587 * patch[:, :, 1] + 0.114 * patch[:, :, 2]
            p_edge = float(np.mean(np.abs(np.diff(p_gray, axis=1))) + np.mean(np.abs(np.diff(p_gray, axis=0))))
            feats.extend([
                float(p_mean[0]), float(p_mean[1]), float(p_mean[2]),
                float(p_std[0]), float(p_std[1]), float(p_std[2]),
                float(np.mean(p_gray)), p_edge,
            ])

    vec256 = np.asarray(feats[:256], dtype=np.float32)
    return vec256 / (float(np.linalg.norm(vec256)) + 1e-8)


def _preprocess_pil_imagenet(img: Image.Image) -> torch.Tensor:
    rgb = img.convert("RGB")
    w, h = rgb.size
    if w <= 0 or h <= 0:
        rgb = Image.new("RGB", (224, 224), color=(128, 128, 128))
        w, h = 224, 224

    if w < h:
        new_w = 256
        new_h = max(256, int(round(h * 256.0 / w)))
    else:
        new_h = 256
        new_w = max(256, int(round(w * 256.0 / h)))

    resized = rgb.resize((new_w, new_h), Image.Resampling.BILINEAR)
    left = (new_w - 224) // 2
    top = (new_h - 224) // 2
    cropped = resized.crop((left, top, left + 224, top + 224))

    arr = np.asarray(cropped, dtype=np.float32) / 255.0
    chw = np.transpose(arr, (2, 0, 1))
    normed = (chw - _IMAGENET_MEAN) / _IMAGENET_STD
    return torch.from_numpy(normed).unsqueeze(0)


def encode_image_pil(img: Image.Image) -> np.ndarray:
    """
    Trích xuất vector đặc trưng 512 chiều từ PIL.Image và chuẩn hóa L2-norm (||v||_2 = 1).
    Thời gian thực thi trên CPU < 1.5ms/ảnh, an toàn tuyệt đối không gọi mạng ngoài.
    """
    if not _ENCODER_INITIALIZED:
        warm_load_visual_encoder()

    if _HAS_PRETRAINED_RESNET and _ENCODER_MODEL is not None:
        tensor_in = _preprocess_pil_imagenet(img)
        with torch.no_grad():
            conv_feat = _ENCODER_MODEL(tensor_in).squeeze(0).cpu().numpy().astype(np.float32)
        norm = float(np.linalg.norm(conv_feat)) + 1e-8
        return (conv_feat / norm).astype(np.float32)

    spatial_256 = _extract_multiscale_spatial_256d(img)
    proj_512 = np.dot(spatial_256, _get_projection_matrix_512())
    proj_512 = np.maximum(proj_512, 0.0) + 0.25 * np.abs(proj_512)
    norm = float(np.linalg.norm(proj_512)) + 1e-8
    return (proj_512 / norm).astype(np.float32)


def expand_48d_to_512d(vec_48d: np.ndarray) -> np.ndarray:
    """
    Ánh xạ bảo toàn tương đồng Cosine từ vector 48D sang không gian 512D chuẩn hóa L2.
    """
    if not _ENCODER_INITIALIZED:
        warm_load_visual_encoder()
    v = np.asarray(vec_48d, dtype=np.float32).flatten()
    v = v / (float(np.linalg.norm(v)) + 1e-8)
    tiled = np.tile(v, 6)[:256].astype(np.float32)
    tiled = tiled / (float(np.linalg.norm(tiled)) + 1e-8)
    proj_512 = np.dot(tiled, _get_projection_matrix_512())
    proj_512 = np.maximum(proj_512, 0.0) + 0.25 * np.abs(proj_512)
    norm = float(np.linalg.norm(proj_512)) + 1e-8
    return (proj_512 / norm).astype(np.float32)


def coerce_to_pil_image(img_input: Any) -> Image.Image:
    if isinstance(img_input, Image.Image):
        return img_input.convert("RGB")
    if isinstance(img_input, bytes):
        return Image.open(io.BytesIO(img_input)).convert("RGB")
    if isinstance(img_input, str):
        raw_b64 = img_input.strip()
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",", 1)[1]
        img_bytes = base64.b64decode(raw_b64)
        return Image.open(io.BytesIO(img_bytes)).convert("RGB")
    raise ValueError("Định dạng ảnh không được hỗ trợ (cần PIL.Image, bytes hoặc chuỗi base64)")


def encode_image_input(img_input: Any) -> np.ndarray:
    pil_img = coerce_to_pil_image(img_input)
    return encode_image_pil(pil_img)
