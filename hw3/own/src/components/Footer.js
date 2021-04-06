import React , { Component }from "react";

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.show = this.show.bind(this);
	}

	show(state) {
		this.props.showState(state);
	}

	render () {
		var haveCom = (this.props.comNum>0) ? '' : 'hidden';
		return (
			<footer className="todo-app__footer" id="todo-footer" style={{display:this.props.display}}>
				<div className="todo-app__total">
					<p>{this.props.leftNum} left</p>
				</div>
				<ul className="todo-app__view-buttons">
					<li>
						<button onClick={()=>this.show('All')}>All</button>
					</li>
					<li>
						<button onClick={()=>this.show('Active')}>Active</button>
					</li>
					<li>
						<button onClick={()=>this.show('Complete')} >Completed</button>
					</li>
				</ul>
				<div className="todo-app__clean" style={{visibility:haveCom}}>
					<button onClick={this.props.clearClick}>Clear completed</button>
				</div>
			</footer>
		);
	}
};
