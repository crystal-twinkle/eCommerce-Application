const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const prodConfig = {
  mode: 'production',
  devServer: {
    historyApiFallback: true,
  },
};

module.exports = merge(commonConfig, prodConfig);
