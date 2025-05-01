// --- Type Definitions ---

interface Parsed {
    onGlide: boolean;
    initialConsonant: string; // Vietnamese phoneme/letter
    vowel: string;          // Vietnamese phoneme/letter(s)
    finalConsonant: string; // Vietnamese phoneme/letter
    tone: string;           // Vietnamese tone name (e.g., "sắc")
}

// --- Constants (Maps and Tone Accents) ---
// (Maps remain the same as before)

const stenographyMap: { [key: string]: string } = {
    "PW": "b", "K": "c", "KH": "ch", "KWR": "d", "TK": "đ", "TP": "ph",
    "TKPW": "g", "H": "h", "KWH": "gi", "KHR": "kh", "HR": "l", "PH": "m",
    "TPH": "n", "TPR": "nh", "TPW": "ng/ngh", "P": "p", "R": "r", "KP": "s",
    "T": "t", "TH": "th", "TR": "tr", "W": "v", "WR": "x",
};

const vowelMap: { [key: string]: string } = {
    "OEU": "iê/ia", "AEU": "ua/uô", "AOE": "ưa/ươ", "AOU": "ư", "OU": "ơ",
    "OE": "ô", "O": "o", "AU": "ê", "E": "e", "EU": "i", "A": "a",
    "AE": "ă", "AO": "â", "U": "u", "AOEU": "y",
};

const finalMap: { [key: string]: string } = {
    "FP": "j", "F": "w", "P": "p", "R": "t", "BG": "c", "RB": "ch",
    "PB": "nh", "L": "n", "PL": "m", "G": "ng",
};

const toneMap: { [key: string]: string } = {
    "T": "sắc", "S": "huyền", "D": "hỏi", "TS": "ngã", "Z": "nặng",
};

const toneAccents: { [key: string]: { [key: string]: string } } = {
    "a": { "": "a", "sắc": "á", "huyền": "à", "hỏi": "ả", "ngã": "ã", "nặng": "ạ" },
    "ă": { "": "ă", "sắc": "ắ", "huyền": "ằ", "hỏi": "ẳ", "ngã": "ẵ", "nặng": "ặ" },
    "â": { "": "â", "sắc": "ấ", "huyền": "ầ", "hỏi": "ẩ", "ngã": "ẫ", "nặng": "ậ" },
    "e": { "": "e", "sắc": "é", "huyền": "è", "hỏi": "ẻ", "ngã": "ẽ", "nặng": "ẹ" },
    "ê": { "": "ê", "sắc": "ế", "huyền": "ề", "hỏi": "ể", "ngã": "ễ", "nặng": "ệ" },
    "i": { "": "i", "sắc": "í", "huyền": "ì", "hỏi": "ỉ", "ngã": "ĩ", "nặng": "ị" },
    "o": { "": "o", "sắc": "ó", "huyền": "ò", "hỏi": "ỏ", "ngã": "õ", "nặng": "ọ" },
    "ô": { "": "ô", "sắc": "ố", "huyền": "ồ", "hỏi": "ổ", "ngã": "ỗ", "nặng": "ộ" },
    "ơ": { "": "ơ", "sắc": "ớ", "huyền": "ờ", "hỏi": "ở", "ngã": "ỡ", "nặng": "ợ" },
    "u": { "": "u", "sắc": "ú", "huyền": "ù", "hỏi": "ủ", "ngã": "ũ", "nặng": "ụ" },
    "ư": { "": "ư", "sắc": "ứ", "huyền": "ừ", "hỏi": "ử", "ngã": "ữ", "nặng": "ự" },
    "y": { "": "y", "sắc": "ý", "huyền": "ỳ", "hỏi": "ỷ", "ngã": "ỹ", "nặng": "ỵ" },
};

const digitToKey: { [key: string]: string } = {
    "1": "S", "2": "T", "3": "P", "4": "H", "5": "A",
    "0": "O", "6": "F", "7": "P", "8": "L", "9": "T",
};


