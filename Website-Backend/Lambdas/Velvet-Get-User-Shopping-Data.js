import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb';

const LOGIN_TABLE = 'velvet-ecommerce-guest-logins';
const HISTORY_TABLE = 'velvet-ecommerce-guest-shopping-history';
const GUEST_TIMEOUT_SECONDS = 300;

const client = new DynamoDBClient({ region: 'ap-south-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const scanParams = {
      TableName: LOGIN_TABLE,
    };

    const { Items } = await dynamodb.send(new ScanCommand(scanParams));

    let availableGuest = null;
    let shortestWaitTime = Number.MAX_SAFE_INTEGER;

    for (const item of Items) {
      const { email, password, lastLoginTime = 0, firstName, lastName, addresses = [] } = item;
      const timeSinceLastUse = currentTimestamp - lastLoginTime;

      if (timeSinceLastUse >= GUEST_TIMEOUT_SECONDS) {
        availableGuest = item;
        break;
      } else {
        const timeToWait = GUEST_TIMEOUT_SECONDS - timeSinceLastUse;
        if (timeToWait < shortestWaitTime) {
          shortestWaitTime = timeToWait;
        }
      }
    }

    if (availableGuest) {
      const updateParams = {
        TableName: LOGIN_TABLE,
        Key: { email: availableGuest.email },
        UpdateExpression: 'SET lastLoginTime = :time',
        ExpressionAttributeValues: {
          ':time': currentTimestamp,
        },
      };

      await dynamodb.send(new UpdateCommand(updateParams));

      const getParams = {
        TableName: HISTORY_TABLE,
        Key: { email: availableGuest.email },
      };

      const { Item } = await dynamodb.send(new GetCommand(getParams));
      const totalCartItems = Item?.cartItems?.length || 0;

      return {
        statusCode: 200,
        body: JSON.stringify({
          email: availableGuest.email,
          password: availableGuest.password,
          addresses: availableGuest.addresses,
          firstName: availableGuest.firstName,
          lastName: availableGuest.lastName,
          totalCartItems: totalCartItems,
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          waitTime: shortestWaitTime,
        }),
      };
    }
  } catch (err) {
    console.error('Guest login error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};