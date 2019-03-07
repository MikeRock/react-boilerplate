import React, { Component, Fragment } from 'react'

const pass = (...args: Recompose.HOC<any>[]) => (Comp: Recompose.Component<any, any>) =>
  class extends Component<any, any> {
    render() {
      const { children, ...rest } = this.props
      const C = args.reduce((acc: Recompose.Component<any, any>, c: Recompose.HOC<any>) => c(acc), Comp)
      return (
        <Fragment>
          <C {...rest}>children</C>
        </Fragment>
      )
    }
  }
export default pass
