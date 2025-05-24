// gatsby-node.js
require('dotenv').config();

const path = require('path');

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'develop' || stage === 'build-javascript') {
    // Your existing MiniCssExtractPlugin fix
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }

  if (stage === 'build-html') {
    // Exclude aws-sdk packages from SSR bundle
    actions.setWebpackConfig({
      externals: {
        '@aws-sdk/client-dynamodb': 'none',
        '@aws-sdk/credential-provider-cognito-identity': 'none',
        '@aws-sdk/util-dynamodb': 'none',
      },
    });
  }

  // Polyfill Node modules for browser builds (develop/build-javascript)
  if (stage === 'develop' || stage === 'build-javascript') {
    actions.setWebpackConfig({
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve('crypto-browserify'),
          path: require.resolve('path-browserify'),
          util: require.resolve('util/'),
        },
      },
    });
  }
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  // your page creation logic here
};