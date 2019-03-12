import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import purify from 'dompurify'
import { withLogin, LoginProviderPropTypes } from './../LoginProvider/LoginProvider'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

@withLogin
class Article extends Component {
  static propTypes = {
    ...LoginProviderPropTypes,
    content: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    sanitize: PropTypes.any,
    className: PropTypes.string
  }
  static defaultProps = {
    sanitize: true
  }
  render() {
    const { isAuthenticated, headline, content, className, sanitize = true } = this.props
    return (
      <article className={`${_`article`} ${className || ''}`}>
        <h1 className={`${_`article__headline`}`}>{headline}</h1>
        <h2 className={`${_`article__subheadline`}`}>
          Her ser du hvor store konsekvenser elektrifiseringen av bilparken vil påvirke inntjeningen hos verkstedene.
        </h2>
        <div className={`${_`article__info`}`}>
          AV: TRYGVE LARSEN &nbsp; &nbsp; PER MORTEN MERG &nbsp; | &nbsp; PUBLISHERT: 6. MAR 2019 - 16:03
        </div>
        <div className={`${_`article__body`}`}>
          {isAuthenticated ? (
            <div dangerouslySetInnerHTML={{ __html: sanitize ? purify.sanitize(content) : content }} />
          ) : null}
        </div>
      </article>
    )
  }
}

export default Article
