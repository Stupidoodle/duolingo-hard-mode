const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/content.js",
	output: {
		filename: "content.bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	devtool: "source-map", // Enables better debugging
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
	optimization: {
		minimize: false, // Disable minification for better debugging
	},
};
