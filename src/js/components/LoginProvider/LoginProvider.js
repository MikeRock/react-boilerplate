import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'

const LoginContext = createContext({
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
  login(token) {
    localStorage.setItem('token', token)
    this.setState({ loggedIn: true })
  }
  logout() {
    localStorage.removeItem('token')
    this.setState({ loggedIn: false })
  }
  render() {
    const { login, logout } = this
    return (
      <LoginContext.Provider value={{ login, logout, isAuthenticated: this.state.loggedIn }}>
        {this.props.children}
      </LoginContext.Provider>
    )
  }
}

export const withLogin = _Component =>
  class Wrapped extends Component {
    static propTypes = {
      children: PropTypes.any
    }
    render() {
      const { children, ...rest } = this.props
      return (
        <LoginContext.Consumer>
          {provider => (
            <_Component {...rest} {...provider}>
              {children}
            </_Component>
          )}
        </LoginContext.Consumer>
      )
    }
  }
