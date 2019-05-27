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
		let rom = "";
		if(status.rooms){
			rom = status.rooms.map((data,room) => {
				return (
					<div>
						<Room data={data} />
					<br />
					</div>
				);
			});
		}
		
    return (
      <div>ITERATIONS: {status.iteration}<br />{rom}</div>
    );
  }
}

class Room extends React.Component {
    constructor(props) {
    	super(props);
    	this.state = {
    			data: props.data,
    	};
    }
	
	render() {
		const status = this.state.data;
		
		let grid = [];
		for(let i = (status.h-1) ; i >= 0 ; i--){
			for(let j = 0 ; j < status.w ; j++){
				grid.push(<Cell data={status.cells[i*status.w+j]} room={status.id} cellid={i*status.w+j} />);
			}
			grid.push(<br />);
			grid.push(<br />);
		}
		
		return (
				<div>
				{status.id} : {status.desc} <br /> {grid}
				</div>
		);
  }
}

class Cell extends React.Component {
    constructor(props) {
    	super(props);
    	this.state = {
    			data: props.data,
    			room: props.room,
    			cellid: props.cellid,
    	};
    }
	
	render() {
		const status = this.state.data;
		const temp = this.state.data.temp_counters;
		let background = "000";
		let text = Math.floor(temp);
		
		let lerp;
		let colormap = [
			"#0039AD",
			"#004DAC",
			"#0062AC",
			"#0077AB",
			"#008CAB",
			"#00A1AB",
			"#00AAA0",
			"#00AA8B",
			"#00AA76",
			"#00A961",
			"#00A94C",
			"#00A937",
			"#00A822",
			"#00A80D",
			"#06A800",
			"#1BA700",
			"#2FA700",
			"#43A700",
			"#58A600",
			"#6CA600",
			"#80A600",
			"#94A500",
			"#A5A200",
			"#A58E00",
			"#A47900",
			"#A46500",
			"#A45100",
			"#A33D00",
			"#A32800",
			"#A21500",
		]
		if(temp <= -100) lerp = 0;
		else if(temp > 200) lerp = colormap.length-1;
		else{
			let tempmap = (temp+100)/300;
			lerp = Math.floor(tempmap*(colormap.length-1));
		}
		
		background = colormap[lerp];
		
		if(status.flame==1){
			background = "red";
			text = "***";
		}else if(status.spreadable==0){
			background = "gray";
			text = "###"
		}else if(status.ignition>0){
			background = "blue";
			text = status.ignition;
		}
		
    return (
    	<span>
    	<button 
	    className="cell" 
	    onClick={() => this.props.onClick()}
    	style={{background: background}}
      >
	    {text}
      </button>
    	</span>
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

