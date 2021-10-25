const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    entry: './src/index.ts',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'vienna.js',
        libraryTarget: 'umd',
        library: 'Vienna',
        umdNamedDefine: true
    },
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
});
