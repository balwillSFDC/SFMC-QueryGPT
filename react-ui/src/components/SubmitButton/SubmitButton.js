import {connect} from 'react-redux'
import React from 'react'
import {Button, Card} from '@salesforce/design-system-react'
import './SubmitButton.css'


const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = dispatch => {
	return {dispatch}
}

class SubmitButton extends React.Component {
	constructor() {
			super()
	}

	componentDidMount() {

	}

	render() {
		return(
      <div id="div_submitButton">
        <Button
          id="submitButton"
          variant="brand"
        >
          Generate Query
        </Button>
      </div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitButton)