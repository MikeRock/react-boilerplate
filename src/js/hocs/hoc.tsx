import React, { Component, Fragment } from 'react'

const hoc = (...args: Recompose.HOC<any>[]) => (Comp: Recompose.Component<any, any>) =>
  class extends Component<any, any> {
    render() {
      const C: Recompose.Component<any, any> = args.reduce(
        (acc: Recompose.Component<any, any>, c: Recompose.HOC<any>) => c(acc),
        Comp
      )
      return (
        <Fragment>
          <C {...this.props}>this.props.children</C>
        </Fragment>
      )
    }
  }
export default hoc
