import {connect} from 'react-redux'
import React from 'react'
import {Button, Card} from '@salesforce/design-system-react'
import './SubmitButton.css'
import { submitQueryGPTRequest, retrieveResult } from '../../actions'


const mapStateToProps = state => {
	return {
		sourceDataExtensionName: state.sourceDataExtensionName,
		targetDataExtensionName: state.targetDataExtensionName,
		queryDescription: state.queryDescription,
		queryGPTJobId: state.queryGPTJobId,
		queryGPTJobState: state.queryGPTJobState
	}
}

const mapDispatchToProps = {
	submitQueryGPTRequest
}

class SubmitButton extends React.Component {
	constructor() {
		super()
	}

	componentDidMount() {

	}

	handleSubmit = () => {
		const { sourceDataExtensionName, targetDataExtensionName, dispatch } = this.props;
		const queryDescription = this.props.queryDescription; // assuming this comes as a prop
		
		this.props.submitQueryGPTRequest(sourceDataExtensionName, targetDataExtensionName, queryDescription);
	}
	render() {
		return(
      <div id="div_submitButton">
        <Button
          id="submitButton"
          variant="brand"
		  		onClick={this.handleSubmit}
        >
          Generate Query
        </Button>
      </div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitButton)