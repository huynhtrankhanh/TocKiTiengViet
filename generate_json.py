import json
import parse
from plover_stroke import BaseStroke
import plover.system.english_stenotype as english_stenotype

def generate_dictionary():
    # Setup Plover Stroke with English Stenotype keys
    BaseStroke.setup(english_stenotype.KEYS)

    initials = [""] + list(parse.stenography_map.keys())
    vowels = list(parse.vowel_map.keys())
    finals = [""] + list(parse.final_map.keys())
    tones = [""] + list(parse.tone_map.keys())
    glides = ["", "S"]

    dictionary = {}

    # Pre-calculate count
    total = len(initials) * len(vowels) * len(finals) * len(tones) * len(glides)
    print(f"Generating {total} combinations...")

    count = 0
    valid_count = 0

    for glide in glides:
        for initial in initials:
            for vowel in vowels:
                for final in finals:
                    for tone in tones:
                        raw_stroke = glide + initial + vowel + final + tone

                        try:
                            steno_obj = BaseStroke.from_steno(raw_stroke)
                            canonical_stroke = str(steno_obj)
                        except ValueError:
                            # This shouldn't happen given our construction, but good safety
                            print(f"Invalid stroke generated: {raw_stroke}")
                            continue

                        try:
                            # parse.lookup expects a tuple of strokes (Plover convention)
                            translation = parse.lookup((canonical_stroke,))
                            dictionary[canonical_stroke] = translation

                            capitalized_stroke = "#" + canonical_stroke
                            # For capitalized, pass as tuple too
                            capitalized_translation = parse.lookup((capitalized_stroke,))
                            dictionary[capitalized_stroke] = capitalized_translation

                            valid_count += 1

                        except KeyError:
                            pass
                        except Exception as e:
                            print(f"Error processing {canonical_stroke}: {e}")

                        count += 1
                        if count % 10000 == 0:
                            print(f"Processed {count}/{total}")

    special_cases = {
        "-S": "{^};",
        "-Z": "{^}'",
        "-D": "{^}[",
        "AO": "{^}-{^}"
    }

    for k, v in special_cases.items():
        dictionary[k] = v

    print(f"Finished. Generated {valid_count} entries (base). Total dictionary size: {len(dictionary)}")

    output_file = "vietnamese_steno.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(dictionary, f, ensure_ascii=False, indent=0)
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    generate_dictionary()
