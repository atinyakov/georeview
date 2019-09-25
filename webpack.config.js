const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
 
const conf = {
   entry: './src/js/index.js',
   output: {
       path: path.resolve(__dirname, 'dist'),
       filename : 'main.js',
       publicPath: 'dist/'
   },
   module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                  use: "css-loader"
                })
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        compress: true,
        port: 8000
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
    ]
}
 
module.exports = conf;