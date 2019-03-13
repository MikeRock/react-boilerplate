/* global __STATIC__ */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Footer from '../Footer/Footer'
import Article from '../Article/Article'
import ArticleCard from '../ArticleCard/ArticleCard'
import Header from '../Header/Header'
import Placeholder from '../Placeholder/Placeholder'
import Helmet from 'react-helmet'
import { Query } from 'react-apollo'
import { withLogin, LoginProviderPropTypes } from './../LoginProvider/LoginProvider'
import { Transition, animated, config } from 'react-spring/renderprops'
// INFO: Import queries
import GET_ARTICLE from 'assets:queries/queries/getArticle.gql'
import GET_ARTICLES from 'assets:queries/queries/getArticles.gql'
// INFO: Import styles
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

@withLogin
export default class GenericPage extends Component {
  static propTypes = {
    ...LoginProviderPropTypes,
    articleId: PropTypes.any.isRequired
  }
  state = { menu: false, profile: false }
  toggleMenu = () => {
    this.setState(prevState => ({ menu: !prevState.menu, profile: !prevState.menu ? false : prevState.profile }))
  }
  toggleProfile = () => {
    this.setState(prevState => ({ profile: !prevState.profile, menu: !prevState.profile ? false : prevState.menu }))
  }
  onProfileClick = () => {
    // INFO: Basic login flow
    const { isAuthenticated, login, logout } = this.props
    isAuthenticated ? logout() : login()
  }
  render() {
    return (
      <Fragment>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Bitter:400,700|Merriweather:400,700|Montserrat:400,700,800|Raleway:400,700?1552026736"
          />
          {/* //TODO: Get rid of the local definition of html/body */}
          <title>Bilbransje24.no</title>
          <html className="html" />
          <body className="body" />
        </Helmet>
        <div className={`flex flex-row flex-wrap page`}>
          <Header className={`${_`page__header`}`} toggleMenu={this.toggleMenu} toggleProfile={this.toggleProfile} />
          <div className={`flex-auto w-full ${_`page__main`}`}>
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
                        <div onClick={this.onProfileClick} className={`${_`profile__btn`}`}>
                          Logg ut
                        </div>
                      </animated.div>
                    ))
                  }
                </Transition>
              }
              {/*  // INFO: __STATIC__ variable holds article IDs for pages not accessible from regular article endpoint */}
              <div className={`flex-auto flex flex-row flex-wrap justify-start max-w-70 ${_`main__articles`}`}>
                <Query query={GET_ARTICLE} variables={{ id: this.props.articleId, siteId: 99 }}>
                  {({ data: { article } = { article: {} }, loading, error }) => {
                    return loading || error ? (
                      <Placeholder.ArticleContent className={`flex-auto min-w-70`} />
                    ) : (
                      <Article headline={article.headline} content={article.pages[0].content} />
                    )
                  }}
                </Query>
              </div>
              <Query query={GET_ARTICLES} variables={{ limit: 3, siteId: 99, page: 1 }}>
                {({ data: { articles } = { articles: null }, loading, error, variables }) => {
                  articles =
                    articles ||
                    Array.from({ length: variables.limit }).map((_, k) => ({ id: k, url: null, title: null }))
                  return (
                    <Fragment>
                      <div className={`flex-auto flex flex-row flex-wrap justify-start max-w-30 ${_`main__aside`}`}>
                        {articles.map(({ headline, url, id }) =>
                          loading || error ? (
                            <Placeholder.Article style={{ minHeight: 200 }} className={`flex-auto min-w-full`} />
                          ) : (
                            <ArticleCard
                              key={id}
                              className={`flex-auto min-w-full`}
                              title={headline}
                              link={url || '/'}
                              tag="test"
                              image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                            />
                          )
                        )}
                      </div>
                    </Fragment>
                  )
                }}
              </Query>
            </div>
          </div>
          <div className={`flex-auto w-full ${_`page__footer`}`}>
            <Footer />
          </div>
        </div>
      </Fragment>
    )
  }
}
