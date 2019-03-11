import gql from 'graphql-tag'
import { Observable, ApolloLink } from 'apollo-link'
import { hasDirectives, checkDocument, removeDirectivesFromDocument, getOperationDefinition } from 'apollo-utilities'

// INFO: Passing login status via context from LoginProvider

export const AUTH_DIRECTIVE_NAME = 'auth'
const sanitizedQueryCache = new Map()
const authManager = {
  isAuthenticated: operation => {
    // TODO: Return if user logged in from Context API
    const { isAuthenticated } = operation.getContext()
    return isAuthenticated
  },
  login: operation => {
    // TODO: Action for login
    const { login } = operation.getContext()
    login && login()
  },
  authHeaderValue: () => {
    // TODO: Get Authorization token somehow
    return localStorage.getItem('token')
  }
}
/**
 * Apollo link for @auth directives
 * @exmaple
 * query {
 *  article @auth {
 *    ... on Article
 * }}
 */
export default new ApolloLink((operation: any, forward: any) => {
  // if no @auth directive then nothing further to do!
  if (!hasDirectives([AUTH_DIRECTIVE_NAME], operation.query)) {
    return forward(operation)
  }

  // get sanitized query (remove @auth directive since server won't understand it)
  const cacheKey = JSON.stringify(operation.query)
  let sanitizedQuery = sanitizedQueryCache[cacheKey]
  if (!sanitizedQuery) {
    // remove directives (inspired by https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/utils.ts)
    checkDocument(operation.query)
    sanitizedQuery = removeDirectivesFromDocument([{ name: AUTH_DIRECTIVE_NAME }], operation.query)
    // save to cache for next time!
    sanitizedQueryCache[cacheKey] = sanitizedQuery
  }

  // overwrite original query with sanitized version
  operation.query = sanitizedQuery

  // build handler
  return new Observable(async observer => {
    let handle

    // if user is not logged in
    if (!authManager.isAuthenticated()) {
      try {
        await authManager.login(operation)
      } catch (err) {
        console.error(err)
        observer.complete([])
      }
    }

    // add auth headers (by this point we should have them!)
    operation.setContext({
      headers: {
        'X-Auth-Token': authManager.authHeaderValue()
      }
    })

    // pass request down the chain
    handle = forward(operation).subscribe({
      next: observer.next.bind(observer),
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer)
    })

    // return unsubscribe function
    return () => {
      if (handle) {
        handle.unsubscribe()
      }
    }
  })
})
