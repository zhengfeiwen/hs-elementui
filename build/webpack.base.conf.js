'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  },
  sourceMap: false // 将sourceMap关闭就不会打包出.map文件
})
module.exports = {
  entry: {
    app: './examples/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('examples')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('examples'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.sass$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: Object.assign(vueLoaderConfig, {
          loaders: {
            ts: 'ts-loader',
            tsx: 'babel-loader!ts-loader'
          }
        })
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { appendTsxSuffixTo: [/\.vue$/] }
          }
        ]
      }
    ]
  }
}
