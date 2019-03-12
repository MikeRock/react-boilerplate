import React, { Component } from 'react'
import FrontPage from './components/FrontPage/Front.page'
import ArticlePage from './components/ArticlePage/Article.page'
import './../scss/index.scss'
import LoginProvider from './components/LoginProvider/LoginProvider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <LoginProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={ArticlePage} />
            <Route path="/artikler/:article/:id" component={ArticlePage} />
            <Route component={FrontPage} />
          </Switch>
        </Router>
      </LoginProvider>
    )
  }
}

export default App
