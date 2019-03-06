import React, { Component } from 'react'
import FrontPage from './components/FrontPage/Front.page'
import './../scss/index.scss'

class App extends Component {
  render() {
    return <FrontPage />
  }
}

export const Counter = ({ counter }) => <p>{counter}</p>

export default App
