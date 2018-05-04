const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const HtmlWebpackPlugin = require("html-webpack-plugin");
//const webpack = require("webpack");

module.exports = {
	entry: ["whatwg-fetch","babel-polyfill", "./js/index.js"],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "dist/",
	},
	devtool: "inline-source-map",
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		port: 8000,
		proxy:{
			"/api": {
				target: "http://localhost:61509/TestService/",
				pathRewrite: {"^/api" : ""}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						plugins: ["transform-runtime", "transform-async-generator-functions", "transform-object-rest-spread"],
						presets: ["env", "stage-3"]
					}
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css"),
	]
};