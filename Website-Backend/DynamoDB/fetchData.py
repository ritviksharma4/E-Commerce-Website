import boto3
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal

def get_all_items(table_name, region):
    dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table(table_name)

    all_items = []
    scan_kwargs = {}

    while True:
        response = table.scan(**scan_kwargs)
        all_items.extend(response.get('Items', []))

        # Check for pagination
        if 'LastEvaluatedKey' in response:
            scan_kwargs['ExclusiveStartKey'] = response['LastEvaluatedKey']
        else:
            break

    return all_items

def extract_unique_composition_and_care(items):
    unique_values = set()

    for item in items:
        value = item.get('compositionAndCare')
        if value:
            # If it's a list or dict, convert to string for comparison
            if isinstance(value, (list, dict)):
                value = str(value)
            unique_values.add(value)

    return unique_values

if __name__ == '__main__':
    TABLE_NAME = 'velvet-e-commerce-website-product-data'
    REGION = 'ap-south-1' 
    print("Fetching items from DynamoDB...")
    items = get_all_items(TABLE_NAME, REGION)

    print(f"Total items fetched: {len(items)}")

    unique_composition_and_care = extract_unique_composition_and_care(items)

    print("\nUnique compositionAndCare values:")
    print(sorted(unique_composition_and_care))