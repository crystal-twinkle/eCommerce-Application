const path = require('path');
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const devConfig = {
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    watchFiles: path.resolve(__dirname, 'src'),
    port: 9000
  },
};

module.exports = merge(commonConfig, devConfig);