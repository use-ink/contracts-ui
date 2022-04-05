const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/contracts-ui',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PUBLIC_URL: JSON.stringify('contracts-ui'),
      },
    }),
  ],
});
