import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { Readable } from 'stream';

const REGION = 'ap-south-1';
const S3_BUCKET = 'velvet-e-commerce-website-images';
const COLOR_MAPPING_KEY = 'color_mappings.json';
const INDEX_NAME = 'velvet-products';
const OPENSEARCH_ENDPOINT = 'https://search-velvet-ecommerce-products-XXXXXXXXXXXX.ap-south-1.es.amazonaws.com'; // Replace with your endpoint

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const s3Client = new S3Client({ region: REGION });

async function getColorMappings() {
  const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: COLOR_MAPPING_KEY });
  const response = await s3Client.send(command);
  const stream = response.Body;
  const bodyContents = await streamToString(stream);
  return JSON.parse(bodyContents);
}

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

function resolveBasicColors(colorTitles, colorMappings) {
  const resolved = new Set();
  for (const title of colorTitles) {
    for (const [basic, variants] of Object.entries(colorMappings)) {
      if (variants.includes(title)) {
        resolved.add(basic);
        break;
      }
    }
  }
  return Array.from(resolved);
}

export const handler = async (event) => {
  try {
    const body = event.httpMethod === 'POST' ? JSON.parse(event.body) : {};
    const { query = '', category, subCategory, gender, colors = [], tags = [] } = body;

    const colorMappings = await getColorMappings();
    const resolvedColors = resolveBasicColors(colors, colorMappings);

    const credentials = fromNodeProviderChain();
    const client = new OpenSearchClient({
      ...AwsSigv4Signer({
        region: REGION,
        service: 'es',
        getCredentials: credentials,
      }),
      node: OPENSEARCH_ENDPOINT,
    });

    const searchParams = {
      index: INDEX_NAME,
      size: 50,
      query: {
        bool: {
          must: query ? [
            {
              multi_match: {
                query,
                fields: ['name^3', 'description', 'tags', 'category', 'subCategory'],
                fuzziness: 'AUTO'
              }
            }
          ] : [],
          filter: [
            ...(category ? [{ term: { category } }] : []),
            ...(subCategory ? [{ term: { subCategory } }] : []),
            ...(gender ? [{ term: { gender } }] : []),
            ...(resolvedColors.length ? [{ terms: { basicColors: resolvedColors } }] : []),
            ...(tags.length ? [{ terms: { tags } }] : []),
          ]
        }
      }
    };

    const { hits } = await client.search(searchParams);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ results: hits.hits.map(hit => hit._source) })
    };
  } catch (err) {
    console.error('Search error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Failed to search products.' })
    };
  }
};