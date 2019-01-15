// webpack.common.js - common webpack config
const LEGACY_CONFIG = 'legacy'
const MODERN_CONFIG = 'modern'

// node modules
const path = require('path')
const merge = require('webpack-merge')
const Debug = require('debug')
const incstr = require('incstr')

// webpack plugins
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')

// config files
const pkg = require('./../package.json')
const settings = require('./webpack.settings.js')
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
// Configure Babel loader
const configureBabelLoader = () => {
  return {
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
}

// Configure Entries
const configureEntries = () => {
  console.log(__dirname)
  let entries = {}
  for (const [key, value] of Object.entries(settings.entries)) {
    entries[key] = path.resolve(__dirname, settings.paths.src.js + value)
  }

  return entries
}

// Configure Font loader
const configureFontLoader = () => {
  return {
    test: /\.(ttf|eot|woff2?)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  }
}

// Configure Manifest
const configureManifest = fileName => {
  return {
    fileName: fileName,
    basePath: settings.manifestConfig.basePath,
    map: file => {
      file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2')
      return file
    }
  }
}

// The base webpack config
const baseConfig = {
  name: pkg.name,
  entry: configureEntries(),
  output: {
    path: path.resolve(__dirname, settings.paths.dist.base),
    publicPath: settings.urls.publicPath()
  },
  module: {
    rules: [configureFontLoader()]
  },
  plugins: [new WebpackNotifierPlugin({ title: 'Webpack', excludeWarnings: true, alwaysNotify: true })]
}

// Legacy webpack config
const legacyConfig = {
  module: {
    rules: [configureBabelLoader()]
  },
  plugins: [
    new CopyWebpackPlugin(settings.copyWebpackConfig),
    new ManifestPlugin(configureManifest('manifest-legacy.json'))
  ]
}

// Modern webpack config
const modernConfig = {
  module: {
    rules: [configureBabelLoader()]
  },
  plugins: [new ManifestPlugin(configureManifest('manifest.json'))]
}

// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = {
  legacyConfig: merge(legacyConfig, baseConfig),
  modernConfig: merge(modernConfig, baseConfig)
}
