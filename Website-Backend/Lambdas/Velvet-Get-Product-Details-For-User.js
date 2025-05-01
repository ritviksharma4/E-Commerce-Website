import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const REGION = 'ap-south-1';
const PRODUCT_TABLE = 'velvet-e-commerce-website-product-data';
const HISTORY_TABLE = 'velvet-ecommerce-guest-shopping-history';
const S3_BUCKET = "velvet-e-commerce-website-images"

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client({ region: REGION });

function extractWishlistProductCodes(wishlistItems) {
  if (!Array.isArray(wishlistItems)) return [];
  return wishlistItems
    .filter(item => item && typeof item.productCode === 'string')
    .map(item => item.productCode);
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const streamToJSON = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return JSON.parse(buffer.toString('utf-8'));
};

export const handler = async (event) => {
  console.log("Event of current Request: ", event);

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'CORS preflight success' }),
    };
  }

  try {
    let body;
    let result;
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      body = event;
    }

    const { requestType, email, category, subCategory, productCode, filters } = body;

    if (requestType === 'sizeChart') {
      if (!category || !subCategory) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: 'Category and subCategory are required for size chart.' }),
        };
      }

      const key = `SizeChart/${category}/${subCategory}/chart.json`;

      try {
        const command = new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
        });
        console.log("Command: ", command);
        const data = await s3Client.send(command);
        const chartData = await streamToJSON(data.Body);

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify(chartData),
        };
      } catch (err) {
        console.error('Failed to fetch size chart:', err);
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: 'Size chart not found for given category and subCategory.' }),
        };
      }
    }

    if (!email) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Email is a mandatory field.' }),
      };
    }

    let wishlistProductCodes = [];
    try {
      const userData = await docClient.send(
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

    const scanParams = {
      TableName: PRODUCT_TABLE,
    };

    const scanResult = await docClient.send(new ScanCommand(scanParams));
    let allProducts = scanResult.Items || [];

    if (!filters) {
      let products = allProducts.filter((item) => {
        const matchCategory = category ? item.category === category : true;
        const matchSubCategory = subCategory ? item.subCategory === subCategory : true;
        const matchProductCode = productCode ? item.productCode === productCode : true;
        return matchCategory && matchSubCategory && matchProductCode;
      });
  
      result = products.map((item) => ({
        ...item,
        isInWishlist: wishlistProductCodes.includes(item.productCode),
      }));
    }

    else {
      let colorMappings = {};
      if (filters.colorOptions && filters.colorOptions.length > 0) {
        try {
          const colorMappingCommand = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: 'color_mappings.json',
          });
          const colorMappingData = await s3Client.send(colorMappingCommand);
          colorMappings = await streamToJSON(colorMappingData.Body);
        } catch (err) {
          console.error('Failed to fetch color mappings:', err);
        }
      }

      let products = allProducts.filter((item) => {
        const matchCategory = category ? item.category === category : true;
        const matchSubCategory = subCategory ? item.subCategory === subCategory : true;
        const matchProductCode = productCode ? item.productCode === productCode : true;

        let matchesFilters = true;

          if (filters.sizeOptions && filters.sizeOptions.length > 0) {
            const productSizes = (item.sizeOptions || []).map(size => size.S || size);
            const sizeMatch = productSizes.some(size => filters.sizeOptions.includes(size));
            if (!sizeMatch) matchesFilters = false;
          }

          if (filters.colorOptions && filters.colorOptions.length > 0) {
          const productColorOptions = (item.colorOptions || []).map(c => ({
            title: c.M?.title?.S || c.title,
            productCode: c.M?.productCode?.S || c.productCode
          }));

          const selfColor = productColorOptions.find(c => c.productCode === (item.productCode?.S || item.productCode));

          if (selfColor) {
            const productColorTitle = selfColor.title;
            const allowedTitles = [];
            for (const filterColor of filters.colorOptions) {
              const mappedTitles = colorMappings[filterColor] || [];
              allowedTitles.push(...mappedTitles);
            }

            if (!allowedTitles.includes(productColorTitle)) {
              matchesFilters = false;
            }
          } else {
            matchesFilters = false;
          }
        }
        return matchCategory && matchSubCategory && matchProductCode && matchesFilters;
      });

      const uniqueProducts = [];
      const seenProductCodes = new Set();

      for (const prod of products) {
        const code = prod.productCode?.S || prod.productCode;
        if (!seenProductCodes.has(code)) {
          seenProductCodes.add(code);
          uniqueProducts.push(prod);
        }
      }
      result = uniqueProducts.map((item) => ({
        ...item,
        isInWishlist: wishlistProductCodes.includes(item.productCode),
      }));
    }
    
    console.log("Result: ", result);

    if (!productCode) {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ products: result }),
      };
    } else {
      const product = result.length > 0 ? result[0] : null;
      if (!product) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: 'Product not found' }),
        };
      }

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