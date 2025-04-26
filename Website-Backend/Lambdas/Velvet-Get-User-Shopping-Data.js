import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-south-1';
const USER_HISTORY_TABLE_NAME = 'velvet-ecommerce-guest-shopping-history';

const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ALLOWED_TYPES = ['wishlistItems', 'recentlyViewed', 'orderHistory', 'cartItems'];

export const handler = async (event) => {
  const response = (statusCode, body) => ({
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  });

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'CORS preflight success' }),
    };
  }

  try {
    let body;
    console.log(event);
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      body = event;
    }

    const { email, requestType } = body;
    console.log(email, requestType);
    if (!email || !requestType) {
      return response(400, { error: 'Missing email or requestType in request' });
    }

    if (!ALLOWED_TYPES.includes(requestType)) {
      return response(400, {
        error: 'Invalid requestType. Must be one of wishlistItems, recentlyViewed, orderHistory, cartItems.'
      });
    }

    const queryParams = requestType === "recentlyViewed" ? {
      TableName: USER_HISTORY_TABLE_NAME,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
      ProjectionExpression: '#email, #attr, #wishlst',
      ExpressionAttributeNames: {
        '#email': 'email',
        '#attr': requestType,
        '#wishlst': "wishlistItems"
      },
    } : {
      TableName: USER_HISTORY_TABLE_NAME,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
      ProjectionExpression: '#email, #attr',
      ExpressionAttributeNames: {
        '#email': 'email',
        '#attr': requestType
      },
    };

    const data = await docClient.send(new QueryCommand(queryParams));

    if (!data.Items || data.Items.length === 0) {
      return response(404, { error: 'User not found' });
    }

    const userData = data.Items[0];
    if (requestType === 'recentlyViewed') {
      const wishlistItems = userData.wishlistItems || [];
      const wisthlistProductCodes = wishlistItems.map(item => item.productCode);
      userData[requestType].map(item => {
        item.isInWishlist = wisthlistProductCodes.includes(item.productCode);
      });
      console.log("Updated UserData: ", userData[requestType]);
    }

    if (!(requestType in userData)) {
      return response(404, { error: `Attribute '${requestType}' not found for user` });
    }

    return response(200, { [requestType]: userData[requestType] });

  } catch (error) {
    console.error('Error retrieving user history:', error);
    return response(500, { error: 'Internal server error' });
  }
};