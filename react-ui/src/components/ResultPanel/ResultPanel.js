import {connect} from 'react-redux'
import React from 'react'
import {Card} from '@salesforce/design-system-react'
import './ResultPanel.css'


const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = dispatch => {
	return {dispatch}
}

class ResultPanel extends React.Component {
	constructor() {
			super()
	}

	componentDidMount() {

	}

	render() {
		return(
			<Card
				id="resultPanel"
			>

			</Card>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultPanel)