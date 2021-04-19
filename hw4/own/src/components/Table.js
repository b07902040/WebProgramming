import React, { Component } from "react";
class Table extends Component {
  
  render() {
    return (
      <div className="wrapper">
        <div className="c0">
          <button style={{marginTop: 60}}>+</button>
          <button>-</button>
        </div>
        <div>
          <div className="r0">
            <button style={{marginLeft: 100}}>+</button>
            <button>-</button>
          </div>
          <table className="table-wrapper">
          <thead>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
          </thead>
          <tbody>
              <tr>
                  <td>1</td>
                  <td>
                    <input type="text" value="A1" style={{border: 'none'}} />
                  </td>
                  <td>B1</td>
                  <td>C1</td>
              </tr>
              <tr>
                  <td>2</td>
                  <td>A2</td>
                  <td>B2</td>
                  <td></td>
              </tr>
          </tbody>
          </table>
        </div>
      </div >
    );
  }
}

export default Table;