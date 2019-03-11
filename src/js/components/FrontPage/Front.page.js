import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Footer from './../Footer/Footer'
import Article from './../ArticleCard/ArticleCard'
import ShortNews from './../ShortNews/ShortNews'
import ShortList from './../ShortList/ShortList'
import Helmet from 'react-helmet'
import { Query } from 'react-apollo'
import GET_ARTICLES from 'assets:queries/queries/getArticles.gql'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))
export default class FrontPage extends Component {
  state = {}

  render() {
    return (
      <Fragment>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Bitter:400,700|Merriweather:400,700|Montserrat:400,700,800|Raleway:400,700?1552026736"
          />
          {/* //TODO: Get rid of the local definition of html/body */}
          <html className="html" />
          <body className="body" />
        </Helmet>
        <div className={`flex flex-row flex-wrap page`}>
          <div className={`flex-auto flex w-full justify-start ${_`header page__header`}`}>
            <div className={`flex-auto ${_`header__logo`}`} />
            <input type="text" className={`flex-auto ml-auto ${_`header__search`}`} />
          </div>
          <Query query={GET_ARTICLES} variables={{ siteId: 99, page: 1, limit: 10 }}>
            {({ data, loading, error }) => (
              <div className={`flex-auto w-full ${_`page__main`}`}>
                <div className={`flex flex-row flex-wrap ${_`main`}`}>
                  {loading ? (
                    <div className={`flex-auto min-w-full`}>LOADING</div>
                  ) : (
                    <div className={`flex-auto min-w-full`}>{data.articles[0].id}</div>
                  )}
                  <div className={`flex-auto max-w-70 ${_`main__page-image`}`}>
                    <Article
                      top
                      className={`flex-auto`}
                      title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                      tag="test"
                      image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                    />
                  </div>
                  <div className={`flex-auto max-w-30 ${_`main__shortnews`}`}>
                    <ShortNews />
                  </div>
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
                  <ShortList className={`flex-auto self-start max-w-30 ${_`main__shortlist`}`} />
                  <div className={`flex-auto flex flex-row flex-wrap justify-between ${_`main__articles`}`}>
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
            )}
          </Query>
          <div className={`flex-auto w-full ${_`page__footer`}`}>
            <Footer />
          </div>
        </div>
      </Fragment>
    )
  }
}
