// @ts-check
import webpack from 'webpack' /* eslint-disable-line */
import noop from 'noop-webpack-plugin'
import path from 'path'
import git from 'git-rev-sync'
import ExcludeWebpackPlugin from './plugins/ExcludeWebpackPlugin'
import Debug from 'debug'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import BrotliWebpackPlugin from 'brotli-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import AssetsWebpackPlugin from 'assets-webpack-plugin'
import ClosurePlugin from 'closure-webpack-plugin'
// import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import SizePLugin from 'size-plugin'
import moment from 'moment'
import RemoteWebpackPlugin from 'save-remote-file-webpack-plugin'
import workbox from 'workbox-webpack-plugin'
import PurgeCssWebpackPlugin from 'purgecss-webpack-plugin'
// import WhitelisterPlugin from 'purgecss-whitelister'
import WebappWebpackPlugin from 'webapp-webpack-plugin'
import WebpackMonitor from 'webpack-monitor'
import WebpackNotifier from 'webpack-notifier'
import WebpackBar from 'webpackbar'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import WorkerPlugin from 'worker-plugin'
import PreloadPlugin from 'preload-webpack-plugin'
// import InlineManifestPlugin from 'inline-manifest-webpack-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import WebpackManifestPlugin from 'webpack-manifest-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CrittersPlugin from 'critters-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import autoprefixer from 'autoprefixer'
import postcssClean from 'postcss-clean'
import rucksack from 'rucksack-css'
import sass from 'node-sass'
import glob from 'glob-all'
import sassUtils from 'node-sass-utils'
import incstr from 'incstr'

const isModern = process.env.BROWSERSLIST_ENV === 'modern'
const isDev = /development/.test(process.env.NODE_ENV)
const useClosureCompiler = /production-google/.test(process.env.NODE_ENV)
const debug = Debug('css')
let localIdentMap = new Map()
const configureBanner = () => {
  return {
    //  exclude: [/\.s?css$/],
    banner: [
      '/*!',
      ' * @project        ' + pkg.name,
      ' * @name           ' + '[filebase]',
      ' * @author         ' + pkg.author.name,
      ' * @build          ' + moment().format('llll') + ' ET',
      ' * @release        ' + git.long() + ' [' + git.branch() + ']',
      ' * @copyright      Copyright (c) ' + moment().format('YYYY') + ' ' + 'Mike Rock',
      ' *',
      ' */',
      ''
    ].join('\n'),
    raw: true
  }
}
const createUniqueIdGenerator = () => {
  const index = {}

  const generateNextId = incstr.idGenerator({
    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789'
  })

  return name => {
    if (index[name]) {
      return index[name]
    }

    let nextId

    do {
      // Class name cannot start with a number.
      nextId = generateNextId()
    } while (/^[0-9]/.test(nextId))

    index[name] = generateNextId()

    return index[name]
  }
}
const uniqueIdGenerator = createUniqueIdGenerator()
const _sass = sassUtils(sass)
const generateScopedName = (localName, resourcePath) => {
  let newIdent
  const [componentName, fileName] = resourcePath.split('/').slice(-2) // Component name if ComponentName/style.scss
  debug(`Generating scoped name for component ${componentName} file ${fileName} : ${localName}`)
  if (/global/.test(fileName)) return localName
  else {
    newIdent = uniqueIdGenerator(componentName) + '_' + uniqueIdGenerator(localName)
    localIdentMap.set(localName, newIdent)
  }
  return newIdent
}
const theme = {
  primary: { color: 'pink' },
  secondary: { color: 'blue' }
}
const pkg = require('./../package.json')
const vendors = Object.keys(pkg.dependencies)

console.log(process.env.NODE_ENV)

/**
 * @type {(env:any, argv: any) => webpack.Configuration}
 */
