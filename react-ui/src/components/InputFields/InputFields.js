import {connect} from 'react-redux'
import React from 'react'
import {Input, Textarea, Tooltip} from '@salesforce/design-system-react'
import './InputFields.css'
import {setInputValue} from '../../actions'

const mapStateToProps = state => {
	return {
    sourceDataExtensionName: state.sourceDataExtensionName,
    targetDataExtensionName: state.targetDataExtensionName,
    queryDescription: state.queryDescription
	}
}

const mapDispatchToProps = {
  setInputValue
}



class InputFields extends React.Component {
	constructor() {
			super()
	}

	componentDidMount() {

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
          fieldLevelHelpTooltip={
            <Tooltip
              id="field-level-help-tooltip"
              align="top right"
              variant="learnMore"
              content="Some helpful information"
            />
          }
        />
        <Input
          assistiveText={{ label: 'My label' }}
          label="Target Data Extension Name"
          id="targetDataExtensionName"
          name="targetDataExtensionName"
          className="inputFields"
          placeholder="Target Data Extension Name"
          required
          onChange={this.handleChange}
          value={this.props.targetDataExtensionName}
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