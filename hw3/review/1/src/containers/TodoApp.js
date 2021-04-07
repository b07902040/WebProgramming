import React, { Component } from "react";
import Header from "../components/Header.js";
import Section from "../components/section.js";
//import TodoItem from "../components/TodoItems.js";
//import Footer from "../components/Footer.js";

class TodoApp extends Component {
	render() {
        return (
            <div id="root" className="todo-app__root">
            	<Header text="Todos"></Header>
            	<Section ></Section>
            </div>
        );
        
    }
}



export default TodoApp;
