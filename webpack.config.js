const _path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

//everything has comment to discussing its meanning ----------------------------------------------------------------------

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "index.bundle.js", //file name will genetrated as index.js
    path: _path.resolve(__dirname, "bulid"), //generated folder name --> abslute path (folder path) + "bulid"
    assetModuleFilename: 'image/[name][ext]' //folder asset will generated as image and dont hash images name --> can add [hash] to hash
  },
  module: {
    rules: [
      //css files loaders
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      //images loader and types
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // sass loaders
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] // Creates `style` nodes from JS strings
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/main.html" }),//serve main js file to html
  new MiniCssExtractPlugin({ filename: "style.bundle.css" }),  //extract css  - handle css in file not inline
  new CssMinimizerPlugin() //minify the code
  ],
  optimization: {
    minimizer: [
      //terser
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["mozjpeg", { quality: 50 }],  //to reduce jpeg quality ---> using losey 
              ["optipng", { optimizationLevel: 5 }],
              ["svgo", {
                name: 'preset-default',
                params: {
                  overrides: {
                    // customize plugin options
                    convertShapeToPath: {
                      convertArcs: true
                    },
                    // disable plugins
                    convertPathData: false
                  }
                }
              }
              ],
            ],
          },
        },
      }),
    ],
  }

}