const config = () => ({
  profile: true,
  stats: 'verbose',
  entry: {
    app: './src/js/index.js',
    'polyfill.modern': './helpers/polyfill.modern.js',
    'polyfill.legacy': './helpers/polyfill.legacy.js'
  },
  resolveLoader: {
    alias: {
      'custom-loader': path.resolve(__dirname, 'loaders/custom-loader.js'),
      'dominant-loader': path.resolve(__dirname, 'loaders/dominant-loader.js')
    }
  },
  devtool: /production/.test(process.env.NODE_ENV) ? 'source-map' : 'inline-source-map',
  output: {
    filename: path.join('./js', '[name].[chunkhash:5].js'),
    publicPath: '/',
    path: path.resolve(__dirname, `./../public/${process.env.BROWSERSLIST_ENV}`),
    chunkFilename: path.join('./js', '[name].[chunkhash:5].js')
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'async',
      minSize: 10000,
      maxInitialRequests: Infinity,
      cacheGroups: {
        vendors: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const [_, packageName] = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendor.${packageName.replace('@', '')}`
          }
        },
        utilities: {
          priority: 0,
          minChunks: 2
        },
        default: false
      }
    },
    minimizer: [
        useClosureCompiler && new ClosurePlugin(
          {
            mode: 'STANDARD',
            output: {
              filename: path.join('./js', '[name].google.[chunkhash:5].js')
            }
          },
          {
            formatting: 'PRETTY_PRINT',
           // jsCode: [{path:"app.+"}],
            languageOut: isModern ? 'ECMASCRIPT_2015' : 'ECMASCRIPT5',
            debug: true,
            renaming: false
          }
        ),
      !useClosureCompiler && new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
        terserOptions: {
          warnings: true,
          mangle: false,
          // keep_fnames: true,
          output: {
            beautify: true,
            comments: true
          }
        }
      })
    ].filter(Boolean)
  },
  target: 'web',
  mode: /production/.test(process.env.NODE_ENV) ? 'production' : 'development',
  resolve: {
    alias: { global: path.resolve(__dirname, 'test.global.scss') },
    extensions: ['.js', '.mjs', '.ts', '.tsx', '.scss', '.css', '.md']
  },
  module: {
    rules: [
      { test: /\.md$/, exclude: /node_modules/, use: ['html-loader', 'markdown-loader'] },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[ext]'
                  // outputPath: '/fonts'
                  //  publicPath: url => `../fonts/${url}`
                }
              },
              limit: 1000000,
              name: '[sha256:hash:base64:5].[ext]'
              // publicPath: '/'
            }
          }
        ]
      },
      {
        test: /(?<!global)\.s?css(\?[=\w]+)?$/,
        exclude: [/node_modules/, /global/],
        include: '/',
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              // exportOnlyLocals: true,
              sourceMap: true,
              modules: true,

              getLocalIdent: (context, localIdentName, localName) => {
                return generateScopedName(localName, context.resourcePath)
              },

              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () =>
                [
                  autoprefixer(),
                  rucksack(),
                  /production/.test(process.env.NODE_ENV) && postcssClean({ level: 2 })
                ].filter(Boolean)
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              keepQuery: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: false,
              data: `$themes:(${Object.keys(theme).toString()});$env: ${process.env.NODE_ENV};`,
              functions: {
                'theme($what, $name)': (what, name) => {
                  _sass.infect()
                  let prop = theme[name.sassString()][what.sassString()]
                  _sass.disinfect()
                  return _sass.castToSass(prop)
                },
                'dimension()': () => {
                  return _sass.castToSass('2px 3px')
                }
              }
            }
          }
        ]
      },
      {
        test: /global\.s?css(\?[=\w]+)?$/,
        exclude: /node_modules/,
        include: [/global/],
        //  include: '/', // path to globals
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
              modules: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () =>
                [
                  autoprefixer(),
                  rucksack(),
                 /production/.test(process.env.NODE_ENV) && postcssClean({ level: 2 })
                ].filter(Boolean)
            }
          },
          {
            loader: 'sass-loader',
            options: {
              functions: {
                'theme($name)': name => {
                  _sass.infect()
                  let color = theme[name.sassString()]
                  _sass.disinfect()
                  return _sass.castToSass(color)
                },
                'dimension()': () => {
                  return _sass.castToSass('2px 3px')
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        exclude: /node_modules/,
        use: [
          'dominant-loader',
          {
            loader: 'url-loader',
            options: {
              fallback: {
                loader: 'responsive-loader',
                options: {
                  placeholder: false
                  // outputPath: '/static'
                }
              },
              limit: 1000000,
              name: 'img/[sha256:hash:base64:5].[ext]'
              // publicPath: '/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        oneOf: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  babelrc: false,
                  extends: path.resolve(__dirname, './../.babelrc'),
                  plugins: [
                    [
                      'babel-plugin-react-css-modules',
                      {
                        generateScopedName,
                        filetypes: {
                          '.scss': {
                            syntax: 'postcss-scss'
                          }
                        }
                      }
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'awesome-typescript-loader',
          {
            loader: 'custom-loader',
            options: {
              customOption: 'test'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    true
      ? noop()
      : new CleanWebpackPlugin(['public'], {
          root: process.cwd()
        }),
    new webpack.BannerPlugin(configureBanner()),
    new webpack.DefinePlugin({
      // NODE_ENV defined already with mode set
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BROWSERSLIST_ENV: JSON.stringify(process.env.BROWSERSLIST_ENV)
      }
    }),
    new WebpackManifestPlugin({
      publicPath: './', // replaces publicPath
      fileName: `manifest.${process.env.BROWSERSLIST_ENV}.json`,
      writeToFileEmit: true
    }),
    new HtmlWebpackPlugin({
      template: `!!prerender-loader?string!${path.resolve(process.cwd(), 'src/templates/template.html')}`,
      filename: 'index.html',
      title: 'Custom Title',
      compile: false,
      inject: true,
      minify: {
        collapseWhitespace: false,
        preserveLineBreaks: false
      }
    }),
    new ExcludeWebpackPlugin({patterns:[/(?<!(app))\.google/]}),

    new PreloadPlugin({
      rel: 'preload',
      include: 'allAssets',
      fileWhitelist: [/\.(ttf|otf|woff(2)?)(\?[=\w]+)?$/], // Preload fonts only
      as(entry) {
        if (/\.css(\?[=\w]+)?$/.test(entry)) return 'style'
        if (/\.(ttf|otf|woff(2)?)$/.test(entry)) return 'font'
        if (/\.(png|jpe?g|gif)$/.test(entry)) return 'image'
        return 'script'
      }
    }),
    new MiniCSSExtractPlugin({
      filename: path.join('./css', '[name].[chunkhash].css')
    }),
    !isDev
      ? new CompressionPlugin({
          test: /\.js(\?[=\w]+)?$/i,
          filename: '[path].gz[query]',
          compressionOptions: { level: 5 }
        })
      : noop(),
    isDev
      ? new WebpackMonitor({
          capture: true, // -> default 'true'
          target: path.resolve(process.cwd(), 'webpack/logs/stats.json'), // default -> '../monitor/stats.json'
          launch: false, // -> default 'false'
          port: 3030, // default -> 8081
          excludeSourceMaps: true // default 'true'
        })
      : noop(),
    new CrittersPlugin(),

    /** @type {any} **/ (() =>
      new workbox.GenerateSW({
        swDest: 'sw.js',
        precacheManifestFilename: 'js/precache-manifest.[manifestHash].js',
        importScripts: ['js/workbox-catch-handler.js'],
        clientsClaim: true,
        skipWaiting: true,
        offlineGoogleAnalytics: true,
        exclude: [/\.(?:png|jpg|jpeg|svg|webp)$/, /\.map$/, /^manifest.*\\.js(?:on)?$/],
        runtimeCaching: [
          {
            // Match any request ends with .png, .jpg, .jpeg or .svg.
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,

            // Apply a cache-first strategy.
            handler: 'cacheFirst',

            options: {
              // Use a custom cache name.
              cacheName: 'images',

              // Only cache 10 images.
              expiration: {
                maxEntries: 10
              }
            }
          }
        ]
      }))(),
    new WebpackNotifier({ title: 'Webpack', excludeWarnings: true, alwaysNotify: true }),
    new WorkerPlugin(),
    new WebappWebpackPlugin({
      logo: './src/img/favicon-src.png',
      prefix: 'img/favicons/',
      cache: false,
      inject: 'force',
      favicons: {
        appName: pkg.name,
        appDescription: pkg.description,
        developerName: pkg.author.name,
        developerURL: pkg.author.url,
        path: './../public/'
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(process.cwd(), 'helpers/workbox-catch-handler.js'),
        to: 'js/[name].[ext]'
      }
    ]),
    new RemoteWebpackPlugin({
      url: 'https://www.google-analytics.com/analytics.js',
      filepath: 'js/analytics.js'
    }),
    new PurgeCssWebpackPlugin({
      paths: glob.sync(
        [
          path.resolve(process.cwd(), 'src/**/*'),
          path.resolve(process.cwd(), 'public/**/*.{html}'),
          path.resolve(process.cwd(), 'src/js/**/*.{js}')
        ],
        { nodir: true }
      ),
      whitelist: () => Array.from([].map(key => localIdentMap.get(key))),
      // whitelist: WhitelisterPlugin([path.resolve(process.cwd(), './src/css/**/*.css')]),
      whitelistPatterns: [/unused/]
    }),
    new SizePLugin(),
    !isDev ? new BrotliWebpackPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }) : noop(),
    new ScriptExtHtmlWebpackPlugin({
      module: /modern/,
      custom: [
        {
          test: /legacy/,
          attribute: 'nomodule'
        },
        {
          test: /\w+/,
          attribute: 'crossorigin',
          vaule: 'use-credentials'
        }
      ]
    }),
    new AssetsWebpackPlugin({
      prettyPrint: true,
      filename: `assets-manifest.${process.env.BROWSERSLIST_ENV}.json`,
      path: path.resolve(process.cwd(), 'public')
    }),
    new WebpackBar({
      profile: true
    })
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Uncomment if using Moment.js
    /*
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerPort: 8080
    })
    */
  ]
})

export default config
