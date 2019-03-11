import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundry extends Component {
  static propTypes = {
    prop: PropTypes
  }
  componentDidCatch(err) {
    console.error(err)
  }
  render() {
    return <Fragment>{this.props.children}</Fragment>
  }
}
