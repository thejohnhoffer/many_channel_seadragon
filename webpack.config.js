const path = require('path');
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    context: __dirname,
    mode: 'production',
    entry: [
      './index.js',
      'webpack/hot/only-dev-server',
      'webpack-dev-server/client?http://0.0.0.0:8487'
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
               presets: ['babel-preset-env']
            }
          }
        }
      ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([{
            from: 'src/images',
            to: 'images'
        }, {
            from: 'src/favicons',
            to: '.'
        }, {
            from: 'src/static',
            to: 'static'
        }, {
            from: 'src/index.html',
            to: 'index.html'
        }]),
  	    new Dotenv()
    ],
    devServer: {
      hot: true
    }
};
