import {connect} from 'react-redux'
import React from 'react'
import {Textarea} from '@salesforce/design-system-react'
import './OutputFields.css'


const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = dispatch => {
	return {dispatch}
}

class OutputFields extends React.Component {
	constructor() {
    super()
	}

	componentDidMount() {

	}

	render() {
    return (
      <section>
        <Textarea
          assistiveText={{ label: 'My label' }}
          label="Query Output"
          id="queryOutput"
          disabled
        />
      </section>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OutputFields)