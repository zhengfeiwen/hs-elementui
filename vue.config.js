const CompressionWebpackPlugin = require('compression-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = {
  transpileDependencies: ['@packages/index', 'vuex-module-decorator', 'fuse.js', 'plupload', 'debounce', 'async-validator', 'throttle-debounce', 'babel-helper-vue-jsx-merge-props', 'vue-simple-uploader'],
  productionSourceMap: true, // 关闭生产环境的 source map
  lintOnSave: false,
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  devServer: {
    host: 'localhost',
    port: 8080,
    https: false,
    open: true
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件，避免加载多余的资源
    config.plugins.delete('preload')

    config.optimization.minimize(true)

    config.optimization.splitChunks({
      chunks: 'all'
    })

    if (process.env.NODE_ENV !== 'development') {
      config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin())

      config.module.rule('images')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true
        })
        .end()
        .use('url-loader')
        .loader('file-loader')
        .options({
          name: 'assets/[name].[hash:8].[ext]'
        }).end()
      config.module.rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
        .loader('file-loader')
        .options({
          name: 'assets/[name].[hash:8].[ext]'
        })
    }
  },
  configureWebpack: config => {
    // 公共代码抽离
    config.optimization = {
      // 分割代码块
      splitChunks: {
        cacheGroups: {
          // 公用模块抽离
          common: {
            chunks: 'initial',
            minSize: 0, // 大于0个字节
            minChunks: 2 // 抽离公共代码时，这个代码块最小被引用的次数
          },
          // 第三方库抽离
          vendor: {
            priority: 1, // 权重
            test: /node_modules/,
            chunks: 'initial',
            minSize: 0, // 大于0个字节
            minChunks: 2 // 在分割之前，这个代码块最小应该被引用的次数
          }
        }
      }
    }
    // 开启gzip压缩
    config.plugins.push(
      new CompressionWebpackPlugin(
        {
          filename: info => {
            return `${info.path}.gz${info.query}`
          },
          algorithm: 'gzip',
          threshold: 20480, // 只有大小大于该值的资源会被处理 20480
          test: new RegExp('\\.(' + ['js'].join('|') + ')$'
          ),
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        }
      )
    )
  },
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      sass: {
      }
    }
  }
}
