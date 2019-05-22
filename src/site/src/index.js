import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*
class Template extends React.Component {
    constructor(props) {
    	super(props);
    	//this.state = {};
    }
	
	render() {
    return (
      
    );
  }
}
*/

class Building extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
    			digest: null,
    			selection: null,
    			multiSel: false,
    			apidata: "",
    	};
    }
	
	componentDidMount(){
		
		fetch('http://localhost:8080/thermalSim', { 
				method: 'GET', 
				//mode: 'no-cors',
				headers: {
		            'Content-Type': 'application/json',
		        },
			})
			.then(blob => blob.json())
			.then(data => {
				this.setState({
					apidata: data,
				})
			});
	}
	
	render() {
		const status = this.state.apidata;
		
    return (
      <div>BUILDING OUTPUT: {status}</div>
    );
  }
}

// ========================================

ReactDOM.render(
  <div className="General">
  		<div className="roomGrids"><Building /></div>
  		<div className="toolBox">SAMPLE TEXT</div>
  		<div className="optionBox">SAMPLE TEXT</div>
  </div>,
  document.getElementById('root')
);