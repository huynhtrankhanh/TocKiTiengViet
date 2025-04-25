stenography_map = {
    # Initial Consonants
    "PW": "b",
    "K": "c",
    "KH": "ch",
    "KWR": "d",
    "TK": "đ",
    "TP": "ph",
    "TKPW": "g",
    "H": "h",
    "KWH": "gi",
    "KHR": "kh",
    "HR": "l",
    "PH": "m",
    "TPH": "n",
    "TPR": "nh",
    "TPW": "ng/ngh",
    "P": "p",
    "R": "r",
    "KP": "s",
    "T": "t",
    "TH": "th",
    "TR": "tr",
    "W": "v",
    "WR": "x",
}

vowel_map = {
    "OEU": "iê/ia",
    "AEU": "ua/uô",
    "AOE": "ưa/ươ",
    "AOU": "ư",
    "OU": "ơ",
    "OE": "ô",
    "O": "o",
    "AU": "ê",
    "E": "e",
    "EU": "i",
    "A": "a",
    "AE": "ă",
    "AO": "â",
    "U": "u",
    "AOEU": "y",
}

final_map = {
    "FP": "j",
    "F": "w",
    "P": "p",
    "R": "t",
    "FR": "c",
    "RB": "ch",
    "PB": "nh",
    "L": "n",
    "PL": "m",
    "B": "ng",
}

tone_map = {
    "T": "sắc",
    "S": "huyền",
    "G": "hỏi",
    "TS": "ngã",
    "GS": "nặng",
}

tone_accents = {
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
    "y": {"": "y", "sắc": "ý", "huyền": "ỳ", "hỏi": "ỷ", "ngã": "ỹ", "nặng": "ỵ"},
}


class Parsed:
    def __init__(self, on_glide, initial_consonant, vowel, final_consonant, tone):
        self.on_glide = on_glide
        self.initial_consonant = initial_consonant
        self.vowel = vowel
        self.final_consonant = final_consonant
        self.tone = tone


def parse(stroke):
    on_glide = stroke.startswith("S")
    if on_glide:
        stroke = stroke[1:]

    initial_consonant = ""
    vowel = ""
    final_consonant = ""
    tone = ""

    # Match Initial Consonant (4 -> 3 -> 2 -> 1 letter)
    for length in range(4, 0, -1):
        candidate = stroke[:length]
        if candidate in stenography_map:
            initial_consonant = stenography_map[candidate]
            stroke = stroke[length:]
            survived = True
            break

    survived = False
    # Match Vowel (4 -> 3 -> 2 -> 1 letter)
    for length in range(4, 0, -1):
        candidate = stroke[:length]
        if candidate in vowel_map:
            vowel = vowel_map[candidate]
            stroke = stroke[length:]
            survived = True
            break
    if not survived:
        raise KeyError("")

    # Match Final Consonant (2 -> 1 letter)
    for length in range(2, 0, -1):
        candidate = stroke[:length]
        if candidate in final_map:
            final_consonant = final_map[candidate]
            stroke = stroke[length:]
            survived = True
            break

    # Match Tone (if anything left, it must be a tone)
    survived = stroke == ""
    if stroke in tone_map:
        tone = tone_map[stroke]
        stroke = ""
        survived = True

    if not survived:
        raise KeyError("")

    return Parsed(on_glide, initial_consonant, vowel, final_consonant, tone)


def denumeralize_stroke(stroke):
    """
    Denumeralizes a stroke by converting digits to their Plover key equivalents
    and prepending the '#' character, ONLY if the input stroke contains digits
    and does NOT already start with '#'. Otherwise, return the input as is.

    For example:
        12A -> #STA  (Numeralized input with digits)
        #ABC -> #ABC (Already denumeralized)
        ABC  -> ABC   (No digits, not numeralized)
        word -> word  (No digits, not numeralized)

    Args:
        stroke: The stroke string, possibly "numeralized" (e.g., "12A"),
                already "denumeralized" (e.g., "#ABC"), or not numeralized
                (e.g., "ABC").

    Returns:
        The "denumeralized" stroke string (e.g., "#STA", "#ABC", or "ABC").
    """
    if stroke.startswith("#"):
        return stroke  # Already denumeralized, return as is

    has_digit = False
    for char in stroke:
        if char.isdigit():
            has_digit = True
            break  # No need to check further if we found a digit

    if not has_digit:
        return stroke  # No digits found, return as is

    digit_to_key = {
        "1": "S",
        "2": "T",
        "3": "P",
        "4": "H",
        "5": "A",
        "0": "O",
        "6": "F",
        "7": "P",
        "8": "L",
        "9": "T",
    }
    plover_stroke = "#"
    for char in stroke:
        if char in digit_to_key:
            plover_stroke += digit_to_key[char]
        else:
            plover_stroke += char  # Keep non-digit characters as they are
    return plover_stroke


