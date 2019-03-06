import React, { Component, Fragment } from 'react'

const renderComponent = (Comp: Recompose.Component<any, any>) => (args: Recompose.Maybe<{ [key: string]: any }>) =>
  class extends Component<any, any> {
    render() {
      return <Comp {...this.props} {...args} />
    }
  }
export default renderComponent
