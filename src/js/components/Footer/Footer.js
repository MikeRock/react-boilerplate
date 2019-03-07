import React, { Component } from 'react'
import classnames from 'classnames/bind'
import styles from './styles.scss'

const _ = arg => classnames.bind(styles)(String.raw`${arg}`.split(' '))

export default class Footer extends Component {
  render() {
    return (
      <div styleName="footer">
        <div styleName="footer__item">
          <div styleName="footer__logo" />
          <p styleName="footer__paragraph">
            Bilbransje24 drives av Bilbransje Media AS <br />
            Organisasjonsnummer: 921 399 731
          </p>
          <p styleName="footer__paragraph">
            <a href="/personvern">Personvern/cookies</a>
          </p>
          <p styleName="footer__paragraph">
            All journalistikk er basert på{' '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://presse.no/pfu/etiske-regler/vaer-varsom-plakaten/"
            >
              Vær
              <br /> varsom-plakaten
            </a>{' '}
            og{' '}
            <a rel="noopener noreferrer" target="_blank" href="https://presse.no/pfu/etiske-regler/redaktorplakaten/">
              Redaktørplakaten
            </a>
          </p>
        </div>
        <div styleName="footer__item">
          <p styleName="footer__paragraph">
            Redaktør: <br />
            <a href="/forfattere/273443">Trygve Larsen</a> | +47 41 26 73 10
          </p>
          <p styleName="footer__paragraph">
            Journalist: <br />
            <a href="/forfattere/273444">Odd Erik Skavold Lystad</a> | +47 99 56 10 58
          </p>
          <p styleName="footer__paragraph">
            Daglig leder: <br />
            <a href="/forfattere/273442">Per Morten Merg</a> | +47 91 16 57 44
          </p>
          <p styleName="footer__paragraph">
            Salgsleder: <br />
            <a href="mailto:daniel@bjorgu.no">Daniel Solomonsz</a> | +47 45 48 11 28
          </p>
        </div>
        <div styleName="footer__item">
          <p styleName="footer__paragraph">
            Kontakt oss: <br />
            <a href="mailto:redaksjon@bb24.no">redaksjon@bb24.no</a>
            <br />
            <a href="mailto:abo@bb24.no">abo@bb24.no</a>
            <br />
            <a href="mailto:annonse@bb24.no ">annonse@bb24.no </a>
          </p>
          <p styleName="footer__paragraph">
            Besøksadresse: <br />
            Sofiemyrveien 6D
            <br />
            1312 Sofiemyr
          </p>
          <p styleName="footer__paragraph">
            Telefon: <br />
            66 82 21 21
            <br />
          </p>
        </div>
      </div>
    )
  }
}
