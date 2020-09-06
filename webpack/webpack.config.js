const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssnanoPlugin = require("cssnano-webpack-plugin");

const utils = require("./utils");

module.exports = (env) => ({
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../dist/"),
    filename: "./js/[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-transform-runtime",
          ],
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg|ico)$/i,
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },

              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },

              webp: {
                quality: 75,
              },
            },
          },
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./images/",
              publicPath: "../images/",
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff2?|mp4|mp3|txt|xml|pdf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./files/",
              publicPath: "../files/",
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          {
            // translates CSS into CommonJS
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer],
            },
          },
          {
            // compiles Sass to CSS, using Node Sass by default
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: ["pug-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssnanoPlugin()],
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/](node_modules|vendors)[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/styles.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/views/index.pug",
      minify: true,
    }),
    ...utils.pages(env),
    new BrowserSyncPlugin(
      {
        host: "localhost",
        port: 3000,
        proxy: "http://localhost:8080/",
      },
      {
        reload: false,
      }
    ),
  ],
});
