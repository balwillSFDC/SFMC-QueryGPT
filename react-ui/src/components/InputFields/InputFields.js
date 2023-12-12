import {connect} from 'react-redux'
import React from 'react'
import {Input, Textarea, Tooltip} from '@salesforce/design-system-react'
import './InputFields.css'
import {setInputValue} from '../../actions'

const mapStateToProps = state => {
	return {
    sourceDataExtensionName: state.sourceDataExtensionName,
    targetDataExtensionName: state.targetDataExtensionName,
    queryDescription: state.queryDescription,
    dataExtensionsNotFound: state.dataExtensionsNotFound
	}
}

const mapDispatchToProps = {
  setInputValue
}



class InputFields extends React.Component {
	constructor() {
    super()
    this.state = {
      sourceDataExtensionNameErrorMessage: "",
      targetDataExtensionNameErrorMessage: ""
    }
	}

	componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    // If dataExtensionsNotFound was not populated, but now is, update the error messages
    if (prevProps.dataExtensionsNotFound.length === 0 && this.props.dataExtensionsNotFound.length > 0) {
      this.props.dataExtensionsNotFound.forEach(dataExtension => {
        // If the value in "Source Data Extension" field includes the DE that was not found, set the error message 
        if (this.props.sourceDataExtensionName.includes(dataExtension)) {
          this.setState({sourceDataExtensionNameErrorMessage: `${this.state.sourceDataExtensionNameErrorMessage}${dataExtension} could not be found. `})
        }

        // If the value in "Target Data Extension" field includes the DE that was not found, set the error message 
        if (this.props.targetDataExtensionName.includes(dataExtension)) {
          this.setState({targetDataExtensionNameErrorMessage: `${dataExtension} could not be found `})
        }
      })
    } else if (prevProps.dataExtensionsNotFound.length > 0 && this.props.dataExtensionsNotFound.length === 0) {
      this.setState({
        sourceDataExtensionNameErrorMessage: '',
        targetDataExtensionNameErrorMessage: ''
      })
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.props.setInputValue(name, value)
  }

	render() {
    return (
      <section>
        <Input
          assistiveText={{ label: 'My label' }}
          label="Source Data Extension Name"
          id="sourceDataExtensionName"
          name="sourceDataExtensionName"
          className="inputFields"
          placeholder="Source Data Extension Name"
          required
          onChange={this.handleChange}
          value={this.props.sourceDataExtensionName}
          // fieldLevelHelpTooltip={
          //   <Tooltip
          //     id="field-level-help-tooltip"
          //     align="top right"
          //     variant="learnMore"
          //     content="Some helpful information"
          //   />
          // }
          errorText={this.state.sourceDataExtensionNameErrorMessage}
        />
        <Input
          assistiveText={{ label: 'My label' }}
          label="Target Data Extension Name"
          id="targetDataExtensionName"
          name="targetDataExtensionName"
          className="inputFields"
          placeholder="Target Data Extension Name"
          onChange={this.handleChange}
          value={this.props.targetDataExtensionName}
          errorText={this.state.targetDataExtensionNameErrorMessage}

        />
        <Textarea
          assistiveText={{ label: 'My label' }}
          label="Query Description"
          id="queryDescription"
          name="queryDescription"
          placeholder="I want a query that identifies everyone who joined in the last month..."
          required
          onChange={this.handleChange}
          value={this.props.queryDescription}
        />
      </section>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InputFields)