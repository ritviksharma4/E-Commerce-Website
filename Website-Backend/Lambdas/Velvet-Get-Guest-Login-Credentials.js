import { DynamoDBClient } from '@aws-sdk/client-dynamodb'; // Import DynamoDB client from v3
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'; // Import document client and command classes

const TABLE_NAME = 'velvet-ecommerce-guest-logins';
const GUEST_TIMEOUT_SECONDS = 300; // 5 minutes

// Create DynamoDB Client and Document Client
const client = new DynamoDBClient();
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const scanParams = {
      TableName: TABLE_NAME
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
      // Update lastLoginTime to now
      const updateParams = {
        TableName: TABLE_NAME,
        Key: { email: availableGuest.email },
        UpdateExpression: 'SET lastLoginTime = :time',
        ExpressionAttributeValues: {
          ':time': currentTimestamp,
        },
      };

      await dynamodb.send(new UpdateCommand(updateParams));

      return {
        statusCode: 200,
        body: JSON.stringify({
          email: availableGuest.email,
          password: availableGuest.password,
          addresses: availableGuest.addresses,
          firstName: availableGuest.firstName,
          lastName: availableGuest.lastName
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