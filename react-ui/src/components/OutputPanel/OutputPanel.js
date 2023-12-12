import {connect} from 'react-redux'
import React from 'react'
import {Card} from '@salesforce/design-system-react'
import './OutputPanel.css'
import OutputFields from '../OutputFields/OutputFields'
import CopyButton from '../CopyButton/CopyButton'
import RunButton from '../RunButton/RunButton'
const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = dispatch => {
	return {dispatch}
}

class OutputPanel extends React.Component {
	constructor() {
		super()
	}

	componentDidMount() {
	}

	render() {
		return(
			<Card
        id="outputPanel"
        heading=""
      >
        <div id="outputFieldArea">
          <OutputFields />
					<div className='slds-grid' style={{marginTop: '1em'}}>
						<div className='slds-col'>
							<CopyButton /> 
						</div>
						<div className='slds-col'>
							<RunButton /> 
						</div>
					</div>
        </div>
			</Card>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OutputPanel)