import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-south-1';
const TABLE_NAME = 'velvet-ecommerce-guest-shopping-history';

const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    const { email, updateType } = body;

    if (!email || typeof updateType !== 'object') {
      return response(400, { error: 'Invalid input format.' });
    }

    const [key] = Object.keys(updateType);
    const value = updateType[key];

    if (!['wishlistItems', 'recentlyViewed', 'orderHistory', 'cartItems'].includes(key)) {
      return response(400, {
        error: 'Invalid updateType. Must be one of wishlistItems, recentlyViewed, orderHistory, cartItems.'
      });
    }

    const currentData = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { email }
      })
    );

    const existing = currentData.Item || { email };
    let updatedField;

    switch (key) {
      case 'wishlistItems': {
        const { productCode, action } = value;
        const currentWishList = existing.wishlistItems || [];
        console.log('Current Wishlist:', currentWishList);
        updatedField =
          action === 'add'
            ? [...new Set([...currentWishList, productCode])]
            : currentWishList.filter(item => item !== productCode);
        console.log("Updated Field: ", updatedField)
        break;
      }

      case 'recentlyViewed': {
        const productCode = value;
        const currentRecentlyViewed = existing.recentlyViewed || [];

        const filtered = currentRecentlyViewed.filter(item => item !== productCode);
        updatedField = [productCode, ...filtered].slice(0, 10);
        break;
      }

      case 'orderHistory': {
        const currentOrders = existing.orderHistory || [];
        updatedField = [value, ...currentOrders];
        break;
      }

      case 'cartItems': {
        const item = value;
        const { productCode, color, size, qty } = item;
        let currentCart = existing.cartItems || [];

        // Remove any existing item with same productCode, color, and size
        currentCart = currentCart.filter(
          c =>
            !(
              c.productCode === productCode &&
              c.size === size &&
              c.color === color
            )
        );

        // Only re-add if qty > 0
        if (qty > 0) {
          currentCart.push(item);
        }

        // ✅ Extra safety: filter out any lingering qty 0 items
        updatedField = currentCart.filter(c => parseInt(c.qty) > 0);
        break;
      }

      default:
        return response(400, { error: 'Unsupported updateType' });
    }

    const mappedKey = key === 'wishlistItems' ? 'wishlistItems' : key;
    updatedField.forEach((item, index) => {
      console.log(`Updated Item ${index + 1}:`, item);
    });
    const updateExpression = `SET ${mappedKey} = :updatedField`;
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { email },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: {
        ':updatedField': updatedField
      },
      ReturnValues: 'UPDATED_NEW'
    });

    const result = await docClient.send(command);

    return response(200, { [mappedKey]: result.Attributes[mappedKey] });

  } catch (err) {
    console.error('Error:', err);
    return response(500, { error: 'Internal server error' });
  }
};

const response = (statusCode, body) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
});