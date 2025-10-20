const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js", // هون منكتب اسم ملف ال js اللي رح نشتغل عليه الشغل 
  output: {
    filename: "main.js", // وهون اسم الملف النهائي
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
    port: 8080,//هون تحديد البورت تاع اللوكال هوست
    open: true, // هي مشان يفتح كروم
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html", // اسم ملف ال html الي رح نشتغل عليه
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
         generator: {
    filename: 'images/[name][ext]'
  }
      },
    ],
  },
};
