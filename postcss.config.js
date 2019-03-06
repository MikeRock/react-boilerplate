module.exports = ({ file, options, env }) => ({
  plugins: {
    tailwindcss: {},
    'postcss-import': {},
    autoprefixer: env === 'production' ? options.autoprefixer : false,
    'postcss-browser-reporter': {},
    'postcss-reporter': {}
  }
})
