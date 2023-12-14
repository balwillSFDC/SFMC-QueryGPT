import {connect} from 'react-redux'
import React from 'react'
import './PreviewPanel.css'
import Table from 'react-bootstrap/Table';
import {Card} from '@salesforce/design-system-react'
import { retrieveRunQueryResult } from '../../actions'
import PreviewResults from '../PreviewResults/PreviewResults';

const mapStateToProps = state => {
	return {
		runQueryJobId: state.runQueryJobId,
		runQueryJobState: state.runQueryJobState,
		runQueryJobResult: state.runQueryJobResult
	}
}

const mapDispatchToProps = {
	retrieveRunQueryResult
}

class PreviewPanel extends React.Component {
	constructor() {
		super()
		this.state = {
			display: 'none',
			retrieveResultCount: 0,
			retrieveResultInterval: '',
		}
	}

	componentDidMount() {
		if (this.props.runQueryJobState != '') {
			this.setState({display:'block'})
		}

		if (this.props.runQueryJobState == '') {
			this.setState({display: 'none'})
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.runQueryJobState == "" && this.props.runQueryJobState != '') {
			this.setState({display: 'block'})
		}

		if (prevProps.runQueryJobState !== '' && this.props.runQueryJobState === '') {
			this.setState({display: 'none'})
		}

		// If the job ID has changed and the job isn't completed or failed
    if (
      prevProps.runQueryJobId !== this.props.runQueryJobId && 
      this.props.runQueryJobId !== 0 &&
      this.props.runQueryJobState !== "completed" && 
      this.props.runQueryJobState !== "failed"
    ) {
      console.log("triggering retrieve run query result interval...")

      let retrieveResultInterval = setInterval(() => {
        if (
          this.props.runQueryJobState !== 'completed' &&
          this.props.runQueryJobState !== 'failed' && 
          this.state.retrieveResultCount < 150
        ) {
          this.setState({retrieveResultCount: this.state.retrieveResultCount + 1 });
          console.log("call retrieveRunQueryResult()")
          this.props.retrieveRunQueryResult(this.props.runQueryJobId)
        } else {
          clearInterval(this.state.retrieveResultInterval)
        }
      }, 2000);
      

      this.setState({retrieveResultInterval});
    }


	}

	render() {
		return(
			<Card
				id="previewPanel"
				heading={`${this.props.runQueryJobResult?.length} items`}
				style={{display: this.state.display}}
		  >
				<PreviewResults />  
			</Card>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewPanel)