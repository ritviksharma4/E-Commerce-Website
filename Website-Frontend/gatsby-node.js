// gatsby-node.js
const {
  CognitoIdentityClient
} = require('@aws-sdk/client-cognito-identity');
const {
  fromCognitoIdentityPool
} = require('@aws-sdk/credential-provider-cognito-identity');
const {
  DynamoDBClient,
  ScanCommand,
} = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
require('dotenv').config();

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'develop' || stage === 'build-javascript') {
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const REGION = process.env.GATSBY_APP_AWS_REGION;
  const IDENTITY_POOL_ID = process.env.GATSBY_APP_COGNITO_IDENTITY_POOL_ID;
  const TABLE_NAME = process.env.GATSBY_APP_DYNAMODB_TABLE;

  const credentials = fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  });

  const client = new DynamoDBClient({
    region: REGION,
    credentials,
  });

  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      ProjectionExpression: 'productCode',
    });

    const response = await client.send(command);

    if (!response.Items || response.Items.length === 0) {
      console.error('❌ No product codes found in DynamoDB. No product pages will be created.');
      return;
    }

    const productCodes = response.Items.map(item => unmarshall(item).productCode);

    console.log(`✅ Found ${productCodes.length} products in DynamoDB.`);
    console.log(`Product Codes: ${productCodes}`)

    productCodes.forEach(productCode => {
      createPage({
        path: `/product/${productCode}`,
        component: require.resolve('./src/templates/ProductPage.js'),
        context: { productCode },
      });
    });

  } catch (error) {
    console.error('❌ Error while fetching product codes from DynamoDB:', error);
    throw new Error('Failed to create product pages due to DynamoDB error.');
  }
};