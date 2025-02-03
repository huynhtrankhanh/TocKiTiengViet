const stenographyMap: Record<string, string> = {
  // Initial Consonants
  PW: "b",
  K: "c",
  KH: "ch",
  KWR: "d",
  TK: "đ",
  TP: "ph",
  TKPW: "g",
  H: "h",
  KWH: "gi",
  KHR: "kh",
  HR: "l",
  PH: "m",
  TPH: "n",
  TPR: "nh",
  TPW: "ng/ngh",
  P: "p",
  R: "r",
  KP: "s",
  T: "t",
  TH: "th",
  TR: "tr",
  W: "v",
  WR: "x",
};

const vowelMap: Record<string, string> = {
  OEU: "iê/ia",
  AEU: "ua/uô",
  AOE: "ưa/uơ",
  AOU: "ư",
  OU: "ơ",
  OE: "ô",
  O: "o",
  AU: "ê",
  E: "e",
  EU: "i",
  A: "a",
  AE: "ă",
  AO: "â",
  U: "u",
};

const finalMap: Record<string, string> = {
  FP: "j",
  F: "w",
  P: "p",
  R: "t",
  BG: "c",
  RB: "ch",
  PB: "nh",
  L: "n",
  PL: "m",
  G: "ng",
  RG: "y",
};

const toneMap: Record<string, string> = {
  T: "sắc",
  S: "huyền",
  D: "hỏi",
  TS: "ngã",
  Z: "nặng",
};

type Parsed = {
  onGlide: boolean;
  initialConsonant: string;
  vowel: string;
  finalConsonant: string;
  tone: string;
};

const parse = (stroke: string): Parsed => {
  const onGlide = stroke.startsWith("S");
  if (onGlide) stroke = stroke.substring(1);

  let initialConsonant = "",
    vowel = "",
    finalConsonant = "",
    tone = "";

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

const toneAccents: Record<string, Record<string, string>> = {
  a: { sắc: "á", huyền: "à", hỏi: "ả", ngã: "ã", nặng: "ạ" },
  ă: { sắc: "ắ", huyền: "ằ", hỏi: "ẳ", ngã: "ẵ", nặng: "ặ" },
  â: { sắc: "ấ", huyền: "ầ", hỏi: "ẩ", ngã: "ẫ", nặng: "ậ" },
  e: { sắc: "é", huyền: "è", hỏi: "ẻ", ngã: "ẽ", nặng: "ẹ" },
  ê: { sắc: "ế", huyền: "ề", hỏi: "ể", ngã: "ễ", nặng: "ệ" },
  i: { sắc: "í", huyền: "ì", hỏi: "ỉ", ngã: "ĩ", nặng: "ị" },
  o: { sắc: "ó", huyền: "ò", hỏi: "ỏ", ngã: "õ", nặng: "ọ" },
  ô: { sắc: "ố", huyền: "ồ", hỏi: "ổ", ngã: "ỗ", nặng: "ộ" },
  ơ: { sắc: "ớ", huyền: "ờ", hỏi: "ở", ngã: "ỡ", nặng: "ợ" },
  u: { sắc: "ú", huyền: "ù", hỏi: "ủ", ngã: "ũ", nặng: "ụ" },
  ư: { sắc: "ứ", huyền: "ừ", hỏi: "ử", ngã: "ữ", nặng: "ự" },
};

const testCases: Record<string, string> = {
  "toại nguyện": "STAFPZ STPWOEULZ",
  "đình công": "TKEUPBS KOEG",
  "quyến rũ": "SKOEULT RUTS",
  "móp méo": "PHOPT PHEFT",
  tai: "TAFP",
  mây: "PHAORG",
  mưa: "PHAOE",
  đủ: "TKUD",
  "nguyên vẹn": "STPWOEUL WELZ",
  "thèm muốn": "THEPLS PHAEULT",
  "hoạt động": "SHARZ TKOEGZ",
  "khuynh hướng": "SKHREUPB HAOEGT",
  "giới tính": "KWHOUFPT TEUPBT",
  "tối thui": "TOEFPT THUFP",
  "xoa dịu": "SWRA KWREUFZ",
  "tra soát": "TRA SKPART",
  đau: "TKAEF",
  đao: "TKAF",
};

console.log("Running Test Cases:\n");

const assemble = (parsed: Parsed) => {
  const initial = (() => {
    const f = parsed.vowel === "a" ||
        parsed.vowel === "ă" ||
        parsed.vowel === "â" ||
        parsed.vowel === "o" ||
        parsed.vowel === "ô" ||
        parsed.vowel === "ơ" ||
        parsed.vowel === "u" ||
        parsed.vowel === "ư";
    if (parsed.initialConsonant === "ng/ngh") {
      if (parsed.onGlide) return "ng";
      if (f) return "ng";
      return "ngh";
    }
    if (parsed.initialConsonant === "g") {
      if (parsed.onGlide) return "g";
      if (f) return "g";
      return "gh";
    }
    if (parsed.initialConsonant === "c") {
      if (parsed.onGlide) return "q";
      if (f) return "c";
      return "k";
    }
    return parsed.initialConsonant;
  })();
};

for (const [word, stroke] of Object.entries(testCases)) {
  console.log(
    `${word}:`,
    stroke.split(" ").map((x) => [parse(x), assemble(parse(x))]),
  );
}
