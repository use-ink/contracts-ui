const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      }
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    open: true,
    clientLogLevel: 'debug',
    port: 8081,
    historyApiFallback: true,
    hot: true,
  },
});
