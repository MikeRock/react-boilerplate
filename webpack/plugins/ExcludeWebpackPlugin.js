export default class ExcludeWebpackPlugin {
  constructor({patterns}) {
    this.patterns = patterns
  }
  checkIgnore(assetName, ignorePatterns) {
    return ignorePatterns.some(function (pattern) {
      if (Array.isArray(pattern)) {
        return this.checkIgnore(assetName, pattern);
      }
      return pattern.test(assetName);
    });
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('ExcludeWebpackAssets', (compilation, callback) => {
      Object.keys(compilation.assets)
        .filter(asset => this.checkIgnore(asset,this.patterns)
        )
        .forEach(asset => {
          delete compilation.assets[asset]
        })

      callback()
    })
  }
}
