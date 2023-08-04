import logo from '../../logo.svg';
import './App.css';
import { connect } from 'react-redux'
import React from 'react'
import store from '../../store'
// import { fetchAccessToken, fetchAuthCode } from '../../actions'
import { Button, BrandBand, Card } from '@salesforce/design-system-react';
import InputPanel from '../InputPanel/InputPanel';
import ResultPanel from '../ResultPanel/ResultPanel';

const mapStateToProps = state => {
  return {
    authCode: state.authCode,
    authCodeLogin: state.authCodeLogin,
    retrievingAuthCode: state.retrievingAuthCode,
    authCodeRetrieved: state.authCodeRetrieved,
    accessToken: state.accessToken,
    retrievingAccessToken: state.retrievingAccessToken,
    accessTokenRetrieved: state.accessTokenRetrieved,
    refreshToken: state.refreshToken,
    tokenExpirationSeconds: state.tokenExpirationSeconds,
  }
}

const mapDispatchToProps = dispatch => {
  return { dispatch }
}

class App extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    // Uncomment the code below if you want to enable the SFMC Authorization Code => Access Token flow for Web Apps
    
    // if (window.location.href.includes('?code=') && !this.props.accessToken) {
    //   this.props.dispatch(fetchAccessToken())
    // } else if (this.props.authCodeLogin && !this.props.accessTokenRetrieved) {
    //   window.location.assign(this.props.authCodeLogin)
    // } else if (!this.props.authCodeLogin && !this.props.authCode) {
    //   this.props.dispatch(fetchAuthCode())
    // }
  }

  render() {
    return (
      <BrandBand
        className="brand-band"
        id="brand-band-large"
        size="large"
      >
        <InputPanel /> 
        <ResultPanel /> 
      </BrandBand>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
