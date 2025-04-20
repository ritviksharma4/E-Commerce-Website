import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-south-1';
const PRODUCT_TABLE = 'velvet-e-commerce-website-product-data';
const HISTORY_TABLE = 'velvet-ecommerce-guest-shopping-history';

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Extract wishlist productCodes from raw DynamoDB response
function extractWishlistProductCodes(wishlistItems) {
  if (!Array.isArray(wishlistItems)) return [];
  return wishlistItems;
}

// Common CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  console.log("Event of current Request: ", event);

  // Handle preflight OPTIONS request
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'CORS preflight success' }),
    };
  }

  try {
    let body;
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      body = event;
    }

    const { email, category, subCategory, productCode } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Email is a mandatory field.' }),
      };
    }

    // Get user wishlist
    let wishlistProductCodes = [];
    try {
      const userData = await client.send(
        new GetCommand({
          TableName: HISTORY_TABLE,
          Key: { email },
          ProjectionExpression: 'wishlistItems',
        })
      );
      wishlistProductCodes = extractWishlistProductCodes(userData.Item?.wishlistItems);
    } catch (err) {
      console.error('Failed to get wishlist', err);
    }

    // Scan product table
    const scanParams = {
      TableName: PRODUCT_TABLE,
    };

    const scanResult = await docClient.send(new ScanCommand(scanParams));
    let allProducts = scanResult.Items || [];

    // Filter by category, subCategory, and productCode (if present)
    let products = allProducts.filter((item) => {
      const matchCategory = category ? item.category === category : true;
      const matchSubCategory = subCategory ? item.subCategory === subCategory : true;
      const matchProductCode = productCode ? item.productCode === productCode : true;
      return matchCategory && matchSubCategory && matchProductCode;
    });

    // Add isInWishlist flag
    const result = products.map((item) => ({
      ...item,
      isInWishlist: wishlistProductCodes.includes(item.productCode),
    }));

    console.log("Result: ", result)

    if (!productCode) {
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ products: result }),
        };
    }
    else {
        const product = result.length > 0 ? result[0] : null;
        if (!product) {
            return {
            statusCode: 404,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Product not found' }),
            };
        }
        // Prepare suggestions
        const sameSubCategory = allProducts.filter(p =>
            p.productCode !== productCode &&
            p.category === category &&
            p.subCategory === subCategory
        );
    
        const sameCategory = allProducts.filter(p =>
            p.productCode !== productCode &&
            p.category === category &&
            p.subCategory !== subCategory &&
            !sameSubCategory.find(s => s.productCode === p.productCode)
        );
    
        // Shuffle helper
        const shuffle = (arr) => {
            return arr
              .map((item) => ({ item, sortKey: Math.random() }))
              .sort((a, b) => a.sortKey - b.sortKey)
              .map(({ item }) => item);
        };          
    
        const shuffledSub = shuffle(sameSubCategory);
        const shuffledCat = shuffle(sameCategory);
    
        const suggestions = [...shuffledSub, ...shuffledCat].slice(0, 4);
    
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                product,
                suggestions: suggestions.map(item => ({
                    ...item,
                    isInWishlist: wishlistProductCodes.includes(item.productCode),
                }))
            }),
        };
    }
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};