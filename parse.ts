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
  AOE: "ưa/ươ",
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
  a: { "": "a", sắc: "á", huyền: "à", hỏi: "ả", ngã: "ã", nặng: "ạ" },
  ă: { "": "ă", sắc: "ắ", huyền: "ằ", hỏi: "ẳ", ngã: "ẵ", nặng: "ặ" },
  â: { "": "â", sắc: "ấ", huyền: "ầ", hỏi: "ẩ", ngã: "ẫ", nặng: "ậ" },
  e: { "": "e", sắc: "é", huyền: "è", hỏi: "ẻ", ngã: "ẽ", nặng: "ẹ" },
  ê: { "": "ê", sắc: "ế", huyền: "ề", hỏi: "ể", ngã: "ễ", nặng: "ệ" },
  i: { "": "i", sắc: "í", huyền: "ì", hỏi: "ỉ", ngã: "ĩ", nặng: "ị" },
  o: { "": "o", sắc: "ó", huyền: "ò", hỏi: "ỏ", ngã: "õ", nặng: "ọ" },
  ô: { "": "ô", sắc: "ố", huyền: "ồ", hỏi: "ổ", ngã: "ỗ", nặng: "ộ" },
  ơ: { "": "ơ", sắc: "ớ", huyền: "ờ", hỏi: "ở", ngã: "ỡ", nặng: "ợ" },
  u: { "": "u", sắc: "ú", huyền: "ù", hỏi: "ủ", ngã: "ũ", nặng: "ụ" },
  ư: { "": "ư", sắc: "ứ", huyền: "ừ", hỏi: "ử", ngã: "ữ", nặng: "ự" },
  y: { "": "y", sắc: "ý", huyền: "ỳ", hỏi: "ỷ", ngã: "ỹ", nặng: "ỵ"}
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
  thánh: "THAPBT",
  "lánh nạn": "HRAPBT TPHALZ",
  "hoàn hảo": "SHALS HAFD",
  "minh chứng": "PHEUPB KHAOUGT",
  "thách thức": "THARBT THAOUBGT",
  "thưa thớt": "THAOE THOURT",
  "tốc kí": "TOEBGT KEUT",
  "phiêu lưu": "TPOEUF HRAOUF",
  "lâu dài": "HRAOF KWRAFPS",
  "soái ca": "SKPAFPT KA",
  "loài vật": "SHRAFPS WAORZ",
  "uyển chuyển": "SOEULD SKHOEULD",
  "òa khóc": "SAS KHROBGT"
};

console.log("Running Test Cases:\n");

const assemble = (parsed: Parsed) => {
  const initial = (() => {
    const f =
      parsed.vowel === "a" ||
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
  const middle = (() => {
    if (parsed.vowel === "iê/ia") {
      if (parsed.initialConsonant === "")
        return (parsed.onGlide ? "uy" : "y") + toneAccents["ê"][parsed.tone];
      if (parsed.onGlide) {
        if (parsed.finalConsonant === "")
          return "uy" + toneAccents["a"][parsed.tone];
        return "uy" + toneAccents["ê"][parsed.tone];
      }
      if (parsed.finalConsonant === "")
        return toneAccents["i"][parsed.tone] + "a";
      return "i" + toneAccents["ê"][parsed.tone];
    }
    if (parsed.vowel === "ua/uô") {
      if (parsed.finalConsonant === "")
        return toneAccents["u"][parsed.tone] + "a";
      return "u" + toneAccents["ô"][parsed.tone];
    }
    if (parsed.vowel === "ưa/ươ") {
      if (parsed.finalConsonant === "")
        return toneAccents["ư"][parsed.tone] + "a";
      return "ư" + toneAccents["ơ"][parsed.tone];
    }
    if (parsed.vowel === "i") {
      if (parsed.onGlide) {
        if (parsed.finalConsonant === "") return toneAccents["u"][parsed.tone] + "y";
        return "u" + toneAccents["y"][parsed.tone];
      }
      return toneAccents["i"][parsed.tone];
    }
    if (parsed.vowel === "ă" && parsed.finalConsonant === "w") {
      if (parsed.onGlide) return "u" + toneAccents["a"][parsed.tone];
      return toneAccents["a"][parsed.tone];
    }
    if (parsed.initialConsonant === "c" && parsed.onGlide)
      return "u" + toneAccents[parsed.vowel][parsed.tone];
    if (parsed.onGlide) {
      if (parsed.finalConsonant === "")
        return toneAccents["o"][parsed.tone] + parsed.vowel;
      return "o" + toneAccents[parsed.vowel][parsed.tone];
    }
    return toneAccents[parsed.vowel][parsed.tone];
  })();
  const final = (() => {
    if (parsed.finalConsonant === "w") {
      if (
        parsed.vowel === "iê/ia" ||
        parsed.vowel === "ư" ||
        parsed.vowel === "ê" ||
        parsed.vowel === "u" ||
        parsed.vowel === "ă" ||
        parsed.vowel === "â" ||
        parsed.vowel === "i"
      )
        return "u";
      return "o";
    }
    if (parsed.finalConsonant === "j") return "i";
    return parsed.finalConsonant;
  })();
  return initial + middle + final;
};

for (const [word, stroke] of Object.entries(testCases)) {
  console.log(
    `${word}:`,
    stroke.split(" ").map((x) => [parse(x), assemble(parse(x))]),
  );
}
