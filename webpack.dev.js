const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    entry: './demo/index.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Vienna',
            template: 'demo/index.html'
        }),
    ],
    devServer: {
        static: './lib',
    },
});
