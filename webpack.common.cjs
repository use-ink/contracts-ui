const path = require('path');
const webpack = require('webpack');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';

const rules = [
  {
    test: /\.tsx?/,
    exclude: /node_modules/,
    loader: 'ts-loader',
    options: {
      getCustomTransformers: () => ({
        before: isDevelopment ? [ReactRefreshTypeScript()] : [],
      }),
    },
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
            plugins: [tailwindcss, autoprefixer],
          },
        },
      },
    ],
  },
  {
    test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
    type: 'asset/inline',
  },
];

module.exports = {
  target: 'web',
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css',
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ],
  module: { rules },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    },
  },
};
