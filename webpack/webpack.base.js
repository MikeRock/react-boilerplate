// @ts-check
import webpack from 'webpack' /* eslint-disable-line */
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import GitRevisionPlugin from 'git-revision-webpack-plugin'
import noop from 'noop-webpack-plugin'
import path from 'path'
import { matchesUA } from 'browserslist-useragent'
import Debug from 'debug'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
// import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import SizePLugin from 'size-plugin'
import RemoteWebpackPlugin from 'save-remote-file-webpack-plugin'
import workbox from 'workbox-webpack-plugin'
import PurgeCssWebpackPlugin from 'purgecss-webpack-plugin'
// import WhitelisterPlugin from 'purgecss-whitelister'
import WebappWebpackPlugin from 'webapp-webpack-plugin'
import WebpackMonitor from 'webpack-monitor'
import WebpackNotifier from 'webpack-notifier'
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
import WebpackPWAManifest from 'webpack-pwa-manifest'
import autoprefixer from 'autoprefixer'
import postcssClean from 'postcss-clean'
import rucksack from 'rucksack-css'
import sass from 'node-sass'
import glob from 'glob-all'
import sassUtils from 'node-sass-utils'
import incstr from 'incstr'

const isModern = process.env.BROWSERSLIST_ENV === 'modern'
const debug = Debug('css')
let localIdentMap = new Map()
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
const GitRev = new GitRevisionPlugin()

/**
 * @type {(env:any, argv: any) => webpack.Configuration}
 */
const config = () => ({
  entry: {
    app: './src/js/App.js',
    'polyfill.modern': './helpers/polyfill.modern.js',
    'polyfill.legacy': './helpers/polyfill.legacy.js'
  },
  resolveLoader: {
    alias: {
      'custom-loader': path.resolve(__dirname, 'loaders/custom-loader.js'),
      'dominant-loader': path.resolve(__dirname, 'loaders/dominant-loader.js')
    }
  },
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
          test: /[\\/]node_modules[\\/](react(-dom)?)/,
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
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
        terserOptions: {
          // ecma: isModern ? 6 : 5,
          warnings: true,
          mangle: false,
          // keep_fnames: true,
          output: {
            beautify: true,
            comments: false
          }
        }
      })
    ]
  },
  target: 'web',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
                  process.env.NODE_ENV === 'production' && postcssClean({ level: 2 })
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
                  process.env.NODE_ENV === 'production' && postcssClean({ level: 2 })
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
            test: /prerender\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      regenerator: true,
                      sourceType: 'script'
                    }
                  ]
                ]
              }
            }
          },
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
    GitRev.gitWorkTree ? new webpack.BannerPlugin({ banner: `COMMIT ${GitRev.commithash()}` }) : noop(),
    new webpack.DefinePlugin({
      // NODE_ENV defined already with mode set
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BROWSERSLIST_ENV: JSON.stringify(process.env.BROWSERSLIST_ENV)
      }
    }),
    new WebpackPWAManifest({
      filename: 'manifest.json',
      name: 'My Progressive Web App',
      short_name: 'MyPWA',
      description: 'My awesome Progressive Web App!',
      background_color: '#ffffff',
      crossorigin: 'use-credentials' // can be null, use-credentials or anonymous
      /*
      icons: [
        {
          src: path.resolve('assets/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        },
        {
          src: path.resolve('assets/large-icon.png'),
          size: '1024x1024' // you can also use the specifications pattern
        }
      ]
  */
    }),
    new WebpackManifestPlugin({
      publicPath: './', // replaces publicPath
      fileName: 'chunk-manifest.json',
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
    process.env.NODE_ENV === 'production'
      ? new CompressionPlugin({
          test: /\.js(\?[=\w]+)?$/i,
          filename: '[path].gz[query]',
          compressionOptions: { level: 5 }
        })
      : noop(),
    process.env.NODE_ENV === 'development'
      ? new WebpackMonitor({
          capture: true, // -> default 'true'
          target: path.resolve(process.cwd(), 'webpack/logs/stats.json'), // default -> '../monitor/stats.json'
          launch: false, // -> default 'false'
          port: 3030, // default -> 8081
          excludeSourceMaps: true // default 'true'
        })
      : noop(),
    // new CrittersPlugin(),

    /** @type {any} **/ (() =>
      new workbox.GenerateSW({
        swDest: 'sw.js',
        precacheManifestFilename: 'js/precache-manifest.[manifestHash].js',
        importScripts: ['js/workbox-catch-handler.js'],
        clientsClaim: true,
        skipWaiting: true,
        offlineGoogleAnalytics: true,
        exclude: [/\.(?:png|jpg|jpeg|svg)$/, /\.map$/, /^manifest.*\\.js(?:on)?$/],
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
    new ScriptExtHtmlWebpackPlugin({
      module: /modern/,
      custom: [
        {
          test: /legacy/,
          attribute: 'nomodule'
        }
      ]
    })
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Uncomment if using Moment.js
    // new InterpolateHtmlPlugin(process.env),
    /*
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerPort: 8080
    })
    */
  ]
})

export default config
