import React, { Component } from 'react';


class TodoMain extends Component{
	constructor(props){
		super(props)
		this.state={
			todoitem :'',
			todovalue:[],
			//id:0,
			isComplete: false,
			count:0
		}
		this.handleKeydown=this.handleKeydown.bind(this);
		this.handleonchange=this.handleonchange.bind(this);
		this.clearComplete=this.clearComplete.bind(this);
		this.handleCheck=this.handleCheck.bind(this);
		this.deleteElement=this.deleteElement.bind(this);
		this.isComplete=this.isComplete.bind(this);
		//this.numLeft=this.numLeft.bind(this);

	}

	handleKeydown(event){
		if(event.nativeEvent.keyCode === 13){
			if(this.state.todoitem.length !== 0){
				console.log('Success')
				this.setState({
				todovalue: this.state.todovalue.concat(event.target.value),
				id: this.state.id+1,
				isComplete:false,
				todoitem:''
				})
			}
			
		}	
		console.log(this.state.todovalue)	
	}
	
	handleonchange = (e) => {
		this.setState({todoitem: e.target.value}, function(){
			//this.updatetodo();
		})
		//console.log(this.state.todoitem)
	}
	updatetodo(){
		if(this.state.todoitem.length !== 0){
			console.log('Success')
		}
	} 
	clearComplete(){ //刪除已經完成的，想一下要怎麼改
		this.setState({todovalue:[]})
	}
	
	handleCheck(e) {
        //console.log(e.target);
    }

   // this.state.data.map((item,i) => <li key={i}>Test</li>)
   	deleteElement(index) {
   		this.setState({
   			todovalue: this.state.todovalue.filter(function (e, i) {
   				return i !== index;
      		})
    	});
  	}
  	isComplete = event =>{
  		this.setState({
  			isComplete: event.target.value,
  			count: this.state.count +1
  		})
  		if (this.state.count% 2 === 0){
  			this.setState({
  				isComplete: false
  			})
  		}
  		//const num = this.state.count% 2 === 0;
  		//console.log(this.state.isComplete)
  		console.log((this.state.count% 2 === 0).length)
  	}
  	//{()=>this.nameChange(event, index)}
	render(){
		return(
			<div id="root" className="todo-app__root">
				<section className="todo-app__main">
            		<input value = {this.state.todoitem} onChange={this.handleonchange} onKeyDown={this.handleKeydown} placeholder="What needs to be done?" type="text" className="todo-app__input" />
            		<ul id="todo-list" className="todo-app__list"  style={{display: this.state.todovalue.length===0 && 'none'}}>
            			{this.state.todovalue.map((val,index)=> <li key={index} className="todo-app__item" >
            				<div className="todo-app__checkbox" >
            				<input type="checkbox" id={index} onClick={this.isComplete} /><label htmlFor={index}></label>
            				</div>
            				<h1 className="todo-app__item-detail" style={{textDecoration: this.state.count% 2 !== 0 && 'line-through', opacity:  this.state.count% 2 !== 0 &&'0.5'}} > {val} </h1>
            				<img  onClick={()=>this.deleteElement(index)}  src="./img/x.png" className="todo-app__item-x" />
            				</li>
            				)}
            		</ul>
            	</section> 
            	<footer className="todo-app__footer" id="todo-footer" style={{visibility: this.state.todovalue.length===0 && 'hidden'}}>
		    		<div className="todo-app__total">{this.state.todovalue.length} left</div>
		        	<ul className="todo-app__view-buttons" >
		        		<button>All</button>
			        	<button>Active</button>
			        	<button>Completed</button>
		        	</ul>
        			<div className="todo-app__clean">
            			<button onClick={this.clearComplete} >Clear completed</button>
        			</div>
    			</footer>          	
			</div>
		)
	}
}

export default TodoMain;