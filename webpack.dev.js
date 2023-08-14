const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    host: 'localhost',
    port: 9000,
    hot: true,
    watchFiles: path.resolve(__dirname, 'src'),
    historyApiFallback: true,
  },
};

module.exports = merge(commonConfig, devConfig);
