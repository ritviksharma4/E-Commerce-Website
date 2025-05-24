import json
import re

# Load dataset
with open("ner_training_data_final_v2.json", "r") as f:
    data = json.load(f)

# === Canonical dictionaries (build from your instructions) ===

# Size variants
sizes = {"xxs", "xs", "s", "m", "l", "xl", "xxl", "small", "medium", "large"}

# Composition materials
compositions = {
    "polyester", "cotton", "nylon", "leather", "viscose", "wool", "velvet",
    "acrylic", "spandex", "elastane", "lycra", "resin", "canvas", "mesh",
    "brass", "copper", "alloy", "rubber", "plastic", "tpu", "pvc", "silk"
}

# Gender tokens
genders = {"men", "women", "unisex", "man", "boy", "boys", "guys", "guy", "dude", "dudes", 
            "male", "female", "ladies", "lady", "girl", "girls", "woman"}

# Subcategories
subcategories = {
    "dresses", "jackets", "jackets-and-blazers", "sweaters-and-cardigans",
    "sweatshirts-and-hoodies", "t-shirts-and-shirts", "trousers",
    "bags", "caps-and-scarves", "ear-rings-and-bracelets",
    "heels-and-sandals", "shoes", "dress", "blazer", "jacket", "bracelet", "shirt", "trouser", "skirt",
    "sandals", "sweater", "cardigan", "hoodie", "tshirt", "top", "sweaters", "cardigans", "sweatshirts", "sweatshirt", "hoodies",
    "tshirts", "shirts", "trouser", "bag", "cap", "caps", "scarf", "scarves", "ear-rings", "ear-ring", "earring", "earrings", "bracelets",
    "heels", "sandals", "heel", "sandal", "shoe"
}

# Flattened color variants (from your color_mappings)
with open("../color_mappings.json", "r") as f:
    color_map = json.load(f)

color_variants = {
    re.sub(r"[^\w\-]", "", v.lower())
    for variants in color_map.values()
    for v in variants
}

# Utility to normalize tokens
def normalize(token):
    return re.sub(r"[^\w\-]", "", token.lower())

# Validate tagging logic
def check_expected_label(token, label):
    t = normalize(token)
    if t in sizes and "SIZE" not in label:
        return f"Expected SIZE for token '{token}' but got {label}"
    if t in compositions and "COMPOSITION" not in label:
        return f"Expected COMPOSITION for token '{token}' but got {label}"
    if t in genders and "GENDER" not in label:
        return f"Expected GENDER for token '{token}' but got {label}"
    if t in subcategories and "SUBCATEGORY" not in label:
        return f"Expected SUBCATEGORY for token '{token}' but got {label}"
    if t in color_variants and "COLOR" not in label:
        return f"Expected COLOR for token '{token}' but got {label}"
    if ("B-" in label or "I-" in label) and all([
        t not in sizes,
        t not in compositions,
        t not in genders,
        t not in subcategories,
        t not in color_variants,
    ]):
        return f"Label {label} applied to non-entity token '{token}'"
    return None

def validate_dataset(dataset):
    errors = 0
    for i, entry in enumerate(dataset):
        tokens = entry.get("tokens", [])
        labels = entry.get("labels", [])
        if len(tokens) != len(labels):
            print(f"❌ Length mismatch in entry {i}")
            errors += 1
            continue

        last_label = "O"
        for j, (tok, tag) in enumerate(zip(tokens, labels)):
            # BIO rules
            if tag.startswith("I-"):
                if last_label[2:] != tag[2:] or last_label == "O":
                    print(f"❌ Invalid BIO sequence at sample {i}, token {j}: {tag} follows {last_label}")
                    errors += 1
            last_label = tag

            # Semantic validation
            mismatch = check_expected_label(tok, tag)
            if mismatch:
                print(f"⚠️ {mismatch} at sample {i}, token {j}")
                errors += 1
    print(f"\n✅ Validation complete with {errors} total issue(s).")

# Run
validate_dataset(data)