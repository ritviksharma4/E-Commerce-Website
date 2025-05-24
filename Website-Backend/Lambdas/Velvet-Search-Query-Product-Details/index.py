import boto3
import json
from collections import defaultdict
from requests_aws4auth import AWS4Auth
from opensearchpy import OpenSearch, RequestsHttpConnection
from boto3.dynamodb.types import TypeDeserializer
from decimal import Decimal

region = "ap-south-1"
ENDPOINT_NAME = "velvet-bert-ner-endpoint"
opensearch_host = "https://zg2qc3x6wlvc49dsogib.ap-south-1.aoss.amazonaws.com"
service = "aoss"
dynamodb = boto3.client("dynamodb", region_name="ap-south-1")
TABLE_NAME = "velvet-e-commerce-website-product-data"
runtime = boto3.client("sagemaker-runtime", region_name=region)
deserializer = TypeDeserializer()

# Credentials for OpenSearch
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(
    credentials.access_key,
    credentials.secret_key,
    region,
    service,
    session_token=credentials.token
)

os_client = OpenSearch(
    hosts=[{"host": opensearch_host.replace("https://", ""), "port": 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection
)

# CORS Headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

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
    "t-shirts-and-shirts": [
        "tshirt", "t-shirt", "tee", "shirt", "top", "tops", "tees"
    ],
    "dresses": [
        "dress", "gown", "frock", "maxi dress", "evening dress", "cocktail dress"
    ],
    "sweaters-and-cardigans": [
        "sweater", "cardigan", "pullovers", "pullover", "jumper", "knitwear"
    ],
    "jackets-and-blazers": [
        "jacket", "blazer", "coat", "overcoat", "bomber", "windcheater"
    ],
    "trousers": [
        "trousers", "pants", "slacks", "chinos", "bottoms"
    ],
    "caps-and-scarves": [
        "cap", "hat", "beanie", "scarf", "scarves", "headwear", "beret"
    ],
    "ear-rings-and-bracelets": [
        "earring", "earrings", "bracelet", "bracelets", "ear ring", "ear rings", "bangles", "anklet"
    ],
    "bags": [
        "bag", "bags", "handbag", "hand bag", "handbag", "purse", "backpack", "sack", "sling", "duffel", "hand - bag", "clutch"
    ],
    "heels-and-sandals": [
        "heel", "heels", "stilettos", "sandals", "slippers", "wedges", "mules", "strappy heels"
    ],
    "shoes": [
        "shoe", "shoes", "sneaker", "sneakers", "trainers", "boots", "loafers", "formal shoes"
    ],
    "sweatshirts-and-hoodies": [
        "sweatshirt", "sweatshirts", "hoodie", "hoodies", "zipper", "zip-up", "track top"
    ],
    "jackets": [
        "jacket", "jackets", "bomber", "blazer", "trench coat", "overcoat"
    ]
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

def normalize_ner_output(ner_output):
    merged = []
    current_entity = None
    current_tokens = []

    for token in ner_output:
        entity_type = token["entity"].split("-")[-1]
        word = token["word"]

        # New entity or first iteration
        if current_entity != entity_type:
            if current_entity and current_tokens:
                merged.append({
                    "entity": current_entity,
                    "word": detokenize(current_tokens)
                })
            current_entity = entity_type
            current_tokens = [word]
        else:
            current_tokens.append(word)

    # Add last buffered entity
    if current_entity and current_tokens:
        merged.append({
            "entity": current_entity,
            "word": detokenize(current_tokens)
        })

    return merged


def detokenize(tokens):
    """Join wordpiece tokens into a full word/phrase."""
    phrase = ""
    for t in tokens:
        if t.startswith("##"):
            phrase += t[2:]
        elif phrase:
            phrase += " " + t
        else:
            phrase = t
    return phrase

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
        clause = [{"match": {"subCategory": val}} for val in (subcategory if isinstance(subcategory, list) else [subcategory])]
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
                        }
                    ]
                }
            },
            "_source": [
                "productCode"
            ]
        }
    }

def get_category_from_code(code):
    if code.startswith("M-"):
        return "men"
    elif code.startswith("W-"):
        return "women"
    elif code.startswith("AC-"):
        return "accessories"
    elif code.startswith("FW-"):
        return "footwear"
    else:
        return None

# Helper to convert Decimal to int or float
def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def fetch_product_details(product_codes):
    results = []
    for item in product_codes:
        code = item.get("productCode")
        category = get_category_from_code(code)
        if not category:
            continue
        try:
            response = dynamodb.get_item(
                TableName=TABLE_NAME,
                Key={
                    "productCode": {"S": code},
                    "category": {"S": category}
                },
                ProjectionExpression="#n, productCode, category, gender, image, meta, originalPrice, price, subCategory, sizeOptions, colorOptions",
                ExpressionAttributeNames={
                    "#n": "name"
                }
            )
            if "Item" in response:
                parsed = {
                    k if k != "#n" else "name": deserializer.deserialize(v)
                    for k, v in response["Item"].items()
                }
                clean = convert_decimals(parsed)
                results.append(clean)
        except Exception as e:
            print(f"Error fetching {code}: {e}")
    return results

# Lambda entry point
def lambda_handler(event, context):
    print(f"Event: {event}")
    
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "CORS preflight response"})
        }

    try:
        body = json.loads(event.get("body", "{}"))
        query = body.get("query")
        if not query:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Missing 'query' field in body"})
            }

        # Special case: get index mapping
        if query.strip().lower() == "get_indexing":
            mapping = os_client.indices.get_mapping(index="velvet-products")
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps(mapping)
            }

        # Invoke SageMaker NER
        payload = {"inputs": query}
        ner_response = runtime.invoke_endpoint(
            EndpointName=ENDPOINT_NAME,
            ContentType="application/json",
            Body=json.dumps(payload)
        )
        ner_result = json.loads(ner_response["Body"].read().decode("utf-8"))
        normalized_ner = normalize_ner_output(ner_result)
        print(f"Normalized NER: {normalized_ner}")

        query_body = build_opensearch_query(normalized_ner, query)
        print(f"Query body: {query_body}")

        # Search in OpenSearch
        os_response = os_client.search(
            index=query_body["index"],
            body=query_body["body"],
            _source=["productCode"]
        )

        hits = os_response.get("hits", {}).get("hits", [])
        product_codes = [{"productCode": hit["_source"]["productCode"]} for hit in hits]

        # Fetch full product data from DynamoDB
        final_products = fetch_product_details(product_codes)
        print(f"Final products: {final_products}")
        
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(final_products)
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }