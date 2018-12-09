// 引入node相关模块
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const outDir = path.resolve(__dirname, '../dist')
const rootPath = path.resolve(__dirname, '../')

// 设置路径
const config = {
  // 打包开始的地方,即从这里开始分析模块和资源依赖
  entry: {
    index: './src/page/index/index.js'
  },
  // 输出
  output: {
    // 输出路径
    path: outDir,
    // 输出文件名
    filename: 'js/[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'raw-loader',
          }
        ]
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')('last 100 versions')]
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')('last 100 versions')]
            }
          }
        ],
        exclude: path.resolve(__dirname, '/node_modules'),
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.jpg|png|jpeg|gif$/,
        use: ['file-loader']
      },
      {
        test: /\.jpg|gif|png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000//以bit为单位，当小于10000bit时，编码，大于10000bit时，不编码
          }
        }]
      }

    ]
  },
  plugins: [
    new CleanWebpackPlugin([outDir], {
      root: rootPath,
      verbose: true
    }),
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      template: './src/page/index/index.html',
      chunks: 'index',
      inject: 'body'
    })
  ]
}

module.exports = config
