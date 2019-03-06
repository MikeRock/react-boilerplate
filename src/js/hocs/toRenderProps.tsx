import React, { Component, forwardRef, createRef } from 'react'

const toRenderProps = (hoc: Recompose.HOC<any> | any) => (Comp: Recompose.Component<any, any>) =>
  class extends Component<any, any, any> {
    public ref: React.RefObject<React.Component>
    public passedProps: any
    constructor(...args) {
      super(args)
      this.ref = createRef()
    }
    render() {
      const C: Recompose.Component<any, any> = hoc(
        ({ children, ...rest }) => ((this.passedProps = rest), <Comp {...rest}>{children}</Comp>)
      )

      const { children, ...rest } = this.props
      return <C {...rest}>{children(this.passedProps) || {}}</C>
    }
  }
export default toRenderProps
