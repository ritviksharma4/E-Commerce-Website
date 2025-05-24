import json
import random
from itertools import chain

# BIO tagging helper
def bio_tag(tokens, label):
    return [f"B-{label}"] + [f"I-{label}"] * (len(tokens) - 1)

# Data generator
def generate_sample(sizes, colors, compositions, genders, all_subcategory_options):
    tokens, labels = [], []

    # Define fields and their selection probabilities
    field_definitions = [
        ("SIZE", sizes, 0.85),
        ("COLOR", colors, 0.90),
        ("COMPOSITION", compositions, 0.80),
        ("GENDER", genders, 0.90),
        ("SUBCATEGORY", all_subcategory_options, 1.0),  # Always included
    ]

    # Randomize field order to avoid any fixed sequence
    random.shuffle(field_definitions)

    chunks = []
    for label, choices, prob in field_definitions:
        if random.random() < prob:
            val = random.choice(choices)
            words = val.lower().strip().split()
            chunks.append((words, label))

    # Add optional natural language prefix
    if random.random() > 0.5:
        prefix = random.choice([
            ["i", "want", "a"], ["looking", "for"], ["buy"], ["need"], ["get", "me", "a"]
        ])
        tokens.extend(prefix)
        labels.extend(["O"] * len(prefix))

    # Add entity chunks (in already randomized order)
    for words, label in chunks:
        tokens.extend(words)
        labels.extend(bio_tag(words, label))

    return {"tokens": tokens, "labels": labels}


if __name__ == "__main__": 

    # Training Datapoints Count
    training_data_points = 50000

    # Define canonical sets
    sizes = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "small", "medium", "large"]
    compositions = [
        "polyester", "cotton", "nylon", "leather", "viscose", "wool", "velvet",
        "acrylic", "spandex", "elastane", "lycra", "resin", "canvas", "mesh",
        "brass", "copper", "alloy", "rubber", "plastic", "tpu", "pvc", "silk"
    ]
    genders = ["men", "women", "unisex", "man", "boy", "boys", "guys", "guy", "dude", "dudes", 
               "male", "female", "ladies", "lady", "girl", "girls", "woman"]
    subcategory_variants = {
        "dresses": ["dress", "dresses"],
        "jackets": ["jacket", "jackets", "blazer", "blazers"],
        "sweaters-and-cardigans": ["sweater", "sweaters", "cardigan", "cardigans"],
        "sweatshirts-and-hoodies": ["sweatshirt", "hoodie", "sweatshirts", "hoodies"],
        "t-shirts-and-shirts": ["t-shirt", "t-shirts","tshirts", "tshirt", "t shirt", "t shirts", "shirt", "shirts"],
        "trousers": ["trouser", "trousers", "pants"],
        "bags": ["bag", "bags", "handbag", "backpack"],
        "caps-and-scarves": ["cap", "caps", "scarf", "scarves"],
        "ear-rings-and-bracelets": ["earring", "earrings", "ear-ring", "ear-rings", "bracelet", "bracelets"],
        "heels-and-sandals": ["heel", "heels", "sandal", "sandals"],
        "shoes": ["shoe", "shoes", "sneaker", "sneakers", "footwear"]
    }

    # Flatten all possible options for use
    all_subcategory_options = list(set(chain.from_iterable(subcategory_variants.values())))

    # Load color mappings
    with open("../color_mappings.json") as f:
        color_map = json.load(f)
    colors = [variant for variants in color_map.values() for variant in variants]

    print(f"Generating {training_data_points} training data points for Velvet BERT NER Model...")

    # Generate full dataset
    data = [generate_sample(sizes, colors, compositions, genders, all_subcategory_options) for _ in range(training_data_points)]

    # Save to disk
    with open("ner_training_data_final_v2.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Generated ${training_data_points} entries in ner_training_data_final_v2.json")