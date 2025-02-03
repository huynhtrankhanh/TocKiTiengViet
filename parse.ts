const stenographyMap: Record<string, string> = {
  // Initial Consonants
  "PW": "b", "K": "c", "KH": "ch", "KWR": "d", "TK": "đ",
  "TP": "ph", "TKPW": "g", "H": "h", "KWH": "gi", "KHR": "kh",
  "HR": "l", "PH": "m", "TPH": "n", "TPR": "nh", "TPW": "ng/ngh",
  "P": "p", "R": "r", "KP": "s", "T": "t", "TH": "th",
  "TR": "tr", "W": "v", "WR": "x",
};

const vowelMap: Record<string, string> = {
  "OEU": "iê/ia", "AEU": "ua/uô", "AOE": "ưa/uơ",
  "AOU": "ư", "OU": "ơ", "OE": "ô", "O": "o",
  "AU": "ê", "E": "e", "EU": "i", "A": "a",
  "AE": "ă", "AO": "â", "U": "u"
};

const finalMap: Record<string, string> = {
  "FP": "j", "F": "w", "P": "p", "R": "t",
  "BG": "c", "RB": "ch", "PB": "nh", "L": "n",
  "PL": "m", "G": "ng", "RG": "y"
};

const toneMap: Record<string, string> = {
  "T": "sắc", "S": "huyền", "D": "hỏi",
  "TS": "ngã", "Z": "nặng"
};

const parse = (stroke: string) => {
  const onGlide = stroke.startsWith("S");
  if (onGlide) stroke = stroke.substring(1);

  let initialConsonant = "", vowel = "", finalConsonant = "", tone = "";

  // Match Initial Consonant (3 -> 2 -> 1 letter)
  for (let len = 3; len > 0; len--) {
    const candidate = stroke.substring(0, len);
    if (stenographyMap[candidate]) {
      initialConsonant = stenographyMap[candidate];
      stroke = stroke.substring(len);
      break;
    }
  }

  // Match Vowel (3 -> 2 -> 1 letter)
  for (let len = 3; len > 0; len--) {
    const candidate = stroke.substring(0, len);
    if (vowelMap[candidate]) {
      vowel = vowelMap[candidate];
      stroke = stroke.substring(len);
      break;
    }
  }

  // Match Final Consonant (2 -> 1 letter)
  for (let len = 2; len > 0; len--) {
    const candidate = stroke.substring(0, len);
    if (finalMap[candidate]) {
      finalConsonant = finalMap[candidate];
      stroke = stroke.substring(len);
      break;
    }
  }

  // Match Tone (if anything left, it must be a tone)
  if (toneMap[stroke]) {
    tone = toneMap[stroke];
    stroke = "";
  }

  return { onGlide, initialConsonant, vowel, finalConsonant, tone };
};

// Example Cases:
console.log(parse("SPWAOEPLT"));  // { onGlide: true, initialConsonant: 'b', vowel: 'ưa/uơ', finalConsonant: 'm', tone: 'sắc' }
console.log(parse("TPWOEPLS"));   // { onGlide: false, initialConsonant: 'ng/ngh', vowel: 'ô', finalConsonant: 'm', tone: 'huyền' }
console.log(parse("KHOEU"));      // { onGlide: false, initialConsonant: 'ch', vowel: 'iê/ia', finalConsonant: '', tone: '' }
console.log(parse("KWRAT"));      // { onGlide: false, initialConsonant: 'd', vowel: 'a', finalConsonant: '', tone: 'sắc' }
console.log(parse("THAOEG"));     // { onGlide: false, initialConsonant: 'th', vowel: 'ưa/uơ', finalConsonant: 'ng', tone: '' }
