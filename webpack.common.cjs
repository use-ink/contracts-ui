const path = require('path');
const webpack = require('webpack');

const rules = [
  {
    test:/\.tsx?/,
    exclude: /node_modules/,
    loader:'ts-loader'
  }
]
module.exports = {
  target:'web',
  entry:'./src/index.tsx',
  output: {
    path:path.resolve(".", 'dist'),
    filename:'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })],
  module: {rules},
  resolve:{
    extensions:['.ts', '.tsx', '.js'],
    fallback: { "crypto": require.resolve("crypto-browserify"), "stream": require.resolve("stream-browserify"), "buffer": require.resolve("buffer") }
  },
}
