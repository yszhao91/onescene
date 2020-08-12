const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);

// 一个常见的`webpack`配置文件
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin"); //打包到html
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");//清除编译报
const copyWebpackPlugin = require("copy-webpack-plugin");//复制文件

module.exports = {
  entry: __dirname + "/src/index.js", //已多次提及的唯一入口文件
  output: {
    path: __dirname + "/dist",
    filename: "[name].[hash].js"
  },
  resolve: {
    alias: {
      "@": __dirname + "/src",
    },
    extensions: [".tsx", ".ts", ".js"]//解析类型
  },
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
  devServer: {
    contentBase: "./dist", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true,
    host: "localhost",
    port: 9089,
    open: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg|tif|glb|mp3)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
              outputPath: './assets/'
            }
          }
        ]
      }, // 下面几行才是 html-loader 的配置内容
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new copyWebpackPlugin([
      {
        from: __dirname + "/assets", //打包的静态资源目录地址
        to: "./assets" //打包到dist下面的public
      }
    ]),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "DUI",
      template: "./index.html",
      filename: "index.html",
      minify: {
        collapseWhitespace: true
      },
      hash: true
    }),
    new webpack.BannerPlugin("版权所有，翻版必究"),

    new ExtractTextPlugin({
      filename: "style.css",
      disable: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.minimize(),
    // 这两行是新增的
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
