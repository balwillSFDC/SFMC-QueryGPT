import {connect} from 'react-redux'
import React from 'react'
import {Textarea} from '@salesforce/design-system-react'
import './OutputFields.css'
import { retrieveResult } from '../../actions'


const mapStateToProps = state => {
	return {
    queryGPTJobId: state.queryGPTJobId,
    queryGPTJobState: state.queryGPTJobState,
    queryGPTJobResult: state.queryGPTJobResult
	}
}

const mapDispatchToProps = {
  retrieveResult
}

class OutputFields extends React.Component {
	constructor() {
    super()
    this.state = {
      retrieveResultInterval: null,
      retrieveResultCount: 0
    }
	}

	componentDidMount() {

	}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.queryGPTJobId !== this.props.queryGPTJobId && this.props.queryGPTJobState !== 'completed') {
      console.log("need to retrieve results ")
      let retrieveResultInterval = setInterval(() => {
        this.setState({retrieveResultCount: this.state.retrieveResultCount + 1 })
        this.props.retrieveResult(this.props.queryGPTJobId)
        
      }, 2000)
      this.setState({retrieveResultInterval})
    }

    if (prevProps.queryGPTJobState !== 'completed' && (this.props.queryGPTJobState === 'completed' || this.props.queryGPTJobState === 'failed')) {
      clearInterval(this.state.retrieveResultInterval)
      this.setState({retrieveResultCount: 0})
    }

    if(this.state.retrieveResultCount >= 30) {
      clearInterval(this.state.retrieveResultInterval)
    }
  }

	render() {
    return (
      <section>
        <Textarea
          assistiveText={{ label: 'My label' }}
          label="Query Output"
          id="queryOutput"
          readOnly
          value={this.props.queryGPTJobResult || ''} 
        />
      </section>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OutputFields)