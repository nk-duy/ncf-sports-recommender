import re
import unicodedata
from typing import List, Dict, Any

# Bảng quy đổi ký tự nguyên âm Tiếng Việt sang biểu thức chính quy (Regex Character Classes)
VIETNAMESE_ACCENT_MAP = {
    'a': '[aàáảãạăằắẳẵặâầấẩẫậ]',
    'e': '[eèéẻẽẹêềếểễệ]',
    'i': '[iìíỉĩị]',
    'o': '[oòóỏõọôồốổỗộơờớởỡợ]',
    'u': '[uùúủũụưừứửữự]',
    'y': '[yỳýỷỹỵ]',
    'd': '[dđ]',
    'A': '[AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬ]',
    'E': '[EÈÉẺẼẸÊỀẾỂỄỆ]',
    'I': '[IÌÍỈĨỊ]',
    'O': '[OÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢ]',
    'U': '[UÙÚỦŨỤƯỪỨỬỮỰ]',
    'Y': '[YỲÝỶỸỴ]',
    'D': '[DĐ]'
}

# Từ đồng nghĩa và biến thể địa phương phổ biến trong thể thao (Ví dụ: banh <-> bóng)
WORD_SYNONYMS = {
    'banh': ['banh', 'bóng'],
    'bong': ['bóng', 'banh'],
    'vot': ['vợt'],
    'chay': ['chạy', 'running'],
    'giay': ['giày', 'giầy'],
    'tat': ['tất', 'vớ', 'socks'],
    'vo': ['vớ', 'tất', 'socks'],
    'balo': ['balo', 'ba lô', 'túi'],
    'tui': ['túi', 'balo', 'ba lô']
}

def remove_accents(text: str) -> str:
    """Loại bỏ hoàn toàn dấu Tiếng Việt chuẩn Unicode (NFD -> NFC)"""
    if not text:
        return ""
    normalized = unicodedata.normalize('NFD', text)
    stripped = re.sub(r'[\u0300-\u036f]', '', normalized)
    return stripped.replace('đ', 'd').replace('Đ', 'D')

def build_accent_tolerant_pattern(word: str) -> str:
    """Tạo biểu thức chính quy chấp nhận cả phiên bản có dấu và không dấu của từng từ"""
    clean_word = remove_accents(word)
    pattern_parts = []
    for char in clean_word:
        low_char = char.lower()
        if low_char in VIETNAMESE_ACCENT_MAP:
            pattern_parts.append(VIETNAMESE_ACCENT_MAP[low_char])
        else:
            pattern_parts.append(re.escape(char))
    return "".join(pattern_parts)

def build_token_pattern(word: str) -> str:
    """Tạo mẫu khớp cho 1 từ, tự động mở rộng từ đồng nghĩa nếu có (ví dụ: banh -> banh|bóng)"""
    clean_w = remove_accents(word).lower()
    if clean_w in WORD_SYNONYMS:
        synonyms = WORD_SYNONYMS[clean_w]
        patterns = [build_accent_tolerant_pattern(s) for s in synonyms]
        return f"(?:{'|'.join(patterns)})"
    return build_accent_tolerant_pattern(word)

def build_vietnamese_fuzzy_regex(search_term: str) -> str:
    """
    Xây dựng biểu thức tìm kiếm mờ (Fuzzy Search):
    - Chấp nhận gõ tiếng Việt không dấu (ví dụ: 'giay da banh' tìm ra 'Giày Đá Bóng')
    - Chấp nhận mở rộng từ đồng nghĩa vùng miền (banh <-> bóng, tất <-> vớ)
    - Chấp nhận đảo thứ tự từ khóa qua Positive Lookaheads (ví dụ: 'yonex vot' tìm ra 'Vợt Cầu Lông Yonex')
    """
    if not search_term or not search_term.strip():
        return ""
    
    words = search_term.strip().split()
    if len(words) == 1:
        return build_token_pattern(words[0])
    
    # Positive Lookahead cho từng từ để không phụ thuộc vào vị trí xuất hiện trước/sau
    lookaheads = "".join(f"(?=.*{build_token_pattern(w)})" for w in words)
    return f"^{lookaheads}.*"

def build_search_or_query(fields: List[str], search_text: str) -> Dict[str, Any]:
    """
    Tạo khối query MongoDB $or đa trường với hỗ trợ tìm kiếm Tiếng Việt không dấu và mờ:
    Áp dụng trên: name, brand, sport_type, category, description, full_name, email, phone...
    """
    if not search_text or not search_text.strip():
        return {}
    
    fuzzy_regex = build_vietnamese_fuzzy_regex(search_text)
    exact_safe = re.escape(search_text.strip())

    or_conditions = []
    for field in fields:
        # Điều kiện regex mờ chấp nhận không dấu / từ đồng nghĩa / đảo thứ tự từ
        or_conditions.append({field: {"$regex": fuzzy_regex, "$options": "i"}})
        # Điều kiện regex an toàn dự phòng
        or_conditions.append({field: {"$regex": exact_safe, "$options": "i"}})

    return {"$or": or_conditions}
