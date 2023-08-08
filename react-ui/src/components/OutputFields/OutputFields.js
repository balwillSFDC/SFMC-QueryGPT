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
    // If the job ID has changed and the job isn't completed or failed
    if (
      prevProps.queryGPTJobId !== this.props.queryGPTJobId && 
      this.props.queryGPTJobId !== 0 &&
      this.props.queryGPTJobState !== "completed" && 
      this.props.queryGPTJobState !== "failed"
    ) {
      console.log("triggering retrieve result interval...")

      let retrieveResultInterval = setInterval(() => {
        if (
          this.props.queryGPTJobState !== 'completed' &&
          this.props.queryGPTJobState !== 'failed' && 
          this.state.retrieveResultCount < 30
        ) {
          this.setState({retrieveResultCount: this.state.retrieveResultCount + 1 });
          console.log("call retrieveResult()")
          this.props.retrieveResult(this.props.queryGPTJobId);
        } else {
          clearInterval(this.state.retrieveResultInterval)
        }
      }, 2000);
      

      this.setState({retrieveResultInterval});
    }
  }

	render() {
    return (
      <section>
        <Textarea
          assistiveText={{ label: 'My label' }}
          label="Query Output"
          id="queryOutput"
          readOnly={true}
          value={this.props.queryGPTJobState !== "failed"  ? this.props.queryGPTJobResult : '' } 
        />
      </section>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OutputFields)