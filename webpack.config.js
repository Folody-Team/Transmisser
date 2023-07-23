const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const crypto = require('crypto');

const id = crypto.randomBytes(20)

module.exports = {
  entry: "./dist/App.js",
  mode: "production",
  output: {
    path: `${__dirname}/app/build`,
    filename: `transmisser.${id.toString('hex')}.js`,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "html/app.html",
      filename: 'app.html',

    }),
    new CleanWebpackPlugin()
  ],
};