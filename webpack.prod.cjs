const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/canvas-ui-v2',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});
