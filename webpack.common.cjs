const path = require('path');
const webpack = require('webpack');
const postcssImport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

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
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
];

module.exports = {
  target: 'web',
  entry: {
    ui: {
      import: path.resolve(__dirname, 'src', 'ui', 'index.tsx'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css',
    }),
    new ESLintPlugin({
      extensions: ['ts', 'tsx', 'js', 'jsx', 'cjs'],
      fix: true,
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
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 320000,
      minSize: 240000,
      cacheGroups: {
        reactBundle: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        },
        polkadotBundle: {
          test: /[\\/]node_modules[\\/](@polkadot)[\\/]/,
        },
        textileBundle: {
          test: /[\\/]node_modules[\\/](@textile)[\\/]/,
        },
      },
    },
  },
};
