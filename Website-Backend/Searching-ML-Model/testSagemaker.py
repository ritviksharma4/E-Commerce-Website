import boto3
import json
from collections import defaultdict

# Replace with your actual endpoint name
ENDPOINT_NAME = "velvet-bert-ner-endpoint"
region = "ap-south-1"  # or your chosen region

# Sample color mappings loaded from your color_mappings.json (example)
color_mappings = {
    "Beige": ["Beige", "Cream", "Vanilla Sand", "Whipped Ivory", "Burnt Ivory", "Ivory Noir", "Nude"],
    "Black": [
        "Black",
        "Obsidian Black",
        "Obsidian Noir",
        "Velvét Noir",
        "Snow Obsidian",
        "Charcoal Mist",
        "Noiré Bellé",
        "Obsidian Fade",
        "Charcoal",
        "Black & White",
        "Noir Eclairs",
        "Obsidian Tide",
        "Monochrome Grid",
        "Noir",
        "Ivory Noir"
    ],
    "Blue": [
        "Blue",
        "Light Blue",
        "Royal Blue",
        "Royal Deep Blue",
        "Bluebell Bronze",
        "Blue River",
        "Cloudy Sky",
        "Iceline Indigo",
        "Sea Blue",
        "Light Powder Blue",
        "Celestial Mist",
        "Ocean",
        "Arctic Oasis",
        "Obsidian Tide",
        "Regal Horizon",
        "Indigo Stripes",
        "Navy Blue",
        "Misty Blue"
    ],
    "Brown": [
        "Brown",
        "Leopard",
        "Cocoa Luxe",
        "Chocolate Brown",
        "Mocha",
        "Golden Mocha",
        "Coffee Mocha",
        "Cocoa Drape",
        "Hazlenut",
        "Latte",
        "Velvét Espresso",
        "Taupe",
        "Light Brown",
        "Khaki",
        "Dark Brown",
        "Chestnut Brown",
        "Coffee Americano"
    ],
    "Gold": ["Gold", "Golden Drift", "Golden Ivory"],
    "Green": [
        "Green",
        "Forrest Greens",
        "Olive Green",
        "Thorneleaf",
        "Dark Green",
        "Celestial Mist",
        "Ocean",
        "Golden Tide",
        "Obsidian Tide",
        "Shadow Pine",
        "Sage Tide",
        "Emerald Green",
        "Moss Green"
    ],
    "Grey": ["Grey", "Slate Grey", "Charcoal", "Eucalyptus Mist", "Crimson Ash", "Silver"],
    "Orange": [
        "Orange",
        "Sunrise",
        "Rosy Ember",
        "Molten Ember",
        "Solar Veil",
        "Amber Solstice",
        "Citrus Créme"
    ],
    "Pink": [
        "Pink",
        "Sugar Rose",
        "Blushing Snow",
        "Berry Luxe",
        "Cherry Blossom Mint",
        "Sugar Pearl",
        "Mauve",
        "Bubblegum",
        "Orchid Pink"
    ],
    "Purple": ["Purple", "Lavender", "Lavender Sky", "Violet Cream", "Deep Purple", "Amethyst"],
    "Red": [
        "Red",
        "Maroon",
        "Crimson Pearl",
        "Burgundy",
        "Oxblood Luxe",
        "Crimson Dusk",
        "Crimson Thread"
    ],
    "Turquoise": ["Turquoise"],
    "White": [
        "White",
        "Snow Obsidian",
        "Lemon Lace",
        "Sugar Rose",
        "Lavender Sky",
        "Blushing Snow",
        "White Ember",
        "Black & White",
        "Arctic Oasis",
        "Regal Horizon",
        "Sage Tide",
        "Monochrome Grid",
        "Golden Ivory",
        "Misty Blue"
    ],
    "Yellow": [
        "Yellow",
        "Leopard",
        "Bluebell Bronze",
        "Golden Mocha",
        "Lemon Lace",
        "Sunshine",
        "Crazy Yellow",
        "Crimson Dusk",
        "Golden Tide",
        "Amber Solstice",
        "Noir Eclairs",
        "Regal Horizon"
    ],
    "Multi-Colored": [
        "Cherry Blossom Mint",
        "Sugar Pearl",
        "Iceline Indigo",
        "Bronze Obsidian",
        "Molten Ember",
        "Sugar Bloom",
        "Bluebell Bronze",
        "Multi-Colored",
        "Crimson Ash"
    ]
}

# Flatten variant to base color dict (all lowercase keys)
variant_to_base_color = {
    variant.lower(): base_color.lower()
    for base_color, variants in color_mappings.items()
    for variant in variants
}

# Gender normalization map
gender_map = {
    "men": "men", "male": "men", "guys": "men", "man": "men",
    "women": "women", "female": "women", "lady": "women", "girls": "women", "woman": "women",
    "unisex": "unisex"
}

# Size groups
size_groups = {
    "small": ["xxs", "xs", "s"],
    "medium": ["m"],
    "large": ["l", "xl", "xxl"],
    "onesize": ["onesize"]
}

