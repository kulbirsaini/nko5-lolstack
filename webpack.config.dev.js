'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, "web"),

  entry: {
    home: [
      'webpack-hot-middleware/client',
      './js/index.js'
    ],
    login: [
      'webpack-hot-middleware/client',
      './js/pages/login.js'
    ],
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".scss"]
  },
  output: {
    filename: "[name]-bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: '/dist/'
  },

  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/,   loader: "style!css!sass?outputStyle=expanded" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" },
      { test: /\.gif$/,    loader: "file" },
      { test: /\.jsx?$/, loader: 'babel' }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  eslint: {
    configFile: '.eslintrc'
  }
};
