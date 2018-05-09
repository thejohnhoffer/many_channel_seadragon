const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    context: __dirname,
    mode: 'development',
    entry: ['./src/script.js'],
    module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
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
            from: 'src/static',
            to: 'static'
        }, {
            from: 'src/index.html',
            to: 'index.html'
        }]),
    ]
};
