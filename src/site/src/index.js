import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var selectedTool = 0;
var options = {};
var auxiliarData = {
		numit: 1,
		build: {
			name : null,
			w	 : null,
			h	 : null,
		},
		draw: {
			tool: null,
			params: []
		}
		
};

var tools = [
	{
		name: "Select",
		onClick: (obj) => seleccionar(obj),
	},
	{
		name: "Iterate",
		onClick: (obj) => iterar(obj),
	},
	{
		name: "Build",
		onClick: (obj) => buildRoom(obj),
	},
	{
		name: "Draw",
		onClick: (obj) => startDrawMode(obj),
	},
	{
		name: "Link",
		onClick: (obj) => startLinkMode(obj),
	},
	{
		name: "Ignite",
		onClick: (obj) => ignite(obj),
	},
	{
		name: "Deflagrate",
		onClick: (obj) => startDeflagMode(obj),
	},
	{
		name: "Sink",
		onClick: (obj) => startSinkMode(obj),
	},
	{
		name: "Save",
		onClick: (obj) => startSaveMode(obj),
	},
	{
		name: "Load",
		onClick: (obj) => startLoadMode(obj),
	},
	{
		name: "New",
		onClick: (obj) => applyNew(obj),
	},
]

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
    			selection: null,
    			multiSel: false,
    			apidata: "",
    	};
    }
	
	componentDidMount(){
		const status = this.state.digest;
		
		setInterval( () => {
			fetch('http://localhost:8080/thermalSim', { 
				method: 'GET', 
				//mode: 'no-cors',
				headers: {
		            'Content-Type': 'application/json',
		        },
			})
			.then(blob => blob.json())
			.then(data => {
				if(data.digest !== status){
					this.setState({
						apidata: data,
					});
					this.forceUpdate();
				}
			});
		}, 1000);
	}
	
	render() {
		const status = this.state.apidata;
		let rom = "";
		if(status.rooms){
			rom = status.rooms.map((data,room) => {
				return (
					<div key={data.id}>
						<Room key={"ROOM"+data.id} data={data} />
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
	
    componentWillReceiveProps(nextProps) {
    	  this.setState({ data: nextProps.data });  
    }
    
	render() {
		const status = this.state.data;
		
		let grid = [];
		for(let i = (status.h-1) ; i >= 0 ; i--){
			for(let j = 0 ; j < status.w ; j++){
				grid.push(<div key={status.id+""+i*status.w+j}><Cell data={status.cells[i*status.w+j]} room={status.id} cellid={status.id+":"+j+","+i} /></div>);
			}
			grid.push(<br />);
			grid.push(<br />);
		}
		
		return (
				<div key={"DIV-"+status.id}>
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
	
    componentWillReceiveProps(nextProps) {
  	  this.setState({ data: nextProps.data     ,
  		  			  room: nextProps.room     ,
  		  			  cellid: nextProps.cellid ,
  		  			
  	  });  
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
		
		if(status.flame===1){
			background = "red";
			text = "***";
		}else if(status.spreadable===0){
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
	    onClick={() => cellClicked(this)}
    	style={{background: background}}
      >
	    {text}
      </button>
      </span>
    );
  }
}

class Toolbox extends React.Component {
    constructor(props) {
    	super(props);
    	this.state = {
    			selected : 0,
    	}
    	//this.state = {};
    }
	
	render() {
		let sel = this.state.selected;
		let cn = "tool";
		let grid = [];
		for(let i = 0 ; i < tools.length ; i++){
			if(i===sel) cn = "seltool";
			else cn = "tool";
			grid.push(
				<div key={"tool-"+i}><button
					className={cn}
					onClick={() => tools[i].onClick(this)}
					
				/>
				{tools[i].name}
				</div>
			);
		}
		
    return (
      <div>
      	{grid}
      </div>
    );
  }
}

class OptionBox extends React.Component {
    constructor(props) {
    	super(props);
    	this.state = {
    			cell     : null,
    			rend	 : [],
    			subopts	 : [],
    	};
    }
	
	render() {
		options = this;
		let torend = this.state.rend;
		let subopts = this.state.subopts;
		let selcell = this.state.cell;
		let cellInfo = [];
		if(selcell !== null){
			let selcell = this.state.cell.state;
			cellInfo.push(
					<div key="cellInfo">
						<p>Selected Cell: {selcell.cellid}</p>
					</div>
			);
			
			cellInfo.push(<div key="cellInfo2"><p>The cell current temperature is {selcell.data.temp_counters} ºC</p></div>);
			
			if(selcell.data.flame === 1) 
				cellInfo.push(<div key="cellInfo3"><p>The cell is on fire and will burn during the next {selcell.data.ignition*-1} iterations</p></div>);
			else if(selcell.data.ignition > 0)
				cellInfo.push(<div key="cellInfo4"><p>The cell will set on fire at {selcell.data.ignition*100} degrees</p></div>);
			
			if(selcell.data.spreadable === 0)
				cellInfo.push(<div key="cellInfo5"><p>The cell offers a heat conductivity of {selcell.data.insulation * 100} %</p></div>);
		}else{
			cellInfo.push(
					<div key="Options">
						<p>No Cell is selected.</p>
					</div>
			);
		}
    return (
    	<div>
    	{cellInfo}
    	{torend}
    	{subopts}
    	</div>
    );
  }
}

// ========================================

ReactDOM.render(
  <div className="General">
  		<div className="roomGrids"><Building /></div>
  		<div className="toolBox"><Toolbox /></div>
  		<div className="optionBox"><OptionBox /></div>
  </div>,
  document.getElementById('root')
);

function cellClicked(cellobj) {
	let fetchcommand = (c) => {
		fetch("http://localhost:8080/thermalSim"+c, { 
			method: 'GET', 
			//mode: 'no-cors',
			headers: {
	            'Content-Type': 'application/json',
	        },
		});
	}
	
	let updateoptions = (options) => {
		options.setState({
			cell: cellobj,
		});
	}
	
	updateoptions(options);
	let cellroom = cellobj.state.room;
	let cellx = cellobj.state.cellid.split(":")[1].split(",")[0];
	let celly = cellobj.state.cellid.split(":")[1].split(",")[1];
	
	let command = "?command=";
	
	switch(selectedTool){
		case 3://Draw mode
			command = command + auxiliarData.draw.tool + " " +
			cellroom + " " +
			cellx + " " +
			celly + " ";
			if(auxiliarData.draw.tool==="set"){
				command = command + 
				auxiliarData.draw.params[0]+ " " +
				auxiliarData.draw.params[1]+ " " +
				auxiliarData.draw.params[2];
			}else if(auxiliarData.draw.tool==="block"){
				command = command +
				auxiliarData.draw.params[0]/100.0;
			}else if(auxiliarData.draw.tool==="put"){
				command = command +
				auxiliarData.draw.params[0] + " ";
				if(auxiliarData.draw.params[1]!=100){
					command = command +
					auxiliarData.draw.params[1]/100.0;
				}
				
			}
			
			fetchcommand(command);
			break;
	}
	
}

function seleccionar(obj) {
	selectedTool = 0;
	obj.setState({
		selected: selectedTool,
	});
	
	let updateoptions = (options) => {
		options.setState({
			cell: null,
			rend: [],
			subopts: [],
		});
	}
	updateoptions(options);
	
}

function iterar(obj) {
	selectedTool = 1;
	obj.setState({
		selected: selectedTool,
	});
	
	
	let optionsData = [];
	
	optionsData.push(
		<div>
			<hr />
			<p><b>Iterate function selected.</b></p>
			<p>Number of iterations: <input className="inputnum" name="numit" type="number" onChange={(e) => auxiliarData.numit = e.target.value } /></p>
			<button onClick={()=>{
				fetch("http://localhost:8080/thermalSim?command=iterate "+auxiliarData.numit, { 
					method: 'GET', 
					//mode: 'no-cors',
					headers: {
			            'Content-Type': 'application/json',
			        },
				});
			}}>Iterate!</button>
		</div>
	);
	
	let updateoptions = (options) => {
		options.setState({
			rend: optionsData,
			subopts: [],
		});
	}
	updateoptions(options);
}

function buildRoom(obj) {
	selectedTool = 2;
	obj.setState({
		selected: selectedTool,
	});
	let optionsData = [];
	
	optionsData.push(
		<div>
			<hr />
			<p><b>Build function selected.</b></p>
			<p>Name of the room: <input type="text" onChange={(e) => auxiliarData.build.name = e.target.value } /></p>
			<p>witdh: <input className="inputnum" type="number" onChange={(e) => auxiliarData.build.w = e.target.value } />
			   height: <input className="inputnum" type="number" onChange={(e) => auxiliarData.build.h = e.target.value } /></p>
			<button onClick={()=>{
				fetch("http://localhost:8080/thermalSim?command=build "+auxiliarData.build.name+" "+auxiliarData.build.w+" "+auxiliarData.build.h, { 
					method: 'GET', 
					//mode: 'no-cors',
					headers: {
			            'Content-Type': 'application/json',
			        },
				});
			}}>Build!</button>
		</div>
	);
	
	let updateoptions = (options) => {
		options.setState({
			rend: optionsData,
			subopts: [],
		});
	}
	updateoptions(options);
}

function startDrawMode(obj) {
	selectedTool = 3;
	obj.setState({
		selected: selectedTool,
	});
	let optionsData = [];
	
	optionsData.push(
		<div>
			<hr />
			<p><b>Draw function selected.</b></p>
			<p>Choose a tool:</p>
			
			<select name="subtool" onChange={(e) => {
					let optionsExtra = [];
					auxiliarData.draw.tool = e.target.value;
					auxiliarData.draw.params = [0,0,0]
					if(auxiliarData.draw.tool === "set"){
						optionsExtra.push(
								<div>
									<hr/>
									<p>(Advanced) Setting cell options:</p>
									<p>Flame: <input min="0" max="1" className="inputnum" type="number" onChange={(e) => auxiliarData.draw.params[0] = e.target.value }/></p>
									<p>Ignition: <input className="inputnum" type="number" onChange={(e) => auxiliarData.draw.params[1] = e.target.value }/></p>
									<p>Temperature: <input className="inputnum" type="number" onChange={(e) => auxiliarData.draw.params[2] = e.target.value }/></p>
								</div>
							);
					}else if(auxiliarData.draw.tool === "block"){
						auxiliarData.draw.params[0] = 0;
						optionsExtra.push(
								<div>
									<hr/>
									<p>Blocking cell conductivity:</p>
									<p>Conductivity (0% by default): <input min="0" max="100" className="inputnum" type="number" onChange={(e) => auxiliarData.draw.params[0] = e.target.value }/></p>
								</div>
						);
					}else if(auxiliarData.draw.tool === "unblock"){
						optionsExtra.push(
								<div>
									<hr/>
									<p>Click on a blocked cell to unlock it.</p>
								</div>
						);
					}else if(auxiliarData.draw.tool === "put"){
						auxiliarData.draw.params[0] = 1;
						auxiliarData.draw.params[1] = 100;
						optionsExtra.push(
								<div>
									<hr/>
									<p>Putting an ignitable object:</p>
									<p>ignition temperature (each unit equals 100ºC) : <input min="0" className="inputnum" type="number" onChange={(e) => auxiliarData.draw.params[0] = e.target.value }/></p>
									<p>Conductivity (100% by default): <input min="0" max="100" className="inputnum" type="number" onChange={(e) => auxiliarData.draw.params[1] = e.target.value }/></p>
								</div>
						);
					}
					
					let uoptextra = (options) => {
						options.setState({
							subopts: optionsExtra,
						});
					}
					uoptextra(options);
				}
			}>
				<option value=""></option>
				<option value="set">Set cell options (Advanced)</option>
	        	<option value="block">Block heat spreading</option>
	        	<option value="unblock">Unblock heat spreading</option>
	        	<option value="put">Set a burning flashpoint</option>
	        </select><br />
		</div>
	);
	
	let updateoptions = (options) => {
		options.setState({
			rend: optionsData,
			subopts: [],
		});
	}
	updateoptions(options);
}

function startLinkMode(obj) {
	selectedTool = 4;
	obj.setState({
		selected: selectedTool,
	});
}

function ignite(obj) {
	selectedTool = 5;
	obj.setState({
		selected: selectedTool,
	});
}

function startDeflagMode(obj) {
	selectedTool = 6;
	obj.setState({
		selected: selectedTool,
	});
}

function startSinkMode(obj) {
	selectedTool = 7;
	obj.setState({
		selected: selectedTool,
	});
}

function startSaveMode(obj) {
	selectedTool = 8;
	obj.setState({
		selected: selectedTool,
	});
}

function startLoadMode(obj) {
	selectedTool = 9;
	obj.setState({
		selected: selectedTool,
	});
}

function applyNew(obj) {
	selectedTool = 10;
	obj.setState({
		selected: selectedTool,
	});
}
