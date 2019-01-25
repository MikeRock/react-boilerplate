import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import { AuthError } from './../server'
// If oauth fails tru token authentication
export default {
  isAuthenticated: (next, source, args, context) => {
    if (context.isAuthenticated) return next()
    const token = context.headers.authorization
    if (!token) {
      throw new AuthError({
        message: 'You must supply a JWT for authorization!'
      })
    }
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
      context.user = decoded
      return next()
    } catch (err) {
      throw new AuthError({
        message: 'You are not authorized.'
      })
    }
  },
  hasScope: (next, source, args, context) => {
    const token = context.headers.authorization
    const expectedScopes = args.scope
    if (!token) {
      throw new AuthError({
        message: 'You must supply a JWT for authorization!'
      })
    }
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
      const scopes = decoded.scope.split(' ')
      if (expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
        return next()
      }
    } catch (err) {
      return Promise.reject(
        new AuthError({
          message: `You are not authorized. Expected scopes: ${expectedScopes.join(', ')}`
        })
      )
    }
  },
  rest(next, source, { url }, context) {
    next().then(_ => {
      return fetch(url)
    })
  }
}
