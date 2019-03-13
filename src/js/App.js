/* global __STATIC__ */
import React, { Component } from 'react'
import FrontPage from './components/FrontPage/Front.page'
import ArticlePage from './components/ArticlePage/Article.page'
import GenericPage from './components/GenericPage/Generic.page'
import LoginProvider from './components/LoginProvider/LoginProvider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import './../scss/index.scss'
class App extends Component {
  render() {
    return (
      <LoginProvider>
        <Router>
          <Switch>
            <Route exact path="/" render={() => <GenericPage articleId={__STATIC__.USER_AGREEMENT_PAGE} />} />
            <Route path="/artikler/:article/:id" component={ArticlePage} />
            <Route component={FrontPage} />
          </Switch>
        </Router>
      </LoginProvider>
    )
  }
}

export default App
