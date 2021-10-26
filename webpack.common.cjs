const path = require('path');
const webpack = require('webpack');
const postcssImport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const rules = [
  {
    test: /\.tsx?/,
    exclude: /node_modules/,
    loader: 'ts-loader',
  },
  {
    test: /\.(css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [postcssImport, tailwindcss, autoprefixer],
          },
        },
      },
    ],
  },
  {
    test: /\.(png|jpe?g|gif)$/i,
    use: [
      {
        loader: 'file-loader',
      },
    ],
  },
];

module.exports = {
  target: 'web',
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css',
    }),
  ],
  module: { rules },
  resolve: {
    alias: {
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      assert: require.resolve('assert'),
    },
    plugins: [new TsconfigPathsPlugin()],
  },
};
