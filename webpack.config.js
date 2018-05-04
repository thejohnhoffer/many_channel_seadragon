const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    context: __dirname,
    mode: 'development',
    entry: ['./src/script.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: 'src/images',
            to: 'images'
        }, {
            from: 'src/static',
            to: 'static'
        }, {
            from: 'src/index.html',
            to: 'index.html'
        }]),
    ]
};
