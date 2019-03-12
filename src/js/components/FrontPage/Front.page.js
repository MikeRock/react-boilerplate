import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Footer from './../Footer/Footer'
import Article from './../ArticleCard/ArticleCard'
import Placeholder from './../Placeholder/Placeholder'
import ShortNews from './../ShortNews/ShortNews'
import ShortList from './../ShortList/ShortList'
import Helmet from 'react-helmet'
import { Query } from 'react-apollo'
import { withLogin } from './../LoginProvider/LoginProvider'
import GET_ARTICLES from 'assets:queries/queries/getArticles.gql'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))
@withLogin
class FrontPage extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.any.isRequired
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
          <div className={`flex-auto flex w-full justify-start ${_`header page__header`}`}>
            <div className={`flex-auto ${_`header__logo`}`} />
            <input type="text" className={`flex-auto ml-auto ${_`header__search`}`} />
          </div>
          <Query
            query={GET_ARTICLES}
            variables={{ siteId: 99, page: 1, limit: 10 }}
            context={{ login, logout, isAuthenticated }}
          >
            {({ data: { articles }, loading, error, variables }) => {
              articles =
                articles ||
                Array.from({ length: variables.limit }).map((_, k) => ({ id: k, headline: null, url: null }))
              return (
                <div className={`flex-auto w-full ${_`page__main`}`}>
                  {
                    <div className={`flex flex-row flex-wrap ${_`main`}`}>
                      <div className={`flex-auto max-w-70 ${_`main__page-image`}`}>
                        {loading ? (
                          <Placeholder className={`flex-auto`} />
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
                            loading ? (
                              <Placeholder key={id} className={`flex-auto max-w-50 pr-2`} />
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
                            loading ? (
                              <Placeholder key={id} className={`flex-auto max-w-30`} />
                            ) : (
                              <Article
                                key={id}
                                className={`flex-auto max-w-30`}
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
                            loading ? (
                              <Placeholder key={id} className={`flex-auto max-w-50`} />
                            ) : (
                              <Article
                                key={id}
                                className={`flex-auto max-w-50`}
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

export default FrontPage