// --- Helper Functions ---
// (parse, assemble, denumeralizeStroke, capitalize remain the same as before)

function parse(stroke: string): Parsed | null {
    let currentStroke = stroke;
    const onGlide = currentStroke.startsWith("S");
    if (onGlide) {
        currentStroke = currentStroke.substring(1);
    }

    let initialConsonantSteno = "";
    let initialConsonant = "";
    let vowelSteno = "";
    let vowel = "";
    let finalConsonantSteno = "";
    let finalConsonant = "";
    let toneSteno = "";
    let tone = "";

    let foundInitial = false;
    const initialKeys = Object.keys(stenographyMap).sort((a, b) => b.length - a.length);
    for (const key of initialKeys) {
        if (currentStroke.startsWith(key)) {
            initialConsonantSteno = key;
            initialConsonant = stenographyMap[key];
            currentStroke = currentStroke.substring(key.length);
            foundInitial = true;
            break;
        }
    }
    if (!foundInitial && currentStroke.length > 0 && !(Object.keys(vowelMap).some(vKey => currentStroke.startsWith(vKey)))) {
        // If no initial consonant found AND the remaining doesn't start with a vowel key, it's likely invalid unless empty
    } else if (!foundInitial) {
        initialConsonant = ""; // Valid case: no initial consonant
    }


    let foundVowel = false;
    const vowelKeys = Object.keys(vowelMap).sort((a, b) => b.length - a.length);
    for (const key of vowelKeys) {
        if (currentStroke.startsWith(key)) {
            vowelSteno = key;
            vowel = vowelMap[key];
            currentStroke = currentStroke.substring(key.length);
            foundVowel = true;
            break;
        }
    }
    if (!foundVowel) {
         // console.error(`Failed to parse vowel for stroke: ${stroke}, remaining: ${currentStroke}`);
        return null; // Must have a vowel
    }

    let foundFinal = false;
    const finalKeys = Object.keys(finalMap).sort((a, b) => b.length - a.length);
    for (const key of finalKeys) {
        if (currentStroke.startsWith(key)) {
            finalConsonantSteno = key;
            finalConsonant = finalMap[key];
            currentStroke = currentStroke.substring(key.length);
            foundFinal = true;
            break;
        }
    }
     if (!foundFinal) {
        finalConsonant = ""; // Valid case: no final consonant
    }

    if (currentStroke.length > 0) {
        if (toneMap[currentStroke] !== undefined) {
            toneSteno = currentStroke;
            tone = toneMap[currentStroke];
            currentStroke = "";
        } else {
            // console.error(`Invalid remaining characters (tone?) for stroke: ${stroke}, remaining: ${currentStroke}`);
            return null; // Invalid ending
        }
    } else {
        tone = ""; // No tone specified
    }

    if (currentStroke.length !== 0) {
         // console.error(`Characters remaining after parsing stroke: ${stroke}, remaining: ${currentStroke}`);
        return null;
    }

    return { onGlide, initialConsonant, vowel, finalConsonant, tone };
}

