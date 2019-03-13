import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'
import { FaUser } from 'react-icons/fa'
import { MdMenu } from 'react-icons/md'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
    toggleMenu: PropTypes.func,
    toggleProfile: PropTypes.func
  }
  render() {
    const { className, toggleMenu, toggleProfile } = this.props
    return (
      <div className={`flex-auto flex w-full justify-start ${_`header`} ${className || ''}`}>
        <div className={`flex-auto ${_`header__logo`}`} />
        <input type="text" className={`flex-auto ml-auto ${_`header__search`}`} />
        <div onClick={toggleProfile} className={`${_`header__profile-btn`}`}>
          <a>
            <FaUser className={`${_`header__icon`}`} /> PROFIL
          </a>
        </div>
        <div onClick={toggleMenu} className={`${_`header__menu-btn`}`}>
          <MdMenu className={`${_`header__icon`}`} /> MENY
        </div>
      </div>
    )
  }
}
