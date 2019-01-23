import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-client'
import InMemoryCache from 'apollo-cache-inmemory'
import { RestLink } from 'apollo-link-rest'
import {print as printSchema} from 'graphql/language/printer'
import { ApolloLink } from 'apollo-link'
import {onError} from 'apollo-link-error'
import { ApolloProvider, graphql as withGraph } from 'react-apollo'
import customFetch from 'node-fetch'

const links = new Set()
const restLink = new RestLink({
  uri: process.env.REST_API_ENDPOINIT,
  customFetch,
  credentials: 'same-origin'
})

const errorLink = onError(({ graphQLErrors, networkError, context, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
})

links.add(errorLink)
links.add(restLink)

const client = ApolloClient({
  link: ApolloLink.from(Array.from(links)),
  cache: new InMemoryCache()
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
  // TODO insert analytics / loggers
})
