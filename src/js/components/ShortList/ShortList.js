import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class ShortlList extends Component {
  state = {}

  render() {
    const { className } = this.props
    return (
      <div className={`${className || ''} ${_`shortlist`}`}>
        <div className={`${_`shortlist__item`}`}>
          <a className={`${_`shortlist__link`}`} href="/notiser">
            Disse merkeforhandlerne hatt fått ny eier i 2019
          </a>
        </div>
        <div className={`${_`shortlist__item`}`}>
          <a className={`${_`shortlist__link`}`} href="/notiser">
            Årets første merkeforhandler-konkurs
          </a>
        </div>
        <div className={`${_`shortlist__item`}`}>
          <a className={`${_`shortlist__link`}`} href="/notiser">
            Svak nedgang i antall lærlinger i bilfagene
          </a>
        </div>
      </div>
    )
  }
}
