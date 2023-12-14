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
		this.state = {
			disabled: true,
			generatingQuery: false
		}
	}

	componentDidMount() {
		if (this.props.sourceDataExtensionName !== "" && this.props.queryDescription !== "") {
			this.setState({ disabled: false })
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Check if either value is null or an empty string
		let isDisabled = !this.props.sourceDataExtensionName || !this.props.queryDescription;
	
		// Update the disabled state if it has changed
		if (isDisabled !== this.state.disabled && this.state.generatingQuery !== true) {
			this.setState({ disabled: isDisabled });
		}

		// if queryGPTJobState has changed and it's now active, disable the button
		if (prevProps.queryGPTJobState !== this.props.queryGPTJobState && this.props.queryGPTJobState === 'active') {
			this.setState({ disabled: true, generatingQuery: true})
		}

		// if queryGPTJobState was active and now it's not, do not disable button
		if (prevProps.queryGPTJobState === 'active' && this.props.queryGPTJobState !== 'active') {
			this.setState({ disabled: false, generatingQuery: false})
		}

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
			disabled={this.state.disabled}
        >
          {this.state.disabled && this.state.generatingQuery ? 'Running...' : 'Generate Query'}
        </Button>
      </div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitButton)