import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class ArticlePage extends Component {
  state = {}

  render() {
    return (
      <article className={`${_`article`}`}>
        <h1 className={`${_`article__headline`}`}>Elbiler: Dramatisk for sysselsetting og inntjening</h1>
        <h2 className={`${_`article__subheadline`}`}>
          Her ser du hvor store konsekvenser elektrifiseringen av bilparken vil påvirke inntjeningen hos verkstedene.
        </h2>
        <div className={`${_`article__info`}`}>
          AV: TRYGVE LARSEN &nbsp; &nbsp; PER MORTEN MERG &nbsp; | &nbsp; PUBLISHERT: 6. MAR 2019 - 16:03
        </div>
        <div className={`${_`article__body`}`}>
          <p className={`${_`article__paragraph`}`}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione velit optio dolore vitae atque pariatur
            minus ipsum, quae culpa nobis officia omnis. Illum veritatis velit dolores, fugiat sed veniam eligendi!
          </p>
          <p className={`${_`article__paragraph`}`}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam fuga unde illum dicta quam soluta
            eveniet, hic quos architecto, delectus officia quis voluptatibus libero odit quo sequi quod consectetur
            ipsum.
          </p>
          <p className={`${_`article__paragraph`}`}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam fuga unde illum dicta quam soluta
            eveniet, hic quos architecto, delectus officia quis voluptatibus libero odit quo sequi quod consectetur
            ipsum.
          </p>
          <p className={`${_`article__paragraph`}`}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam fuga unde illum dicta quam soluta
            eveniet, hic quos architecto, delectus officia quis voluptatibus libero odit quo sequi quod consectetur
            ipsum.
          </p>
        </div>
      </article>
    )
  }
}
