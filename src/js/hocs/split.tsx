import React, { Component, Fragment } from 'react'

const split = (condition: Recompose.Maybe<() => boolean | boolean>, Fallback: Recompose.Component<any, any>) => (
  Comp: Recompose.Component<any, any>
) =>
  class extends Component<any, any> {
    render() {
      const { children, ...rest } = this.props
      return (
        <Fragment>{condition ? <Comp {...rest}>children</Comp> : <Fallback {...rest}>children</Fallback>}</Fragment>
      )
    }
  }
export default split