def assemble(parsed):
    def initial():
        f = parsed.vowel in ["a", "ă", "â", "o", "ô", "ơ", "u", "ư", "ua/uô", "ưa/ươ"]
        if parsed.initial_consonant == "ng/ngh":
            return "ng" if parsed.on_glide or f else "ngh"
        if parsed.initial_consonant == "g":
            return "g" if parsed.on_glide or f else "gh"
        if parsed.initial_consonant == "gi":
            return "g" if not parsed.on_glide and parsed.vowel == "i" else "gi"
        if parsed.initial_consonant == "c":
            return "q" if parsed.on_glide else "c" if f else "k"
        return parsed.initial_consonant

    def middle():
        if parsed.vowel == "iê/ia":
            if parsed.initial_consonant == "":
                return ("uy" if parsed.on_glide else "y") + tone_accents["ê"][
                    parsed.tone
                ]
            if parsed.on_glide:
                if parsed.final_consonant == "":
                    return "uy" + tone_accents["a"][parsed.tone]
                return "uy" + tone_accents["ê"][parsed.tone]
            if parsed.final_consonant == "":
                return tone_accents["i"][parsed.tone] + "a"
            return "i" + tone_accents["ê"][parsed.tone]
        if parsed.vowel == "ua/uô":
            return (
                tone_accents["u"][parsed.tone] + "a"
                if parsed.final_consonant == ""
                else "u" + tone_accents["ô"][parsed.tone]
            )
        if parsed.vowel == "ưa/ươ":
            return (
                tone_accents["ư"][parsed.tone] + "a"
                if parsed.final_consonant == ""
                else "ư" + tone_accents["ơ"][parsed.tone]
            )
        if parsed.vowel == "i":
            if parsed.on_glide:
                return (
                    (
                        tone_accents["u"][parsed.tone] + "y"
                        if parsed.initial_consonant != "c"
                        else "u" + tone_accents["y"][parsed.tone]
                    )
                    if parsed.final_consonant == ""
                    else "u" + tone_accents["y"][parsed.tone]
                )
            return tone_accents["i"][parsed.tone]
        if parsed.vowel == "ă" and parsed.final_consonant in ["w", "j"]:
            return (
                ("u" if parsed.initial_consonant == "c" else "o")
                if parsed.on_glide
                else ""
            ) + tone_accents["a"][parsed.tone]
        if parsed.vowel in ["â", "ê"] and parsed.on_glide:
            return "u" + tone_accents[parsed.vowel][parsed.tone]
        if parsed.initial_consonant == "c" and parsed.on_glide:
            return "u" + tone_accents[parsed.vowel][parsed.tone]
        if parsed.on_glide:
            return (
                tone_accents["o"][parsed.tone] + parsed.vowel
                if parsed.final_consonant == ""
                else "o" + tone_accents[parsed.vowel][parsed.tone]
            )
        return tone_accents[parsed.vowel][parsed.tone]

    def final():
        if parsed.final_consonant == "w":
            if parsed.vowel in ["iê/ia", "ư", "ê", "u", "ă", "â", "i"]:
                return "u"
            return "o"
        if parsed.final_consonant == "j":
            if parsed.vowel in ["ă", "â"]:
                return "y"
            return "i"
        return parsed.final_consonant

    return initial() + middle() + final()


def capitalize(x):
    return x[0].upper() + x[1:]


LONGEST_KEY = 1


def lookup(stroke):
    stroke = denumeralize_stroke(stroke[0])
    if stroke == "-S":
        return "{^};"
    if stroke == "-Z":
        return "{^}'"
    if stroke == "-D":
        return "{^}["
    if stroke == "AO":
        return "{^}-{^}"
    if stroke.startswith("#"):
        return capitalize(assemble(parse(stroke[1:])))
    return assemble(parse(stroke))