function assemble(parsed: Parsed): string {
  const initial = (): string => {
    const f = ["a", "ă", "â", "o", "ô", "ơ", "u", "ư", "ua/uô", "ưa/ươ"].includes(parsed.vowel);
    switch (parsed.initialConsonant) {
      case "ng/ngh":
        return (parsed.onGlide || f) ? "ng" : "ngh";
      case "g":
        return (parsed.onGlide || f) ? "g" : "gh";
      case "gi":
        return (!parsed.onGlide && parsed.vowel === "i") ? "g" : "gi";
      case "c":
        if (parsed.onGlide) return "q";
        return f ? "c" : "k";
      default:
        return parsed.initialConsonant;
    }
  };

  const middle = (): string => {
    if (parsed.vowel === "iê/ia") {
      if (parsed.initialConsonant === "") {
        return (parsed.onGlide ? "uy" : "y") + toneAccents["ê"][parsed.tone];
      }
      if (parsed.onGlide) {
        return "uy" + toneAccents[parsed.finalConsonant === "" ? "a" : "ê"][parsed.tone];
      }
      if (parsed.finalConsonant === "") {
        return toneAccents["i"][parsed.tone] + "a";
      }
      return "i" + toneAccents["ê"][parsed.tone];
    }

    if (parsed.vowel === "ua/uô") {
      return parsed.finalConsonant === ""
        ? toneAccents["u"][parsed.tone] + "a"
        : "u" + toneAccents["ô"][parsed.tone];
    }

    if (parsed.vowel === "ưa/ươ") {
      return parsed.finalConsonant === ""
        ? toneAccents["ư"][parsed.tone] + "a"
        : "ư" + toneAccents["ơ"][parsed.tone];
    }

    if (parsed.vowel === "i") {
      if (parsed.onGlide) {
        if (parsed.finalConsonant === "") {
          return parsed.initialConsonant !== "c"
            ? toneAccents["u"][parsed.tone] + "y"
            : "u" + toneAccents["y"][parsed.tone];
        }
        return "u" + toneAccents["y"][parsed.tone];
      }
      return toneAccents["i"][parsed.tone];
    }

    if (parsed.vowel === "ă" && ["w", "j"].includes(parsed.finalConsonant)) {
      return (parsed.onGlide
        ? (parsed.initialConsonant === "c" ? "u" : "o")
        : ""
      ) + toneAccents["a"][parsed.tone];
    }

    if (["â", "ê"].includes(parsed.vowel) && parsed.onGlide) {
      return "u" + toneAccents[parsed.vowel][parsed.tone];
    }

    if (parsed.initialConsonant === "c" && parsed.onGlide) {
      return "u" + toneAccents[parsed.vowel][parsed.tone];
    }

    if (parsed.onGlide) {
      return parsed.finalConsonant === ""
        ? toneAccents["o"][parsed.tone] + parsed.vowel
        : "o" + toneAccents[parsed.vowel][parsed.tone];
    }

    return toneAccents[parsed.vowel][parsed.tone];
  };

  const final = (): string => {
    if (parsed.finalConsonant === "w") {
      return ["iê/ia", "ư", "ê", "u", "ă", "â", "i"].includes(parsed.vowel)
        ? "u"
        : "o";
    }
    if (parsed.finalConsonant === "j") {
      return ["ă", "â"].includes(parsed.vowel) ? "y" : "i";
    }
    return parsed.finalConsonant;
  };

  return `${initial()}${middle()}${final()}`;
}


function denumeralizeStroke(stroke: string): string {
    if (stroke.startsWith("#")) {
        return stroke;
    }
    let hasDigit = false;
    for (const char of stroke) {
        if (/\d/.test(char)) {
            hasDigit = true;
            break;
        }
    }
    if (!hasDigit) {
        return stroke;
    }
    let ploverStroke = "#";
    for (const char of stroke) {
        ploverStroke += digitToKey[char] ?? char;
    }
    return ploverStroke;
}

function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// --- SyllableParseinator Class ---

class SyllableParseinator {
    // Forward cache: stroke -> syllable
    private forwardCache: Map<string, string>;
    // Reverse cache: syllable -> shortest_stroke
    private reverseCache: Map<string, string>;
    public readonly longestKey = 1;

    constructor() {
        this.forwardCache = new Map<string, string>();
        this.reverseCache = new Map<string, string>();
        this.initializeCaches();
    }

