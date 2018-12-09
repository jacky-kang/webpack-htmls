const webpack = require('webpack')
const WebpackDevServerOutput = require('webpack-dev-server-output')
const baseConfig = require('./webpack.base')

// 开发模式
baseConfig.mode = 'development'
// 打包文件在内存中的输出路径,可以通过http://localhost:8888/访问
baseConfig.output.publicPath = '/'
// 方便追踪源代码中的错误
baseConfig.devtool = 'source-map'
// 服务配置
baseConfig.devServer = {
  // 发布服务的文件夹
  contentBase: baseConfig.output.path,
  host: '0.0.0.0',
  port: 8888,
  // 声明为热替换
  hot: true,
  // 第一次打包时打开浏览器
  open: true,
  // 模式
  inline: true,
  // 与output中的内容保持一致
  publicPath: baseConfig.output.publicPath
}
baseConfig.plugins.push(
  ...[
    new webpack.NamedModulesPlugin(),
    // 热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 将webpack-dev-server在内存中打包的文件输出为本地文件
    // new WebpackDevServerOutput({
    //   path: './dist',
    //   isDel: true
    // })
  ]
)

module.exports = baseConfig
