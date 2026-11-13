import os
import sys
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from app.core.database import init_db
from app.ml.trainer import NCFTrainer


async def train_and_evaluate():
    """
    Quy trình huấn luyện NeuMF (GMF 16D + MLP [32, 16, 8]) và đánh giá đối sánh
    thực nghiệm toàn diện bằng Vectorized Leave-One-Out (LOO) trên Tensor PyTorch.
    Đồng bộ 100% với NCFTrainer trong app/ml/trainer.py.
    """
    print("=" * 80)
    print("      KADY NCF RECOMMENDATION ENGINE - AI EVALUATION & TRAINING LAB (REAL LOO) ")
    print("=" * 80)

    await init_db()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, "app", "ml", "saved_models")
    model_path = os.path.join(models_dir, "ncf_weights.pth")
    mappings_path = os.path.join(models_dir, "mappings.json")

    trainer = NCFTrainer(
        models_dir=models_dir,
        model_path=model_path,
        mappings_path=mappings_path
    )

    result = await trainer._run_training_job()
    if not result:
        print("[LỖI] Huấn luyện không thành công:", trainer.training_status.get("error"))
        return

    ds = result["dataset_summary"]
    print(f"\n[1] TỔNG QUAN TẬP DỮ LIỆU:")
    print(f"  - Không gian ma trận: {ds['num_users']} Users x {ds['num_items']} Items")
    print(f"  - Tổng bản ghi tương tác: {ds['total_interactions']:,} | Cặp tương tác dương: {ds['positive_pairs']:,}")
    print(f"  - Độ thưa ma trận (Sparsity): {ds['sparsity_percent']}%")
    print(f"  - Mẫu huấn luyện (1 Pos : 4 Neg): {ds['train_samples']:,}")
    print(f"  - Tập kiểm thử LOO (1 Pos : 99 Neg): {ds['test_instances']} Users")

    print(f"\n[2] LỊCH SỬ HỘI TỤ QUA 20 EPOCHS (VECTORIZED LOO EVALUATION):")
    print("-" * 80)
    print(f"{'Epoch':<8}{'BCE Loss':<12}{'HR@8 (Hybrid)':<16}{'NDCG@8':<12}{'HR@10':<12}{'NDCG@10':<12}{'Pure NCF HR@8'}")
    print("-" * 80)
    for ep in result["epoch_history"]:
        print(
            f"Epoch {ep['epoch']:02d}  "
            f"{ep['bce_loss']:<12.4f}"
            f"{ep['hr_at_8']:>6.2f}%         "
            f"{ep['ndcg_at_8']:<12.4f}"
            f"{ep['hr_at_10']:>6.2f}%     "
            f"{ep['ndcg_at_10']:<12.4f}"
            f"{ep.get('pure_hr_at_8', 0.0):>6.2f}%"
        )
    print("-" * 80)

    print(f"\n[3] BẢNG ĐỐI SÁNH KẾT QUẢ THỰC NGHIỆM (BENCHMARK COMPARISON):")
    print("-" * 80)
    print(f"{'Phương pháp':<24}{'HR@8':<12}{'NDCG@8':<12}{'HR@10':<12}{'NDCG@10':<12}{'BCE Loss':<10}")
    print("-" * 80)
    for b in result["benchmark_comparison"]:
        tag = " *" if b.get("is_best") else ""
        print(
            f"{(b['method'] + tag):<24}"
            f"{b['hr_at_8']:>6.2f}%     "
            f"{b['ndcg_at_8']:<12.4f}"
            f"{b.get('hr_at_10', 0.0):>6.2f}%     "
            f"{b.get('ndcg_at_10', 0.0):<12.4f}"
            f"{b['bce_loss']:<10.4f}"
        )
    print("-" * 80)
    print(f"Hoàn tất trong {result['total_training_time_sec']}s | Độ trễ suy luận: {result['evaluation_metrics']['inference_latency_ms']} ms/user")


if __name__ == "__main__":
    asyncio.run(train_and_evaluate())
    sys.stdout.flush()
    os._exit(0)
