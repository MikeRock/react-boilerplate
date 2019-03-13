import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'
import { ApolloConsumer } from 'react-apollo'
import LOGIN from 'assets:queries/queries/login.gql'

const { Provider, Consumer } = createContext({
  isAuthenticated: false,
  login: () => {
    throw new Error(`Method "login" needs to be implemented`)
  },
  logout: () => {
    throw new Error(`Method "logout" needs to be implemented`)
  }
})

export default class LoginProvider extends Component {
  state = { loggedIn: false }
  static propTypes = {
    children: PropTypes.any.isRequired
  }
  async login(client) {
    localStorage.removeItem('token')
    // TODO: implement login flow
    try {
      const { token } = await client.query(LOGIN)
      localStorage.setItem('token', token)
      this.setState({ loggedIn: true })
      return true
    } catch (err) {
      return false
    }
  }
  logout() {
    localStorage.removeItem('token')
    this.setState({ loggedIn: false })
  }
  render() {
    const { login, logout } = this
    return (
      <ApolloConsumer>
        {client => (
          <Provider value={{ login: login.bind(client), logout, isAuthenticated: this.state.loggedIn }}>
            {this.props.children}
          </Provider>
        )}
      </ApolloConsumer>
    )
  }
}
export const LoginProviderPropTypes = {
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func,
  logout: PropTypes.func
}
export const withLogin = _Component =>
  class Wrapped extends Component {
    static propTypes = {
      children: PropTypes.any
    }
    render() {
      const { children, ...rest } = this.props
      return (
        <Consumer>
          {values => (
            <_Component {...rest} {...values}>
              {children}
            </_Component>
          )}
        </Consumer>
      )
    }
  }
