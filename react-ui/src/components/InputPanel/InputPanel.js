import {connect} from 'react-redux'
import React from 'react'
import {Card} from '@salesforce/design-system-react'
import './InputPanel.css'
import InputFields from '../InputFields/InputFields'
import SubmitButton from '../SubmitButton/SubmitButton'


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
        heading="Welcome to QueryGPT"
      >
        <div id="fieldArea">
          <InputFields /> 
					<SubmitButton /> 

        </div>
			</Card>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InputPanel)