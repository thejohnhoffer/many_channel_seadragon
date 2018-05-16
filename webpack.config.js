const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    context: __dirname,
    mode: 'production',
    entry: ['./index.js'],
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
        path: path.resolve(__dirname, 'docs'),
        filename: 'bundle.js'
    },
    plugins: [
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
    ]
};
