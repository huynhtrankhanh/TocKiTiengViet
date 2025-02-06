LONGEST_KEY = 1

# Define stenography maps
_stenography_map = {
    "PW": "b", "K": "c", "KH": "ch", "KWR": "d", "TK": "đ", "TP": "ph", "TKPW": "g",
    "H": "h", "KWH": "gi", "KHR": "kh", "HR": "l", "PH": "m", "TPH": "n", "TPR": "nh",
    "TPW": "ng/ngh", "P": "p", "R": "r", "KP": "s", "T": "t", "TH": "th", "TR": "tr",
    "W": "v", "WR": "x"
}

_vowel_map = {
    "OEU": "iê/ia", "AEU": "ua/uô", "AOE": "ưa/ươ", "AOU": "ư", "OU": "ơ", "OE": "ô",
    "O": "o", "AU": "ê", "E": "e", "EU": "i", "A": "a", "AE": "ă", "AO": "â",
    "U": "u", "AOEU": "y"
}

_final_map = {
    "FP": "j", "F": "w", "P": "p", "R": "t", "BG": "c", "RB": "ch", "PB": "nh",
    "L": "n", "PL": "m", "G": "ng", "RG": "y"
}

_tone_map = {
    "T": "sắc", "S": "huyền", "D": "hỏi", "TS": "ngã", "Z": "nặng"
}

_tone_accents = {
    "a": {"": "a", "sắc": "á", "huyền": "à", "hỏi": "ả", "ngã": "ã", "nặng": "ạ"},
    "ă": {"": "ă", "sắc": "ắ", "huyền": "ằ", "hỏi": "ẳ", "ngã": "ẵ", "nặng": "ặ"},
    "â": {"": "â", "sắc": "ấ", "huyền": "ầ", "hỏi": "ẩ", "ngã": "ẫ", "nặng": "ậ"},
    "e": {"": "e", "sắc": "é", "huyền": "è", "hỏi": "ẻ", "ngã": "ẽ", "nặng": "ẹ"},
    "ê": {"": "ê", "sắc": "ế", "huyền": "ề", "hỏi": "ể", "ngã": "ễ", "nặng": "ệ"},
    "i": {"": "i", "sắc": "í", "huyền": "ì", "hỏi": "ỉ", "ngã": "ĩ", "nặng": "ị"},
    "o": {"": "o", "sắc": "ó", "huyền": "ò", "hỏi": "ỏ", "ngã": "õ", "nặng": "ọ"},
    "ô": {"": "ô", "sắc": "ố", "huyền": "ồ", "hỏi": "ổ", "ngã": "ỗ", "nặng": "ộ"},
    "ơ": {"": "ơ", "sắc": "ớ", "huyền": "ờ", "hỏi": "ở", "ngã": "ỡ", "nặng": "ợ"},
    "u": {"": "u", "sắc": "ú", "huyền": "ù", "hỏi": "ủ", "ngã": "ũ", "nặng": "ụ"},
    "ư": {"": "ư", "sắc": "ứ", "huyền": "ừ", "hỏi": "ử", "ngã": "ữ", "nặng": "ự"},
    "y": {"": "y", "sắc": "ý", "huyền": "ỳ", "hỏi": "ỷ", "ngã": "ỹ", "nặng": "ỵ"}
}

def parse(stroke):
    on_glide = stroke.startswith("S")
    if on_glide:
        stroke = stroke[1:]

    initial_consonant, vowel, final_consonant, tone = "", "", "", ""

    # Match Initial Consonant
    for length in (3, 2, 1):
        candidate = stroke[:length]
        if candidate in _stenography_map:
            initial_consonant = _stenography_map[candidate]
            stroke = stroke[length:]
            break

    # Match Vowel
    for length in (4, 3, 2, 1):
        candidate = stroke[:length]
        if candidate in _vowel_map:
            vowel = _vowel_map[candidate]
            stroke = stroke[length:]
            break

    # Match Final Consonant
    for length in (2, 1):
        candidate = stroke[:length]
        if candidate in _final_map:
            final_consonant = _final_map[candidate]
            stroke = stroke[length:]
            break

    # Match Tone
    if stroke in _tone_map:
        tone = _tone_map[stroke]

    return on_glide, initial_consonant, vowel, final_consonant, tone

def assemble(parsed):
    on_glide, initial_consonant, vowel, final_consonant, tone = parsed

    # Handle special cases for initials
    if initial_consonant == "ng/ngh":
        initial_consonant = "ng" if on_glide or vowel in {"a", "ă", "â", "o", "ô", "ơ", "u", "ư"} else "ngh"
    if initial_consonant == "g":
        initial_consonant = "g" if on_glide or vowel in {"a", "ă", "â", "o", "ô", "ơ", "u", "ư"} else "gh"
    if initial_consonant == "gi":
        initial_consonant = "g" if not on_glide and vowel == "i" else "gi"
    if initial_consonant == "c":
        initial_consonant = "q" if on_glide else "c" if vowel in {"a", "ă", "â", "o", "ô", "ơ", "u", "ư"} else "k"

    # Handle vowels and tones
    if vowel in _tone_accents:
        accented_vowel = _tone_accents[vowel][tone]
    else:
        accented_vowel = vowel

    if final_consonant == "w":
        final_consonant = "u" if vowel in {"iê/ia", "ư", "ê", "u", "ă", "â", "i"} else "o"
    if final_consonant == "j":
        final_consonant = "i"

    return initial_consonant + accented_vowel + final_consonant

def lookup(key):
    assert len(key) == 1 and isinstance(key[0], str), "Key must be a 1-tuple of a string"
    return assemble(parse(key[0]))

