import React from 'react' // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom'
import { createClient } from './../../helpers/client/client'
import { ApolloProvider } from 'react-apollo'
import App from './App'

const client = createClient()
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
)

module.hot.accept()
