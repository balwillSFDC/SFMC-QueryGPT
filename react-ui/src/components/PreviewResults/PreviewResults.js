import {connect} from 'react-redux'
import React from 'react'
// import Table from 'react-bootstrap/Table';
import {DataTable} from '@salesforce/design-system-react'; 
import {DataTableColumn} from '@salesforce/design-system-react';
import {DataTableCell} from '@salesforce/design-system-react';


const mapStateToProps = state => {
	return {
		runQueryJobId: state.runQueryJobId,
		runQueryJobState: state.runQueryJobState,
		runQueryJobResult: state.runQueryJobResult
	}
}

const mapDispatchToProps = {
	
}

const extractHeaders = (data) => {
  const headers = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => headers.add(key));
  });
  return Array.from(headers);
};



class PreviewPanel extends React.Component {
	constructor() {
		super()
		this.state = {
			headers: []
		}
	}

	componentDidMount() {
		if (this.props.runQueryJobResult.length > 0) {
			let headers = extractHeaders(this.props.runQueryJobResult);
			this.setState({headers}) 
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.runQueryJobResult != this.props.runQueryJobResult) {
			let headers = extractHeaders(this.props.runQueryJobResult);
			this.setState({headers})
		}

	}

	render() {
    return (
        this.props.runQueryJobResult.length === 0
        ? ''
        : (
            <DataTable items={this.props.runQueryJobResult} id="previewResults" fixedHeader={true} fixedLayout={true}>
                {
									this.state.headers.map((header) => (
										<DataTableColumn key={header} label={header} property={header} /> 
									))
								}
								
								{/* <thead>
                    <tr>
                        {this.state.headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {this.props.runQueryJobResult.map((item, index) => (
                        <tr key={index}>
                            {this.state.headers.map((header, idx) => (
                                <td key={idx}>{item[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody> */}
            </DataTable>

          )
    );
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewPanel)