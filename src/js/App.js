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
            <Route exact path="/" component={FrontPage} />
            <Route path="/article/:id" render={props => <ArticlePage {...props} />} />
            <Route component={FrontPage} />
          </Switch>
        </Router>
      </LoginProvider>
    )
  }
}

export default App
