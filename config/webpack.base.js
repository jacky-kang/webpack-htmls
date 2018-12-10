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
  entry: {},
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
    })
  ]
}

/**
 *
 * @param startPath  起始目录文件夹路径
 * @param useSubdirectories
 * @param regExp
 * @returns {Array}
 */
function findSync (startPath, useSubdirectories, regExp) {
  let result = []

  function finder (dir) {
    let files = fs.readdirSync(dir)
    files.forEach((val) => {
      let fPath = path.join(dir, val)
      let stats = fs.statSync(fPath)
      if (useSubdirectories && stats.isDirectory()) finder(fPath, useSubdirectories, regExp)
      if (stats.isFile() && regExp.test(fPath)) result.push(fPath)
    })

  }

  finder(startPath)
  return result
}

let fileNames = findSync('./src/page', true, /\.html$/)
fileNames.forEach(item => {
  const dir = item.replace(/^src\/page\/([\S]+)\/([^/]+)\.html$/, '$1')
  const html = item.replace(/^src\/page\/([\S]+)\/([^/]+)\.html$/, '$1') + '.html'
  const js = item.replace(/^([\S]+)\.html$/, '$1.js')
  console.log(dir)
  console.log(item)
  console.log(js)
  console.log('\n')
  config.entry[dir] = './' + js
  config.plugins.push(new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: true
    },
    hash: true,
    template: item,
    filename: html,
    chunks: dir,
    inject: 'body'
  }))
})

module.exports = config
