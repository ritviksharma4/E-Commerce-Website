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