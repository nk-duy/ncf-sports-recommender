import time
import json
import asyncio
from typing import Any, Optional, Callable, Dict
from functools import wraps

class InMemoryTTLCache:
    """
    Bộ đệm In-Memory TTL Cache hiệu năng cao, thread-safe, tự động thu hồi khi hết hạn.
    Không đòi hỏi cài đặt Redis bên ngoài, đảm bảo đồ án chạy mượt mà trên mọi môi trường.
    """
    def __init__(self, max_size: int = 2000):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._max_size = max_size
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Optional[Any]:
        async with self._lock:
            item = self._cache.get(key)
            if not item:
                return None
            
            # Kiểm tra thời gian hết hạn (TTL)
            if time.time() > item["expires_at"]:
                del self._cache[key]
                return None
                
            return item["value"]

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        async with self._lock:
            # Thu hồi bớt các mục cũ nếu vượt quá kích thước tối đa
            if len(self._cache) >= self._max_size:
                now = time.time()
                expired_keys = [k for k, v in self._cache.items() if now > v["expires_at"]]
                for k in expired_keys:
                    del self._cache[k]
                
                # Nếu vẫn đầy, xóa bớt 10% mục cũ nhất
                if len(self._cache) >= self._max_size:
                    oldest_keys = sorted(self._cache.keys(), key=lambda k: self._cache[k]["created_at"])[:int(self._max_size * 0.1)]
                    for k in oldest_keys:
                        self._cache.pop(k, None)

            self._cache[key] = {
                "value": value,
                "created_at": time.time(),
                "expires_at": time.time() + ttl
            }

    async def delete(self, key: str) -> None:
        async with self._lock:
            self._cache.pop(key, None)

    async def invalidate_prefix(self, prefix: str) -> int:
        """Xóa tất cả các khóa cache bắt đầu bằng tiền tố prefix (Ví dụ: 'menu:', 'dashboard:')"""
        async with self._lock:
            keys_to_del = [k for k in self._cache.keys() if k.startswith(prefix)]
            for k in keys_to_del:
                del self._cache[k]
            return len(keys_to_del)

    async def clear(self) -> None:
        async with self._lock:
            self._cache.clear()

    def stats(self) -> Dict[str, Any]:
        now = time.time()
        active_items = sum(1 for v in self._cache.values() if now <= v["expires_at"])
        return {
            "total_keys": len(self._cache),
            "active_keys": active_items,
            "max_size": self._max_size
        }

# Khởi tạo singleton cache instance
fast_cache = InMemoryTTLCache()

def cache_response(ttl: int = 300, prefix: str = ""):
    """
    Decorator bọc endpoint hoặc hàm bất đồng bộ để tự động lưu cache kết quả:
    - ttl: Thời gian sống (giây), mặc định 300s (5 phút)
    - prefix: Tiền tố nhóm khóa cache để tiện invalidate
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Tạo khóa cache từ tên hàm và tham số
            arg_str = ":".join(str(a) for a in args)
            kwarg_str = ":".join(f"{k}={v}" for k, v in sorted(kwargs.items()))
            cache_key = f"{prefix or func.__name__}:{arg_str}:{kwarg_str}".strip(":")

            # Kiểm tra cache
            cached_val = await fast_cache.get(cache_key)
            if cached_val is not None:
                return cached_val

            # Nếu chưa có trong cache, gọi hàm gốc
            result = await func(*args, **kwargs)

            # Lưu vào cache
            await fast_cache.set(cache_key, result, ttl=ttl)
            return result
        return wrapper
    return decorator
