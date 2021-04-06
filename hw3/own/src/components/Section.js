import React, { Component }from "react";

export default class Section extends Component {
  renderList() {
    return (
      <ul className="todo-app__list" id="todo-list">
        {this.props.listItems}
      </ul>
    );   
  }

  render() {
    return (
      <section className="todo-app__main" >
        {this.props.inputLine}
        {this.renderList()}
      </section>
    );
  }
};