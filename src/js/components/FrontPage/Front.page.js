import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Footer from './../Footer/Footer'
import Header from './../Header/Header'
import Article from './../ArticleCard/ArticleCard'
import Placeholder from './../Placeholder/Placeholder'
import ShortNews from './../ShortNews/ShortNews'
import ShortList from './../ShortList/ShortList'
import { Transition, animated, config } from 'react-spring/renderprops'
import Helmet from 'react-helmet'
import { Query } from 'react-apollo'
import { withLogin, LoginProviderPropTypes } from './../LoginProvider/LoginProvider'
// INFO: Import queries
import GET_ARTICLES from 'assets:queries/queries/getArticles.gql'
// INFO: Import styles
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))
@withLogin
export default class FrontPage extends Component {
  static propTypes = {
    ...LoginProviderPropTypes
  }
  state = { menu: false, profile: false }
  toggleMenu = () => {
    this.setState(prevState => ({ menu: !prevState.menu, profile: !prevState.menu ? false : prevState.profile }))
  }
  toggleProfile = () => {
    this.setState(prevState => ({ profile: !prevState.profile, menu: !prevState.profile ? false : prevState.menu }))
  }
  render() {
    const { login, logout, isAuthenticated } = this.props
    return (
      <Fragment>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Bitter:400,700|Merriweather:400,700|Montserrat:400,700,800|Raleway:400,700?1552026736"
          />
          {/* //TODO: Get rid of the local definition of html/body */}
          <html className="html" />
          <title>Bilbransje24.no</title>
          <body className="body" />
        </Helmet>
        <div className={`flex flex-row flex-wrap page`}>
          <Header toggleProfile={this.toggleProfile} toggleMenu={this.toggleMenu} />
          <Query
            query={GET_ARTICLES}
            variables={{ siteId: 99, page: 1, limit: 10 }}
            context={{ login, logout, isAuthenticated }}
          >
            {({ data: { articles } = { articles: null }, loading, error, variables }) => {
              articles =
                articles ||
                Array.from({ length: variables.limit }).map((_, k) => ({ id: k, headline: null, url: null }))
              return (
                <div className={`flex-auto w-full ${_`page__main`}`}>
                  {
                    <div className={`flex flex-row flex-wrap ${_`main`}`}>
                      {
                        <Transition
                          native
                          items={this.state.menu}
                          config={name => (name === 'opacity' ? { delay: 200 } : config.default)}
                          from={{ opacity: 0, height: 0 }}
                          enter={{ opacity: 1, height: 'auto' }}
                          leave={{ opacity: 0, height: 0 }}
                        >
                          {show =>
                            show &&
                            (style => (
                              <animated.div
                                style={Object.assign({}, style)}
                                className={`flex flex-auto flex-row flex-wrap justify-start min-w-full  ${_`menu`}`}
                              >
                                <div className={`flex flex-row flex-wrap ${_`menu__row`}`}>
                                  <ul>
                                    <li className={`${_`menu__item`}`}>Servicemarked</li>
                                    <li className={`${_`menu__item`}`}>Merkeforhandler</li>
                                    <li className={`${_`menu__item`}`}>Bruktbil</li>
                                    <li className={`${_`menu__item`}`}>Bilsalg</li>
                                  </ul>
                                </div>
                                <div className={`flex flex-row flex-wrap ${_`menu__row`}`}>
                                  <ul>
                                    <li className={`${_`menu__item`}`}>Finansiering og forsikring</li>
                                    <li className={`${_`menu__item`}`}>Debatt og kommentar</li>
                                    <li className={`${_`menu__item`}`}>Jobb</li>
                                    <li className={`${_`menu__item`}`}>BB24 Stillingsmarked</li>
                                  </ul>
                                </div>
                                <div className={`flex flex-row flex-wrap ${_`menu__row`}`}>
                                  <ul>
                                    <li className={`${_`menu__item`}`}>Abonnement</li>
                                    <li className={`${_`menu__item`}`}>Annonseinfo</li>
                                    <li className={`${_`menu__item`}`}>Kontakt oss</li>
                                    <li className={`${_`menu__item`}`}>Om Bilbransje24</li>
                                  </ul>
                                </div>
                              </animated.div>
                            ))
                          }
                        </Transition>
                      }
                      {
                        <Transition
                          native
                          items={this.state.profile}
                          config={name => (name === 'opacity' ? { delay: 200 } : config.default)}
                          from={{ opacity: 0, height: 0 }}
                          enter={{ opacity: 1, height: 'auto' }}
                          leave={{ opacity: 0, height: 0 }}
                        >
                          {show =>
                            show &&
                            (style => (
                              <animated.div
                                style={Object.assign({}, style)}
                                className={`flex flex-auto flex-row flex-wrap justify-start min-w-full ${_`profile`}`}
                              >
                                <div className={`min-w-full ${_`profile__title`}`}>Logget inn som yolo123@test.com</div>
                                <div className={`${_`profile__btn`}`}>Logg ut</div>
                              </animated.div>
                            ))
                          }
                        </Transition>
                      }
                      <div className={`flex-auto max-w-70 ${_`main__page-image`}`}>
                        {loading || error ? (
                          <Placeholder.Image className={`flex-auto`} />
                        ) : (
                          <Article
                            top
                            link={articles[0].url}
                            className={`flex-auto`}
                            title={articles[0].headline}
                            tag="test"
                            image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                          />
                        )}
                      </div>
                      <div className={`flex-auto max-w-30 ${_`main__shortnews`}`}>
                        <ShortNews />
                      </div>
                      <div className={`flex-auto flex flex-row flex-wrap justify-start max-w-70 ${_`main__articles`}`}>
                        {articles
                          .filter((_, key) => key !== 0 && key < 3)
                          .map(({ id, headline, url }) =>
                            loading || error ? (
                              <Placeholder.Article key={id} className={`flex-auto max-w-50 pr-2`} />
                            ) : (
                              <Article
                                key={id}
                                className={`flex-auto max-w-50 pr-2`}
                                link={url}
                                title={headline}
                                tag="test"
                                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                              />
                            )
                          )}
                      </div>
                      <ShortList className={`flex-auto self-start max-w-30 ${_`main__shortlist`}`} />
                      <div className={`flex-auto flex flex-row flex-wrap justify-between ${_`main__articles`}`}>
                        {articles
                          .filter((_, key) => key > 2 && key < 6)
                          .map(({ id, headline, url }) =>
                            loading || error ? (
                              <Placeholder.Article
                                key={id}
                                style={{ minHeight: 200 }}
                                className={`flex-auto max-w-30 pr-1`}
                              />
                            ) : (
                              <Article
                                key={id}
                                className={`flex-auto max-w-30 pr-1`}
                                link={url}
                                title={headline}
                                tag="test"
                                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                              />
                            )
                          )}
                      </div>
                      <div className={`flex-auto flex flex-row flex-wrap justify-around ${_`main__articles`}`}>
                        {articles
                          .filter((_, key) => key > 5 && key < 8)
                          .map(({ id, headline, url }) =>
                            loading || error ? (
                              <Placeholder.Article
                                key={id}
                                style={{ minHeight: 320 }}
                                className={`flex-auto max-w-50 pr-1`}
                              />
                            ) : (
                              <Article
                                key={id}
                                className={`flex-auto max-w-50 pr-1`}
                                link={url}
                                title={headline}
                                tag="test"
                                image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                              />
                            )
                          )}
                      </div>
                    </div>
                  }
                </div>
              )
            }}
          </Query>
          <div className={`flex-auto w-full ${_`page__footer`}`}>
            <Footer />
          </div>
        </div>
      </Fragment>
    )
  }
}
