// @ts-check
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RestLink } from 'apollo-link-rest'
import { print as printSchema } from 'graphql/language/printer'
import { ApolloLink, from, execute, Observable } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { ApolloProvider, graphql as withGraph } from 'react-apollo'
import customFetch from 'node-fetch'
import fragmentMatcher from './fragmentMatcher'
import chalk from 'chalk'
import { linkSync } from 'fs'

/**
 * @typedef { import("apollo-client/ApolloClient").DefaultOptions } DefaultOptions
 * @typedef { import("apollo-link-rest/restLink").RestLink.CustomFetch} CustomFetch
 * @typedef { import("apollo-link-error").ErrorLink.ErrorHandler } ErrorHandler
 */

const links = new Set()
const restLink = new RestLink({
  uri: process.env.REST_API_ENDPOINIT,
  customFetch: /** @type {any} */ (customFetch), // TODO: check why generates TS linting error
  credentials: 'same-origin'
})

const loggerLink = new ApolloLink((operation, forward) => {
  const startTime = new Date().getTime()
  return forward(operation).map(data => {
    const ellapsed = new Date().getTime() - startTime
    console.log(`Operation ${operation.operationName} took ` + chalk.red`${ellapsed} ms`)
    return data
  })
})
const errorLink = errorHandler =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
      errorHandler(`[Network error]: ${networkError}`)
    }
    if (graphQLErrors && graphQLErrors.filter(Boolean).length > 0) {
      graphQLErrors.forEach(({ message = '', locations, path }, index) => {
        errorHandler(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      })
      // TODO: Retry logic + token getter
      if (graphQLErrors.some(({ extensions }) => extensions.code === 'UNAUTHENTICATED')) {
        operation.setContext(oldContext => ({
          headers: {
            ...oldContext.headers,
            authorization: localStorage.getItem(/** @type {string} */ (process.env.AUTH_TOKEN_NAME)) || null
          }
        }))
        return forward(operation)
      }
    }
  })
const defaultErrorHandler = console.log
links.add(loggerLink)
links.add(errorLink(defaultErrorHandler))
links.add(restLink)

/**
 * @type { DefaultOptions }
 */
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  }
}
/**
 * @type { ApolloClient }
 */
const client = new ApolloClient({
  ssrMode: true,
  ssrForceFetchDelay: 100,
  connectToDevTools: process.env.NODE_ENV === 'development',
  defaultOptions,
  link: from(Array.from(links)),
  cache: new InMemoryCache({
    dataIdFromObject: o => `${o.__typename}_${o.id}`,
    fragmentMatcher
  })
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>TEST</div>
      </ApolloProvider>
    )
  }
}

ReactDOM['render'](<App />, document.getElementById('root'), () => {
  // TODO: insert analytics / loggers
})
