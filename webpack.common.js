const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, 'src/index'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      },

      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },

      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/icons/[name][ext]',
        },
      },

      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    new EslintPlugin({ extensions: 'ts' }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src', 'shared', 'assets'), to: path.resolve(__dirname, 'dist', 'assets') },
      ],
    }),
    new FaviconsWebpackPlugin({
      logo: './src/shared/assets/icons/logo.svg',
      mode: 'webapp',
      devMode: 'light',
      prefix: 'assets/icons/favicons/',
      cache: true,
    }),
  ],
};

module.exports = config;
