import {connect} from 'react-redux'
import React from 'react'
import {Card} from '@salesforce/design-system-react'
import './InputPanel.css'


const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = dispatch => {
	return {dispatch}
}

class InputPanel extends React.Component {
	constructor() {
			super()
	}

	componentDidMount() {

	}

	render() {
		return(
			<Card
				id="inputPanel"
			>

			</Card>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InputPanel)