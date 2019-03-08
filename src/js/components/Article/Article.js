import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './styles.scss'

const cx = classnames(styles)

export default class ArticlePage extends Component {
  state = {}

  render() {
    return <div styleName={`article`} />
  }
}
