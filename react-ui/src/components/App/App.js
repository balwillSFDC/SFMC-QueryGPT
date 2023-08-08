import './App.css';
import { connect } from 'react-redux'
import React from 'react'
import store from '../../store'
// import { fetchAccessToken, fetchAuthCode } from '../../actions'
import { Button, BrandBand, Card } from '@salesforce/design-system-react';
import InputPanel from '../InputPanel/InputPanel';
import OutputPanel from '../OutputPanel/OutputPanel';
import SubmitButton from '../SubmitButton/SubmitButton';
import { resetState } from '../../actions';

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = {
  resetState
}

class App extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.props.resetState()
  }

  render() {
    return (
      <BrandBand
        className="brand-band"
        id="brand-band-large"
        size="large"
      >
        <InputPanel /> 
        <OutputPanel /> 
      </BrandBand>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
