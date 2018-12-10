const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./webpack.base')
const spinner = ora('编译中...')

baseConfig.mode = 'production'
baseConfig.plugins.push(
  ...[
    new UglifyJsPlugin()
  ]
)

spinner.start()
webpack(baseConfig, (err, stats) => {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log(chalk.red('  编译失败,编译过程中发生错误.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  编译成功.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening about.html over file:// won\'t work.\n'
  ))
})
