import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './styles'
const cx = classnames.bind(styles)
const test = cx('test')
console.log(test)
export default class FrontPage extends Component {
  state = {}

  render() {
    return (
      <div className="flex">
        <div className={`flex-auto ${test}`}>ONE3</div>
        <div className="flex-auto">TWO</div>
      </div>
    )
  }
}
