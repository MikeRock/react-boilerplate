import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class ShortlList extends Component {
  state = {}

  render() {
    const { title } = this.props
    return (
      <div className={`${_`shortlist`}`}>
        <div className="headline-tag">
          <a href="/notiser" class="uoh">
            Flere nyheter
          </a>
        </div>
        <h3 class="shortnews-list__frontpage-headline">{$itemDay}</h3>
      </div>
    )
  }
}
