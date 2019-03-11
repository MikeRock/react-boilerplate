import React, { Component } from 'react'
import classnames from 'classnames/bind'
import { FaUser } from 'react-icons/fa'
import { MdMenu } from 'react-icons/md'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class Footer extends Component {
  render() {
    const { className } = this.props
    return (
      <div className={`flex-auto flex w-full justify-start ${_`header`} ${className || ''}`}>
        <div className={`flex-auto ${_`header__logo`}`} />
        <input type="text" className={`flex-auto ml-auto ${_`header__search`}`} />
        <div onClick={this.props.toggleProfile} className={`${_`header__profile-btn`}`}>
          <a>
            <FaUser /> PROFIL
          </a>
        </div>
        <div onClick={this.props.toggleMenu} className={`${_`header__menu-btn`}`}>
          <MdMenu /> MENY
        </div>
      </div>
    )
  }
}
