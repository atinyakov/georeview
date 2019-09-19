const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
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
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        compress: true,
        port: 8000
      }

}
 
module.exports = conf;