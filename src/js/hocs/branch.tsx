import React, { Component, Fragment } from 'react'
import renderComponent from './renderComponent'

const branch = (
  condition: Recompose.Maybe<() => boolean | boolean>,
  hoc: Recompose.HOC<any>,
  fallback: Recompose.HOC<any>
) => (condition ? hoc : fallback)
export default branch
