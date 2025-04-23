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
    const getInitial = (): string => {
        const f = ["a", "ă", "â", "o", "ô", "ơ", "u", "ư", "ua/uô", "ưa/ươ"].includes(parsed.vowel);
        switch (parsed.initialConsonant) {
            case "ng/ngh": return (parsed.onGlide || f) ? "ng" : "ngh";
            case "g":      return (parsed.onGlide || f) ? "g" : "gh";
            case "gi":     return (!parsed.onGlide && parsed.vowel === "i") ? "g" : "gi";
            case "c":      return parsed.onGlide ? "q" : (f ? "c" : "k");
            default:       return parsed.initialConsonant;
        }
    };

    const getMiddle = (): string => {
        const applyTone = (baseVowel: string): string => {
             if (toneAccents[baseVowel] && toneAccents[baseVowel][parsed.tone] !== undefined) {
                return toneAccents[baseVowel][parsed.tone];
             }
             // console.warn(`Applying tone: Vowel "${baseVowel}" or tone "${parsed.tone}" not found in toneAccents map. Using base vowel.`);
             return baseVowel;
        };

        switch (parsed.vowel) {
            case "iê/ia":
                if (parsed.initialConsonant === "") {
                    return (parsed.onGlide ? "uy" : "y") + applyTone("ê");
                }
                if (parsed.onGlide) {
                    return "uy" + (parsed.finalConsonant === "" ? applyTone("a") : applyTone("ê"));
                }
                return parsed.finalConsonant === "" ? (applyTone("i") + "a") : ("i" + applyTone("ê"));

            case "ua/uô":
                return parsed.finalConsonant === "" ? (applyTone("u") + "a") : ("u" + applyTone("ô"));

            case "ưa/ươ":
                 return parsed.finalConsonant === "" ? (applyTone("ư") + "a") : ("ư" + applyTone("ơ"));

            case "i":
                if (parsed.onGlide) {
                    const initialIsQ = getInitial() === 'q';
                    if (parsed.finalConsonant === "") {
                         return initialIsQ ? ("u" + applyTone("y")) : (applyTone("u") + "y");
                    } else {
                         return "u" + applyTone("y");
                    }
                }
                // Special case: gi + i -> gi (tone on i)
                 if (getInitial() === 'g' && !parsed.onGlide) {
                     return applyTone('i'); // Tone applied to the 'i'
                 }
                 return applyTone("i");


            case "ă":
                if (["w", "j"].includes(parsed.finalConsonant)) {
                    const glidePrefix = parsed.onGlide ? (getInitial() === 'q' ? "u" : "o") : "";
                    return glidePrefix + applyTone("a");
                }
                if (parsed.onGlide) {
                     return (getInitial() === 'q' ? 'u' : 'o') + applyTone('ă');
                }
                return applyTone("ă");

            case "â": // e.g., quâ -> Q + u + â
            case "ê": // e.g., quê -> Q + u + ê
                 if (parsed.onGlide) {
                      // If 'c' initial becomes 'q', glide is 'u'. If other initial, glide is 'o'.
                     const glide = getInitial() === 'q' ? 'u' : 'o';
                     return glide + applyTone(parsed.vowel);
                 }
                 return applyTone(parsed.vowel);

             default: // Other vowels like a, o, ô, ơ, u, ư, y
                 if (parsed.onGlide) {
                     const glide = getInitial() === 'q' ? 'u' : 'o';
                     // Apply tone to the main vowel part
                     // For oa, oe, uy -> tone is on a, e, y
                     if ((glide === 'o' && ['a', 'e'].includes(parsed.vowel)) || (glide === 'u' && parsed.vowel === 'y')) {
                         // Check final consonant: oà vs oai
                         if (parsed.finalConsonant === '') {
                             return applyTone(glide) + parsed.vowel; // Incorrect? Should be oà, oè, uỳ
                         } else {
                            // For cases like oanh, uyên, oach...
                            return glide + applyTone(parsed.vowel);
                         }
                     }
                     // Handle cases like quý, quá, quơ...
                     return glide + applyTone(parsed.vowel);

                 }
                 // No glide, apply tone directly
                 return applyTone(parsed.vowel);
        }
    };

    const getFinal = (): string => {
        switch (parsed.finalConsonant) {
            case "w": // Becomes 'u' or 'o'
                // Based on preceding vowel according to Vietnamese rules
                // i/y, iê, u/uy, uô, ư/ươ, ưu -> ends in 'u' sound written 'u' or 'y'
                // Simple rule: if vowel ends with front/high-ish sound -> u, else -> o
                if (["i", "y", "iê/ia", "u", "ư", "ưa/ươ", "ê"].includes(parsed.vowel)) return "u";
                 // ă + w -> au (e.g. lau)
                 if (parsed.vowel === 'ă') return "u";
                  // â + w -> âu (e.g. lâu)
                 if (parsed.vowel === 'â') return "u";
                // o/ô/ơ + w -> oo/ôo/ơo -> ou/âu/ơu (actually o/ô/ơ + u)
                 return "o"; // Default rule like ao, eo

            case "j": // Becomes 'i' or 'y'
                 // ă + j -> ay (e.g. lay)
                 if (parsed.vowel === 'ă') return "y";
                 // â + j -> ây (e.g. tây)
                 if (parsed.vowel === 'â') return "y";
                 // Others end in 'i'
                 return "i"; // e.g, oi, ôi, ơi, ui, ưi, ai, ei
            default:
                return parsed.finalConsonant;
        }
    };

    // Combine parts
    const initialPart = getInitial();
    const middlePart = getMiddle();
    const finalPart = getFinal();

    // Post-processing for 'gi' + 'i' case -> 'gi'
    if (initialPart === 'g' && middlePart === toneAccents['i'][parsed.tone] && finalPart === '') {
        return 'g' + toneAccents['i'][parsed.tone];
    }
     // Post-processing qu + middle starting with 'u' -> drop the 'u' from middle
     if (initialPart === 'q' && middlePart.startsWith('u')) {
        // E.g. q + uy... -> quy... not quuy
        return initialPart + middlePart.substring(1) + finalPart;
     }


    return initialPart + middlePart + finalPart;
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
    const parsedB = parse(strokeB);
}
