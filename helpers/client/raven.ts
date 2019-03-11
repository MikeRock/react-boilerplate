import * as Raven from 'raven'
process.env.RAVEN_PUBLIC_DSN && Raven.config(process.env.RAVEN_PUBLIC_DSN).install()
export function logException(ex, context) {
  process.env.RAVEN_PUBLIC_DSN &&
    Raven.captureException(ex, {
      extra: context
    })
  /*eslint no-console:0*/
  window.console && console.error && console.error(ex)
}