    private initializeCaches(): void {
        console.log("Initializing syllable caches...");
        const start = performance.now();
        let generatedCount = 0;
        let validForwardCount = 0;

        // --- Step 1: Populate Forward Cache (stroke -> syllable) ---
        const initialStenoKeys = ["", ...Object.keys(stenographyMap)];
        const vowelStenoKeys = Object.keys(vowelMap);
        const finalStenoKeys = ["", ...Object.keys(finalMap)];
        const toneStenoKeys = ["", ...Object.keys(toneMap)];
        const glideOptions = [false, true];

        for (const useGlide of glideOptions) {
            const glidePrefix = useGlide ? "S" : "";
            for (const initialKey of initialStenoKeys) {
                for (const vowelKey of vowelStenoKeys) {
                    for (const finalKey of finalStenoKeys) {
                        for (const toneKey of toneStenoKeys) {
                            generatedCount++;
                            const stroke = glidePrefix + initialKey + vowelKey + finalKey + toneKey;
                            if (stroke === "" || stroke === "S") continue;

                            try {
                                const parsed = parse(stroke);
                                if (parsed) {
                                    const assembled = assemble(parsed);
                                    if (assembled && assembled.length > 0) { // Ensure assembly is valid and not empty
                                        this.forwardCache.set(stroke, assembled);
                                        validForwardCount++;
                                    }
                                }
                            } catch (e) {
                                // Ignore errors during initial generation
                            }
                        }
                    }
                }
            }
        }
        console.log(`Forward cache populated. Generated: ${generatedCount}, Valid syllables: ${validForwardCount}.`);


        // --- Step 2: Populate Reverse Cache (syllable -> shortest stroke) ---
        console.log("Populating reverse cache (syllable -> shortest stroke)...");
        for (const [stroke, syllable] of this.forwardCache.entries()) {
            const existingStroke = this.reverseCache.get(syllable);
            // If syllable not seen before, or current stroke is shorter than existing one
            if (!existingStroke || stroke.length < existingStroke.length) {
                this.reverseCache.set(syllable, stroke);
            }
             // Optional: Add tie-breaking logic here if needed (e.g., prefer non-glide?)
        }

        const end = performance.now();
        console.log(`Cache initialization complete. Reverse cache size: ${this.reverseCache.size}. Time: ${((end - start)/1000).toFixed(2)}s`);
    }

    /**
     * Looks up the Vietnamese syllable corresponding to a stenography stroke.
     * Handles denumeralization and capitalization (# prefix).
     * @param strokes - An array containing the stenography stroke(s). Expects one stroke.
     * @returns The Vietnamese syllable string or undefined if not found/invalid.
     */
    public lookup(strokes: string[]): string | undefined {
         if (!strokes || strokes.length === 0) {
            return undefined;
        }
        const rawStroke = strokes[0];

        // Handle special cases directly
        switch(rawStroke) {
            case "-S": return "{^};";
            case "-Z": return "{^}'";
            case "-D": return "{^}[";
            case "AO": return "{^}-{^}";
        }

        const stroke = denumeralizeStroke(rawStroke);

        if (stroke.startsWith("#")) {
            const coreStroke = stroke.substring(1);
            const result = this.forwardCache.get(coreStroke); // Use forward cache here
            return result ? capitalize(result) : undefined;
        } else {
            return this.forwardCache.get(stroke); // Use forward cache here
        }
    }

    /**
     * Looks up the shortest stenography stroke corresponding to a Vietnamese syllable.
     * @param syllable - The Vietnamese syllable string (case-insensitive).
     * @returns The shortest steno stroke or undefined if not found.
     */
    public reverseLookup(syllable: string): string | undefined {
        if (!syllable) {
            return undefined;
        }
        // Normalize input syllable to lowercase to match cache keys
        const normalizedSyllable = syllable.toLowerCase();
        return this.reverseCache.get(normalizedSyllable);
    }

     // --- Accessor methods for debugging/info ---
     public getForwardCacheSize(): number {
        return this.forwardCache.size;
    }
    public getReverseCacheSize(): number {
        return this.reverseCache.size;
    }
     public static parseStroke(stroke: string): Parsed | null {
         return parse(stroke);
     }
     public static assembleParsed(parsed: Parsed): string {
         return assemble(parsed);
     }
}

