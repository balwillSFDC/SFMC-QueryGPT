import {connect} from 'react-redux'
import React from 'react'
import {Button} from '@salesforce/design-system-react'
import './CopyButton.css'
import {  } from '../../actions'
import clipbaord from 'clipboard'


const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = {
	
}

class CopyButton extends React.Component {
	constructor() {
		super()
	}

	componentDidMount() {
		new clipbaord('#copyButton')

	}

	componentDidUpdate(prevProps, prevState) {

	}


	render() {
		return(
      <div id="div_copyButton">
        <Button
          id="copyButton"
          variant="brand"
					data-clipboard-target="#queryOutput"
					data-clipboard-action="copy"
		  		// onClick={}
        >
          Copy Query
        </Button>
      </div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyButton)