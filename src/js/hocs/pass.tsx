import React, { Component, Fragment } from 'react'

const pass = (...args: Recompose.HOC<any>[]) => (Comp: Recompose.Component<any, any>) =>
  class extends Component<any, any> {
    render() {
      const C = args.reduce((acc: Recompose.Component<any, any>, c: Recompose.HOC<any>) => c(acc), Comp)
      return (
        <Fragment>
          <C {...this.props}>this.props.children</C>
        </Fragment>
      )
    }
  }
export default pass
