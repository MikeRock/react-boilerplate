import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Footer from './../Footer/Footer'
import Article from './../ArticleCard/ArticleCard'
import styles from './styles.scss'
const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))
export default class FrontPage extends Component {
  state = {}

  render() {
    return (
      <div className={`flex flex-row flex-wrap page bg-grey-lighter`}>
        <div className={`flex-auto flex w-full justify-start ${_`header page__header`} bg-grey`}>
          <div className={`flex-auto ${_`header__logo`}`} />
          <input type="text" className={`flex-auto ml-auto ${_`header__search`}`} />
        </div>
        <div className={`flex-auto w-full ${_`page__main`}`}>
          <div className={`flex flex-row flex-wrap ${_`main`}`}>
            <div className={`flex-auto max-w-70 ${_`main__page-image`}`}>
              <Article
                top
                className={`flex-auto`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
            </div>
            <div className={`flex-auto max-w-30  bg-grey ${_`main__shortnews`}`} />
            <div className={`flex-auto flex flex-row flex-wrap justify-start max-w-70 ${_`main__articles`}`}>
              <Article
                className={`flex-auto max-w-50`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
              <Article
                className={`flex-auto max-w-50`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
            </div>
            <div className={`flex-auto flex flex-row flex-wrap justify-around ${_`main__articles`}`}>
              <Article
                className={`flex-auto max-w-30`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
              <Article
                className={`flex-auto max-w-30`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
              <Article
                className={`flex-auto max-w-30`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
            </div>
            <div className={`flex-auto flex flex-row flex-wrap justify-around ${_`main__articles`}`}>
              <Article
                className={`flex-auto max-w-50`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
              <Article
                className={`flex-auto max-w-50`}
                title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                tag="test"
                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
              />
            </div>
          </div>
        </div>
        <div className={`flex-auto w-full ${_`page__footer`} bg-grey`}>
          <Footer />
        </div>
      </div>
    )
  }
}
