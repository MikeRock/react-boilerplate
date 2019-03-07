import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class ArticlePage extends Component {
  state = {}

  render() {
    const { tag, title, image, className, top } = this.props
    return (
      <div className={`${className} ${_`card`}`}>
        <div data-image={image} className="card__image">
          {tag && <div className={`${_`card__tag`}`}>{tag}</div>}
        </div>
        <div className={`${_`card__headline`} ${top && _`card__headline--top`}`}>{title}</div>
      </div>
    )
  }
}