// --- Example Usage ---

const mapper = new SyllableParseinator();

const processWord = (x: string): string | undefined => {
    const syllables = x.toLowerCase().split(" ");
    if (syllables.length !== 2) return;
    const [a, b] = syllables;
    const strokeA = mapper.reverseLookup(a);
    if (strokeA === undefined) return;
    const parsedA = parse(strokeA)!;
    const strokeB = mapper.reverseLookup(b);
    if (strokeB === undefined) return;
    const parsedB = parse(strokeB)!;
    // 8 tone system, this is not the ordinary linguistic analysis of Vietnamese tones
    type Tone = "ngang" | "sắc" | "huyền" | "hỏi" | "ngã" | "nặng" | "ách" | "ạch";
    const getTone = (x: Parsed): Tone => {
        if (x.tone === "huyền" || x.tone === "hỏi" || x.tone === "ngã") return x.tone;
        if (x.tone === "") return "ngang";
        if (x.tone === "sắc") {
            if (x.finalConsonant === "p" || x.finalConsonant === "t" || x.finalConsonant === "ch" || x.finalConsonant === "c") return "ách";
            return "sắc";
        }
        if (x.tone === "nặng") {
            if (x.finalConsonant === "p" || x.finalConsonant === "t" || x.finalConsonant === "ch" || x.finalConsonant === "c") return "ạch";
            return "nặng";
        }
        throw new Error("you've been bamboozled");
    }
    type VowelClass = "a" | "i" | "o" | "e";
    const getVowelClass = (x: Parsed): VowelClass => {
        if (x.onGlide && x.initialConsonant !== "c") return "o";
        if (x.vowel === "iê/ia" || x.vowel === "i" || x.vowel === "y") return "i";
        if (x.vowel === "ua/uô" || x.vowel === "ưa/ươ" || x.vowel === "ư" || x.vowel === "u" || x.vowel === "o" || x.vowel === "ô" || x.vowel === "ơ") return "o";
        if (x.vowel === "a" || x.vowel === "ă" || x.vowel === "â") return "a";
        if (x.vowel === "e" || x.vowel === "ê") return "e";
        throw new Error("ouch");
    };
    type Initial = "b" | "c" | "ch" | "d" | "đ" | "ph" | "g" | "h" | "gi" | "kh" | "l" | "m" | "n" | "nh" | "ng" | "p" | "r" | "s" | "t" | "th" | "tr" | "v" | "x" | "qu";
    const getInitial = (x: Parsed): Initial => {
        if (x.initialConsonant === "ng/ngh") return "ng";
        if (x.initialConsonant === "c" && x.onGlide) return "qu";
        return x.initialConsonant as Initial;
    }
    // now we have enough information to build the outline for the syllable
    // despite the "number" type these are actually bitmaps
    // for consonant:
    // 0 2 3 4
    // 1
    // for tone:
    //   0 1 2
    // for vowel:
    // 0 1
    type Outline = { consonant: number, tone: number, vowel: number };
    const consumeNever = function<T> (x: never): T { return x; };
    const getOutline = (parsed: Parsed): Outline => {
        const initial = getInitial(parsed);
        const tone = getTone(parsed);
        const vowel = getVowelClass(parsed);
        return {
            consonant: (() => {
                // 1: upper key, 2: lower key, 3: both keys
                if (initial === "b") return 2 * 4 + 3;
                if (initial === "c") return 1 * 4 + 1;
                if (initial === "d") return 7 * 4 + 1;
                if (initial === "đ") return 1 * 4 + 3;
                if (initial === "ph") return 3 * 4 + 0;
                if (initial === "g") return 3 * 4 + 3;
                if (initial === "h") return 4 * 4 + 0;
                if (initial === "gi") return 7 * 4 + 2;
                if (initial === "kh") return 5 * 4 + 3;
                if (initial === "l") return 4 * 4 + 3;
                if (initial === "m") return 6 * 4 + 0;
                if (initial === "n") return 7 * 4 + 0;
                if (initial === "nh") return 7 * 4 + 3;
                if (initial === "ng") return 3 * 4 + 1;
                if (initial === "p") return 2 * 4 + 0;
                if (initial === "r") return 4 * 4 + 1;
                if (initial === "s") return 3 * 4 + 2;
                if (initial === "t") return 1 * 4 + 0;
                if (initial === "th") return 5 * 4 + 0;
                if (initial === "tr") return 5 * 4 + 1;
                if (initial === "v") return 2 * 4 + 1;
                if (initial === "x") return 6 * 4 + 1;
                if (initial === "qu") return 3;
                if (initial === "ch") return 5 * 4 + 2;
                return consumeNever(initial);
            })(),
            tone: (() => {
                if (tone === "sắc") return 1;
                if (tone === "huyền") return 2;
                if (tone === "hỏi") return 4;
                if (tone === "ngã") return 3;
                if (tone === "nặng") return 6;
                if (tone === "ách") return 5;
                if (tone === "ạch") return 7;
                if (tone === "ngang") return 0;
                return consumeNever(tone);
            })(),
            vowel: (() => {
                if (vowel === "a") return 1;
                if (vowel === "o") return 2;
                if (vowel === "i") return 3;
                if (vowel === "e") return 0;
                return consumeNever(vowel);
            })()
        };
    };
    const helpers = (outline: Outline) => {
        const a = (m: number, x: string): string => (outline.consonant >> m & 1) !== 0 ? x : "";
        const b = (m: number, x: string): string => (outline.tone >> m & 1) !== 0 ? x : "";
        const c = (m: number, x: string): string => (outline.vowel >> m & 1) !== 0 ? x : "";
        return { a, b, c };
    }
    const leftHand = (() => {
        const { a, b, c } = helpers(getOutline(parsedA));
        return a(0, "#") + a(1, "S") + a(2, "T") + b(0, "K") + a(3, "P") + b(1, "W") + a(4, "H") + b(2, "R") + c(0, "A") + c(1, "O");
    })();
    const rightHand = (() => {
        const { a, b, c } = helpers(getOutline(parsedB));
        return c(1, "E") + c(0, "U") + a(4, "F") + b(2, "R") + a(3, "P") + b(1, "B") + a(2, "L") + b(0, "G") + a(0, "T") + a(1, "S");
    })();
    return leftHand + "*" + rightHand;
}

const processDictionary = (words: string[]) => {
    const strokes = words.filter(x => x === x.toLowerCase()).sort().map((word): [string, string | undefined] => [word, processWord(word)]).filter(x => x[1] !== undefined);
    const conflict = new Map<string, number>();
    const disambiguate = (stroke: string, variant: number) => {
        if (variant === 0) return stroke;
        if (variant === 1) return stroke + "D";
        if (variant === 2) return stroke + "DZ";
        if (variant === 3) return stroke + "Z";
        if (variant === 4) return stroke.split("*").join("-") + "D";
        if (variant === 5) return stroke.split("*").join("-") + "DZ";
        if (variant === 6) return stroke.split("*").join("-") + "Z";
        throw new Error("bamboozle");
    };
    const map: Record<string, string> = {};
    for (const [word, stroke1] of strokes) {
        const stroke = stroke1!;
        const variant = (() => {
            if (!conflict.has(stroke)) {
                conflict.set(stroke, 1);
                return 0;
            } else {
                conflict.set(conflict.get(stroke)! + 1);
                return conflict.get(stroke)! - 1;
            }
        })();
        if (variant >= 7) {
            // ought to throw under the bus
            continue;
        }
        map[disambiguate(stroke, variant)] = word;
    }
    return map;
};
