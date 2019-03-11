import React, { Component, Fragment, lazy } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

export default class Authenticate extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    fallback: PropTypes.any.isRequired
  }
  render() {
    const { fallback, ...rest } = this.props
    return (
      <Query query={'asdas'}>
        {({ loading, error, onComplete, data }) => {
          onComplete(() => {
            // TODO: Add auth flow
          })
          return loading ? fallback(rest) : <Fragment>{this.props.children}</Fragment>
        }}
      </Query>
    )
  }
}
