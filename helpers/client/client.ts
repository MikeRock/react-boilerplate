// Apollo GraphQL client

import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split, concat } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { RestLink } from 'apollo-link-rest'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'

/* Local */
// TODO: Decide if apollo state is needed
//import createState from './state'
/* Global declarations */

declare const __BROWSER__: boolean
// ----------------------------------------------------------------------------

// TODO: Setup optional websocket support
const WS_SUBSCRIPTIONS = false

export function createClient(): ApolloClient<NormalizedCacheObject> {
  // Create the cache first, which we'll share across Apollo tooling.
  // This is an in-memory cache. Since we'll be calling `createClient` on
  // universally, the cache will survive until the HTTP request is
  // responded to (on the server) or for the whole of the user's visit (in
  // the browser)
  const cache = new InMemoryCache()

  // Create a HTTP client (both server/client). It takes the GraphQL
  // server from the `GRAPHQL` environment variable, which by default is
  // set to an external playground at https://graphqlhub.com/graphql
  const httpLink = new HttpLink({
    credentials: 'same-origin',
    uri: process.env.GRAPHQL_URI
  })
  // TODO: Pass auth headers through apollo links
  const headers = new Headers()
  headers.append('X-AUTH-TOKEN', process.env.REST_TOKEN as string)
  headers.append('Accept', 'application/json')

  // Rest link for generating REST requests
  const restLink = new RestLink({
    credentials: 'omit',
    headers,
    endpoints: {
      prod: process.env.REST_URI || 'https://swapi.co/api/',
      test: 'https://swapi.co/api/'
    },
    uri: process.env.REST_URI
  })
  // If we're in the browser, we'd have received initial state from the
  // server. Restore it, so the client app can continue with the same data.
  if (__BROWSER__) {
    cache.restore((window as any).__APOLLO_STATE__)
  }

  // Return a new Apollo Client back, with the cache we've just created,
  // and an array of 'links' (Apollo parlance for GraphQL middleware)
  // to tell Apollo how to handle GraphQL requests
  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      // General error handler, to log errors back to the console.
      // Replace this in production with whatever makes sense in your
      // environment. Remember you can use the global `SERVER` variable to
      // determine whether you're running on the server, and record errors
      // out to third-party services, etc
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
          )
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`)
        }
      }),

      // Connect local Apollo state. This is our primary mechanism for
      // managing 'flux'/local app data, in lieu of Redux or MobX

      // createState(cache),

      // Split on HTTP and WebSockets
      WS_SUBSCRIPTIONS && __BROWSER__
        ? split(
            ({ query }) => {
              const definition = getMainDefinition(query)
              return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
            },
            // Use WebSockets for subscriptions
            new WebSocketLink(
              // Replace http(s) with `ws` for connecting via WebSockts
              new SubscriptionClient((process.env.GRAPHQL_URI as any).replace(/^https?/, 'ws'), {
                reconnect: true // <-- automatically redirect as needed
              })
            ),
            // ... fall-back to HTTP/REST for everything else
            split(() => process.env.API_TYPE === 'REST', restLink, httpLink)
          )
        : split(() => process.env.API_TYPE === 'REST', restLink, httpLink)
    ]),
    // On the server, enable SSR mode
    ssrMode: !__BROWSER__
  })
}
