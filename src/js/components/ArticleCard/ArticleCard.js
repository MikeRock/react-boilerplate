import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { NavLink } from 'react-router-dom'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class ArticleCard extends Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
    top: PropTypes.bool,
    image: PropTypes.string,
    link: PropTypes.string
  }
  render() {
    const { tag, title, image, className, top, link } = this.props
    return (
      <div className={`${className} ${_`card`}`}>
        <div data-image={image} className="card__image">
          {tag && <div className={`${_`card__tag`}`}>{tag}</div>}
        </div>
        <div className={`${_`card__headline`} ${top && _`card__headline--top`}`}>
          <NavLink className={`${_`card__link`}`} to={link}>
            {title}
          </NavLink>
        </div>
      </div>
    )
  }
}
