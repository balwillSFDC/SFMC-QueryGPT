import {connect} from 'react-redux'
import React from 'react'
import {Button} from '@salesforce/design-system-react'
import './RunButton.css'
import { addRunQueryJob } from '../../actions'


const mapStateToProps = state => {
	return {
		queryGPTJobResult: state.queryGPTJobResult,
		runQueryJobId: state.runQueryJobId,
		runQueryJobState: state.runQueryJobState,
		runQueryJobResult: state.runQueryJobResult
	}
}

const mapDispatchToProps = {
	addRunQueryJob
}

class RunButton extends React.Component {
	constructor() {
		super()
		this.state = {
			disabled: true
		}
	}

	componentDidMount() {
		if (this.props.runQueryJobState != 'active') {
			this.setState({disabled: false})
		}

		if (this.props.queryGPTJobResult) {
			this.setState({disabled: false})
		} 
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.runQueryJobState == 'active' && this.props.runQueryJobState != 'active') {
			this.setState({disabled: false})
		}

		if (prevProps.runQueryJobState != 'active' && this.props.runQueryJobState == 'active') {
			this.setState({disabled: true})
		}
	}

	handleClick = () => {
		this.props.addRunQueryJob(this.props.queryGPTJobResult)
	}

	render() {
		return(
      <div id="div_runButton">
        <Button
          id="runButton"
          variant="brand"
					onClick={this.handleClick}
					disabled={this.state.disabled}
        >
          {(this.state.disabled) ? "Running...": "Run Query"}
        </Button>
      </div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RunButton)