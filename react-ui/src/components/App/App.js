import './App.css';
import { connect } from 'react-redux'
import React from 'react'
import store from '../../store'
// import { fetchAccessToken, fetchAuthCode } from '../../actions'
import { Button, BrandBand, Card } from '@salesforce/design-system-react';
import InputPanel from '../InputPanel/InputPanel';
import OutputPanel from '../OutputPanel/OutputPanel';
import { resetState, getAuthUrl, getAuthCode, getServerAppFlag, getSfdcAccessToken} from '../../actions';
import PreviewPanel from '../PreviewPanel/PreviewPanel';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const mapStateToProps = state => {
  return {
    authCode: state.authCode,
    authUrl: state.authUrl
  }
}

const mapDispatchToProps = {
  resetState,
  getAuthUrl,
  getAuthCode,
  getServerAppFlag,
}

class App extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    console.log('App component mounted')
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const authCode = searchParams.get('code');
   
    this.props.resetState()
    this.props.getServerAppFlag()
    // if (!authCode && !this.props.authCode) {
    //   this.props.getAuthUrl()
    //   window.location.href = this.props.authUrl
    // }

    // if (authCode && !this.props.authCode) {
    //   this.props.getAuthCode(authCode)
    // }


  }

  componentDidUpdate(prevProps, prevState) {
    console.log('App component updated')
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const authCode = searchParams.get('code');
    

    // Get auth Url if we do not have it 
    // console.log(!this.props.authUrl)
    // if (!this.props.authUrl) {
    //   this.props.getAuthUrl()
    // }

    // Once we have auth url, redirect user to login
    // if (prevProps.authUrl == '' && this.props.authUrl) {
    //   window.location.href = this.props.authUrl
    // }

    // get auth code after user login
    if (this.props.authCode == '' && authCode) {
      this.props.getAuthCode(authCode)
    } 

  }

  render() {
    return (
      <BrandBand
        className="brand-band"
        id="brand-band-large"
        size="large"
      > 
        <div className="slds-grid slds-grid_align-center slds-gutters slds-wrap " id='containerGrid'>
          <div className='slds-col slds-size_6-of-12'> 
            <InputPanel /> 
          </div>
          <div className='slds-col slds-size_6-of-12'> 
            <OutputPanel />
          </div>
          <div className='slds-col slds-size_12-of-12' id="row-2">
            <PreviewPanel /> 
          </div>
        </div>
      </BrandBand>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
