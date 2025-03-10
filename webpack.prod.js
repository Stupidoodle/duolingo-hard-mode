const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: {
		content: "./src/content.js", // Your main content script
		popup: "./src/popup.js",    // Popup script
	},
	output: {
		filename: "[name].bundle.js", // Outputs content.bundle.js and popup.bundle.js
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							["@babel/preset-env", {
								modules: "commonjs", // Force CommonJS module transformation
								targets: "> 0.25%, not dead" // Target browsers
							}]
						],
					},
				},
			}
		]
	},
	mode: "production",
	plugins: [
		// Generates popup.html from the template
		new HtmlWebpackPlugin({
			template: "./src/popup.html", // Path to your popup HTML template
			filename: "popup.html",       // Output file name
			chunks: ["popup"],            // Only include the popup bundle
		}),
	],
};