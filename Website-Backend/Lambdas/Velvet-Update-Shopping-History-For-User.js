import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    UpdateCommand,
    GetCommand,
    QueryCommand
} from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-south-1';
const USER_HISTORY_TABLE_NAME = 'velvet-ecommerce-guest-shopping-history';
const PRODUCT_TABLE_NAME = "velvet-e-commerce-website-product-data"

const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
    try {

        if (event.requestContext?.http?.method === 'OPTIONS') {
            return {
              statusCode: 200,
              headers: CORS_HEADERS,
              body: JSON.stringify({ message: 'CORS preflight success' }),
            };
        }

        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;
        console.log("Body: ", body);
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
                TableName: USER_HISTORY_TABLE_NAME,
                Key: { email }
            })
        );

        const existing = currentData.Item || { email };
        let updatedField;

        switch (key) {
            case 'wishlistItems': {
                const { productCode, action } = value;
                const currentWishList = existing.wishlistItems || [];
            
                if (action === 'remove') {
                    updatedField = currentWishList.filter(item => item.productCode !== productCode);
                }
            
                if (action === 'add') {
                    const alreadyExists = currentWishList.some(item => item.productCode === productCode);
                    
                    if (alreadyExists) {
                        updatedField = currentWishList;
                    } else {
                        let currentProductData = await getAdditionalDetails(productCode, key);
                        console.log("Current Product Data For Wish List: ", currentProductData); 
                        let currentProductColors = currentProductData[0].colorOptions;
                        let currentColor;
                        for (let i = 0; i < currentProductColors.length; i++) {
                            if (currentProductColors[i].productCode === productCode) {
                                currentColor = currentProductColors[i].title;
                                break;
                            }
                        }
                        updatedField = [
                            {
                                color: currentColor,
                                image: currentProductData[0].image,
                                productCode,
                                sizeOptions: currentProductData[0].sizeOptions,
                                colorOptions: currentProductData[0].colorOptions,
                                name: currentProductData[0].name,
                                price: currentProductData[0].price
                            },
                            ...currentWishList
                        ];
                    }
                }
            
                console.log("Updated Field in Wishlist: ", updatedField);
                break;
            }

            case 'recentlyViewed': {
                const productCode = value;
                const currentRecentlyViewed = existing.recentlyViewed || [];

                const filtered = currentRecentlyViewed.filter(item => item.productCode !== productCode);
                let currentProductData = await getAdditionalDetails(productCode, key);
                console.log("Current Product Data For Recently Viewed: ", currentProductData);
                updatedField = [{"productCode": productCode, "name": currentProductData[0].name, "price": currentProductData[0].price, "image": currentProductData[0].image, "colorOptions": currentProductData[0].colorOptions, "sizeOptions": currentProductData[0].sizeOptions}, ...filtered].slice(0, 9);
                break;
            }

            case 'orderHistory': {
                const currentOrders = existing.orderHistory || [];
                updatedField = [value, ...currentOrders];
                break;
            }

            case 'cartItems': {
                const item = value;
                const { productCode, color, size, qty, action } = item;
                let currentCart = existing.cartItems || [];
              
                const existingIndex = currentCart.findIndex(
                  c => c.productCode === productCode && c.size === size && c.color === color
                );
              
                let finalQty = qty;
              
                if (action === "add" && existingIndex !== -1) {
                  finalQty = parseInt(finalQty) + parseInt(currentCart[existingIndex].qty || 0);
                }
              
                currentCart = currentCart.filter(
                  c => !(c.productCode === productCode && c.size === size && c.color === color)
                );
              
                if (finalQty > 0) {
                  const currentProductData = await getAdditionalDetails(productCode, key);
                  const newItem = {
                    productCode,
                    color,
                    size,
                    qty: parseInt(finalQty),
                    name: currentProductData[0].name,
                    price: currentProductData[0].price,
                    image: currentProductData[0].image,
                  };
              
                  if (action === 'add' && existingIndex === -1) {
                    currentCart.unshift(newItem);
                  } else if (existingIndex !== -1) {
                    currentCart.splice(existingIndex, 0, newItem);
                  } else {
                    currentCart.push(newItem);
                  }
                }
              
                updatedField = currentCart.filter(c => parseInt(c.qty) > 0);
                break;
              }                           

            default:
                return response(400, { error: 'Unsupported updateType' });
        }

        const mappedKey = key === 'wishlistItems' ? 'wishlistItems' : key;

        const updateExpression = `SET ${mappedKey} = :updatedField`;
        const command = new UpdateCommand({
            TableName: USER_HISTORY_TABLE_NAME,
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

async function getAdditionalDetails(productCode) {
    try {
        const productData = await docClient.send(
            new QueryCommand({
                TableName: PRODUCT_TABLE_NAME,
                KeyConditionExpression: 'productCode = :pc',
                ExpressionAttributeValues: {
                    ':pc': productCode
                },
                ProjectionExpression: '#n, price, image, sizeOptions, colorOptions',
                ExpressionAttributeNames: {
                    '#n': 'name'
                }
            })
        );

        return productData.Items;
    } catch (error) {
        console.error('Error querying product details:', error);
        return null;
    }
}

const response = (statusCode, body) => ({
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
});