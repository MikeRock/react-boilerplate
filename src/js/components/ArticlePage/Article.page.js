import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import Footer from './../Footer/Footer'
import ArticleCard from './../ArticleCard/ArticleCard'
import Article from './../Article/Article'
import ShortNews from './../ShortNews/ShortNews'
import ShortList from './../ShortList/ShortList'
import { FaUser } from 'react-icons/fa'
import { MdMenu } from 'react-icons/md'
import Helmet from 'react-helmet'
import { withLogin } from './../LoginProvider/LoginProvider'
import { Query } from 'react-apollo'
import GET_ARTICLE from 'assets:queries/queries/getArticle.gql'
import styles from './styles.scss'
const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

@withLogin
class ArticlePage extends Component {
  state = { menu: false, profile: false }
  toggleMenu = () => {
    this.setState(prevState => ({ menu: !prevState.menu }))
  }
  toggleProfile = () => {
    this.setState(prevState => ({ profile: !prevState.profile }))
  }
  login = () => {
    // TODO: Login logic
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
          <html className="html" />
          <body className="body" />
        </Helmet>
        <div className={`flex flex-row flex-wrap page`}>
          <div className={`flex-auto flex w-full justify-start ${_`header page__header`}`}>
            <div className={`flex-auto ${_`header__logo`}`} />
            <input type="text" className={`flex-auto ml-auto ${_`header__search`}`} />
            <div onClick={this.toggleProfile} className={`${_`header__profile-btn`}`}>
              <a>
                <FaUser /> PROFIL
              </a>
            </div>
            <div onClick={this.toggleMenu} className={`${_`header__menu-btn`}`}>
              <MdMenu /> MENY
            </div>
          </div>
          <div className={`flex-auto w-full ${_`page__main`}`}>
            <div className={`flex flex-row flex-wrap ${_`main`}`}>
              {this.state.menu && !this.state.profile && (
                <div className={`flex flex-auto flex-row flex-wrap justify-start min-w-full  ${_`menu`}`}>
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
                </div>
              )}
              {this.state.profile && !this.state.menu && (
                <div className={`flex flex-auto flex-row flex-wrap justify-start min-w-full ${_`profile`}`}>
                  <div className={`min-w-full ${_`profile__title`}`}>Logget inn som yolo123@test.com</div>
                  <button className={`${_`profile__btn`}`}>Logg ut</button>
                </div>
              )}
              <div className={`flex-auto max-w-70 ${_`main__page-image`}`}>
                <ArticleCard
                  top
                  link="asdasd"
                  className={`flex-auto`}
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
              </div>
              <div className={`flex-auto max-w-30 ${_`main__shortnews`}`}>
                <ShortNews />
              </div>
              <div className={`flex-auto flex flex-row flex-wrap justify-start max-w-70 ${_`main__articles`}`}>
                <Query query={GET_ARTICLE} variables={{ id: 456804, siteId: 99 }}>
                  {({ data: { article }, loading, error }) => {
                    return loading ? null : <Article headline={article.headline} content={article.pages[0].content} />
                  }}
                </Query>
              </div>
              <div className={`flex-auto flex flex-row flex-wrap justify-start max-w-30 ${_`main__aside`}`}>
                <ArticleCard
                  className={`flex-auto`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
                <br />
                <ArticleCard
                  className={`flex-auto`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
                <br />
                <ArticleCard
                  className={`flex-auto`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
              </div>
              <div className={`flex-auto flex flex-row flex-wrap justify-between ${_`main__articles`}`}>
                <ArticleCard
                  className={`flex-auto max-w-50`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
                <ArticleCard
                  className={`flex-auto max-w-50`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
              </div>
              <div className={`flex-auto flex flex-row flex-wrap justify-between ${_`main__articles`}`}>
                <ArticleCard
                  className={`flex-auto max-w-30`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
                <ArticleCard
                  className={`flex-auto max-w-30`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
                <ArticleCard
                  className={`flex-auto max-w-30`}
                  title="Ajour pr 7. mars: Bilbransjens 2018-regnskap"
                  link="asdasd"
                  tag="test"
                  image={`https://img.gfx.no/2403/2403409/kalkulator_2.613x345c.jpg`}
                />
              </div>
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

export default ArticlePage