product_items = {
    "t-shirts-and-shirts": ["t-shirt", "shirt"],
    "dresses": ["dress", "gown"],
    "sweaters-and-cardigans": ["sweater", "cardigan"],
    "jackets-and-blazers": ["jacket", "blazer"],
    "trousers": ["trousers", "pants"],
    "caps-and-scarves": ["cap", "scarf", "hat"],
    "ear-rings-and-bracelets": ["earrings", "bracelet", "ear ring", "ear - ring"],
    "bags": ["bag", "backpack", "handbag", "hand bag", "hand - bag"],
    "heels-and-sandals": ["heels", "sandals"],
    "shoes": ["shoes", "sneakers"],
    "sweatshirts-and-hoodies": ["sweatshirt", "hoodie"],
    "jackets": ["jacket", "blazer"]
}

intent_words = {"i", "want", "to", "buy", "get", "need", "would", "like", "looking", "for", "a"}
color_suffixes = {"colored", "tone", "shade", "color", "coloured", "colour"}

def clean_color_tokens(color_tokens):
    cleaned = []
    for token in color_tokens:
        words = token.lower().split()
        # Remove leading intent words
        while words and words[0] in intent_words:
            words.pop(0)
        # Remove trailing suffixes
        while words and words[-1] in color_suffixes:
            words.pop()
        if words:
            cleaned.append(" ".join(words))
    return cleaned

def resolve_color(color_tokens):
    phrase = " ".join(color_tokens).lower()
    if phrase in variant_to_base_color:
        return variant_to_base_color[phrase]
    # fallback: try single tokens individually
    for token in color_tokens:
        token_lower = token.lower()
        if token_lower in variant_to_base_color:
            return variant_to_base_color[token_lower]
    return None

def resolve_subcategory(subcats, gender):
    if not subcats:
        return None
    subcat = subcats[0].lower()
    matched_keys = []
    for key, values in product_items.items():
        for v in values:
            if v in subcat:
                matched_keys.append(key)
                break
    # Gender specific filtering example for jackets
    if subcat == "jackets":
        if gender == "men":
            matched_keys = [k for k in matched_keys if "jacket" in k and "blazer" not in k]
        elif gender == "women":
            matched_keys = [k for k in matched_keys if "blazer" in k]
    if not matched_keys:
        return None
    if len(matched_keys) == 1:
        return matched_keys[0]
    return matched_keys

def map_gender(gender_tokens):
    if not gender_tokens:
        return None
    g = gender_tokens[0].lower()
    return gender_map.get(g)

def map_sizes(size_tokens):
    if not size_tokens:
        return []
    sizes = []
    for token in size_tokens:
        token_lower = token.lower()
        if token_lower in size_groups:
            sizes.extend(size_groups[token_lower])
        elif token_lower in [sz for group in size_groups.values() for sz in group]:
            sizes.append(token_lower)
    return list(set(sizes))

def build_opensearch_query(ner_output, original_query):
    extracted = defaultdict(list)
    for item in ner_output:
        key = item["entity"].split("-")[-1].lower()
        extracted[key].append(item["word"])

    must_clauses = []

    gender = map_gender(extracted.get("gender"))
    if gender:
        must_clauses.append({
            "bool": {
                "should": [
                    {"term": {"gender": gender}},
                    {"term": {"category": gender}}
                ]
            }
        })

    subcategory = resolve_subcategory(extracted.get("subcategory"), gender)
    if subcategory:
        clause = [{"match": {"subcategory": val}} for val in (subcategory if isinstance(subcategory, list) else [subcategory])]
        must_clauses.append({"bool": {"should": clause}})

    sizes = map_sizes(extracted.get("size", []))
    if sizes:
        must_clauses.append({
            "bool": {
                "should": [{"match": {"sizeOptions": sz}} for sz in sizes]
            }
        })

    composition = extracted.get("composition")
    if composition:
        must_clauses.append({"match": {"compositionAndCare": composition[0].lower()}})

    color_tokens = clean_color_tokens(extracted.get("color", []))
    base_color = resolve_color(color_tokens)
    if base_color:
        variants = color_mappings.get(base_color.capitalize(), [])
        must_clauses.append({
            "bool": {
                "should": [{"match_phrase": {"colorTitle": v}} for v in variants] + [{"term": {"baseColor": base_color.capitalize()}}],
                "minimum_should_match": 1
            }
        })

    return {
        "index": "velvet-products",
        "body": {
            "size": 20,
            "query": {
                "bool": {
                    "should": [
                        {
                            "bool": {
                                "must": must_clauses
                            }
                        },
                        {
                            "multi_match": {
                                "query": original_query,
                                "fields": ["name", "description", "compositionAndCare"],
                                "type": "best_fields",
                                "fuzziness": "AUTO"
                            }
                        }
                    ],
                    "minimum_should_match": 1
                }
            },
            "_source": [
                "productCode",
                "category",
                "gender",
                "image",
                "meta",
                "name",
                "originalPrice",
                "price",
                "subCategory"
            ]
        }
    }



if __name__ == "__main__":

    # Input example — match this with the model’s expected input format
    payload = {
        "inputs": "small black cotton shirt for men"
    }

    # # Create client
    runtime = boto3.client("sagemaker-runtime", region_name=region)

    # Invoke endpoint
    response = runtime.invoke_endpoint(
        EndpointName=ENDPOINT_NAME,
        ContentType="application/json",
        Body=json.dumps(payload)
    )

    # Print response
    result = response["Body"].read().decode("utf-8")
    result = json.loads(result)
    print("Prediction:", result, type(result))
    query_json = build_opensearch_query(result, payload["inputs"])
    print("\n📦 OpenSearch Query:\n", json.dumps(query_json, indent=2))