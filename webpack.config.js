const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devServer = (isDev) => (!isDev ? {} : {
  devServer: {
    open: true,
    port: 8080,
  },
});

module.exports = ({ development }) => ({
  mode: development ? 'development' : 'production',
  devtool: development ? 'inline-source-map' : false,
  entry: {
    app: './virtual-keyboard/app-index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'virtual-keyboard/[hash][ext]', // указать папку с assets
  },
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    // ...esLintPlugin(development),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new HtmlWebpackPlugin({ template: './virtual-keyboard/index.html' }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js'],
  },
  ...devServer(development),
});
