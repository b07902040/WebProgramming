import React, { Component } from "react";
import Header from "../components/Header";
import Section from "../components/Section";
import Footer from "../components/Footer";

function Detail(Seq, Content, Display) {
  this.Seq = Seq;
  this.Content = Content;
  this.Display = Display;
};

var Reg = new Array(10000);
var Complete = new Array(10000).fill(0);

class TodoApp extends Component {
  constructor(props) {
		super(props);
		this.state = {
			listNum: 0,
      leftNum: 0,
      seqNum: 0,
      comNum: 0,
      presentAll: 'none',
      allTodo: [],
		};
    this.showState = this.showState.bind(this);
	}

  handleEnterKey = (event) => {
    if(event.key === "Enter") {
      const inputLine = document.getElementsByClassName('todo-app__input')[0]
      if ( inputLine.value !== "" ) {
        var newAllTodo = this.state.allTodo.slice();
        newAllTodo.push(new Detail(this.state.seqNum, inputLine.value, ''));
        //console.log(newAllTodo[this.state.seqNum].Display)
        inputLine.value = "";
        Reg[this.state.seqNum] = this.state.listNum;
        this.setState({
          allTodo: newAllTodo,
          listNum: this.state.listNum+1,
          leftNum: this.state.leftNum+1,
          seqNum: this.state.seqNum+1,
          presentAll: '',
        });
      }
    }
  }

  deleteTodo(Seq) {
    var newAllTodo = this.state.allTodo.slice();
    var com = (Complete[Seq] === 0) ? this.state.comNum : this.state.comNum-1;
    var left = (Complete[Seq] === 1) ? this.state.leftNum : this.state.leftNum-1;
    Complete[Seq] = 0;
    newAllTodo.splice(Reg[Seq], 1);
    for ( let i = Seq+1; i < this.state.seqNum; i++ ) {
      Reg[i]--;
    }
    this.setState({
      allTodo: newAllTodo,
      listNum: this.state.listNum-1,
      leftNum: left,
      comNum: com,
      presentAll: (this.state.listNum===1? 'none' : ''),
    });
  }

  clearCom() {
    var newAllTodo = this.state.allTodo.slice();
    var cnt = 0;
    for ( let Seq = 0; Seq < this.state.seqNum; Seq++ ) {
      if ( Complete[Seq] === 1 ) {
        Complete[Seq] = 0;
        newAllTodo.splice(Reg[Seq], 1);
        for ( let i = Seq+1; i < this.state.seqNum; i++ ) {
          Reg[i]--;
        }
        cnt++;
      }
    }
    this.setState({
      allTodo: newAllTodo,
      listNum: this.state.listNum - cnt,
      comNum: this.state.comNum - cnt,
      presentAll: (this.state.listNum===cnt? 'none' : ''),
    });
  }

  CompleteTodo(Seq) {
    if ( Complete[Seq] === 0 ) {
      Complete[Seq] = 1;
      this.setState({ 
        leftNum: this.state.leftNum-1,
        comNum: this.state.comNum+1,
      });
    }
    else {
      Complete[Seq] = 0;
      this.setState({ 
        leftNum: this.state.leftNum+1,
        comNum: this.state.comNum-1 
      });
    }
  }

  showState(state) {
    var newAllTodo = this.state.allTodo.slice();
    if ( state === 'Complete' ) {
      for ( let i = 0; i < newAllTodo.length; i++ ) {
        if ( Complete[newAllTodo[i].Seq] === 0 ) {
          newAllTodo[i].Display = 'none';
        }
        else {
          newAllTodo[i].Display = '';
        }
      }
    }
    else if ( state === 'Active' ) {
      for ( let i = 0; i < newAllTodo.length; i++ ) {
        if ( Complete[newAllTodo[i].Seq] === 0 ) {
          newAllTodo[i].Display = '';
        }
        else {
          newAllTodo[i].Display = 'none';
        }
      }
    }
    else {
      for ( let i = 0; i < newAllTodo.length; i++ ) {
        newAllTodo[i].Display = '';
      }
    }
    this.setState({
      allTodo: newAllTodo
    });
  }

  clearAll() {
    this.setState({
			listNum: 0,
      leftNum: 0,
      comNum: 0,
      presentAll: 'none',
      allTodo: [],
		});
  }

  render() {
    var listItems = this.state.allTodo.map((Detail) =>
      <li className="todo-app__item" style={{display:Detail.Display}} key={Detail.Seq}>
        <div className="todo-app__checkbox">
          <input type="checkbox" id={Detail.Seq} onClick={()=>this.CompleteTodo(Detail.Seq)}/>
          <label htmlFor={Detail.Seq} ></label>
        </div>
        <h1 className="todo-app__item-detail">{Detail.Content}</h1>
        <img src="./img/x.png" className="todo-app__item-x" onClick={()=>this.deleteTodo(Detail.Seq)}/>
      </li>
    );

    return (
      <>
        <Header text="Todo list"/>
        <input 
          className="todo-app__input"
          placeholder="What needs to be done?"
          onKeyDown={this.handleEnterKey}
        />
				<Section
          listItems={listItems}
        />
				<Footer
          leftNum={this.state.leftNum}
          display={this.state.presentAll}
          comNum={this.state.comNum}
          showState={this.showState}
          clearComClick={this.clearCom.bind(this)}
          clearAllClick={this.clearAll.bind(this)}
        />
      </>
    );
  }
}

export default TodoApp;
