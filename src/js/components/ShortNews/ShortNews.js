import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class ShortNews extends Component {
  state = {}

  render() {
    const { className, headline, content } = this.props
    return (
      <div className={`${className || ''} ${_`shortnews`}`}>
        <div className={`${_`shortnews__body`}`}>
          <div className={`${_`shortnews__header`}`}>
            Flere <br /> Nyheter
          </div>
          <div className={`${_`shortnews__item`}`}>
            <div className={`${_`shortnews__headline`}`}>{headline || '03 March'}</div>
            <div className={`${_`shortnews__paragraph`}`}>{content || 'lorem ipsum hipster dolot'}</div>
          </div>
          <div className={`${_`shortnews__item`}`}>
            <div className={`${_`shortnews__headline`}`}>{headline || '03 March'}</div>
            <div className={`${_`shortnews__paragraph`}`}>{content || 'lorem ipsum hipster dolot'}</div>
          </div>
          <div className={`${_`shortnews__item`}`}>
            <div className={`${_`shortnews__headline`}`}>{headline || '03 March'}</div>
            <div className={`${_`shortnews__paragraph`}`}>{content || 'lorem ipsum hipster dolot'}</div>
          </div>
          <div className={`${_`shortnews__item`}`}>
            <div className={`${_`shortnews__headline`}`}>{headline || '03 March'}</div>
            <div className={`${_`shortnews__paragraph`}`}>{content || 'lorem ipsum hipster dolot'}</div>
          </div>
        </div>
      </div>
    )
  }
}
