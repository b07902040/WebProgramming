import React, { useState , useEffect} from 'react';

function cell() {
  this.content = "";
  this.clickTime = 0;
};

function idxToAlpha(idx) {
  if ( idx === -1 ) return "";
  var a0 = "A".charCodeAt(0);
  if ( idx < 26 ) {
    return String.fromCharCode(a0 + idx);
  }
  else {
    var l1 = parseInt(idx / 26) - 1;
    var l2 = idx % 26;
    return String.fromCharCode(a0 + l1) + String.fromCharCode(a0 + l2); 
  }
}

function Table() {
  const [rowNum, setRowNum] = useState(5);
  const [colNum, setColNum] = useState(4);
  const [fcs, setFcs] = useState([-1, -1])
  const initCells = [];
  for (let i = 0; i < rowNum; i++) {
    initCells.push([]);
    for (let j = 0; j < colNum; j++) {
      initCells[i].push(new cell());
    }
  }
  const [Cells, setCells] = useState(initCells);
  
  function handleCellClick(i, j) {
    var focusCell = document.getElementById(idxToAlpha(j) + (i+1));
    var focusCol = document.getElementById("Col" + idxToAlpha(j));
    var focusRow = document.getElementById("Row" + (i+1));
    focusRow.classList.add("focusRC");
    focusCol.classList.add("focusRC");
    if ( Cells[i][j].clickTime === 0 ) {
      var newCells = Cells.slice();
      newCells[i][j].clickTime = 1;
      setCells(newCells);
      console.log(i, j, Cells[i][j].clickTime);
      setFcs([i, j]);
    }
    else if ( Cells[i][j].clickTime === 1 ) {
      let newCells = Cells.slice();
      newCells[i][j].clickTime = 2;
      setCells(newCells);
      console.log(i, j, Cells[i][j].clickTime);
    }
  }

  function handleCellBlur(i, j) {
    if ( fcs[0] === -1 || fcs[1] === -1 ) return;
    var focusCell = document.getElementById(idxToAlpha(j) + (i+1));
    var focusCol = document.getElementById("Col" + idxToAlpha(j));
    var focusRow = document.getElementById("Row" + (i+1));
    focusRow.classList.remove("focusRC");
    focusCol.classList.remove("focusRC");
    let newCells = Cells.slice();
    newCells[i][j].content = focusCell.value;
    newCells[i][j].clickTime = 0;
    setFcs([-1, -1]);
    setCells(newCells);
  }

  function handleCellKey(i, j, e) {
    if (e.key === "Enter") {
      console.log("Enter");
      var focusCell = document.getElementById(idxToAlpha(j) + (i+1));
      if ( Cells[i][j].clickTime === 2 ) {
        let newCells = Cells.slice();
        newCells[i][j].content = focusCell.value;
        setCells(newCells);
      }
      let ni = Math.min(i + 1, rowNum - 1);
      focusCell.blur();
      let newCells = Cells.slice();
      newCells[ni][j].clickTime = 1;
      setCells(newCells);
      return;
    }
    if (Cells[i][j].clickTime === 1 ) { //inputing
      document.getElementById(idxToAlpha(j) + (i+1)).value = "";
      let newCells = Cells.slice();
      newCells[i][j].clickTime = 2;
      setCells(newCells);
    }
  }

  function addCol() {
    if ( fcs[1] === -1 ) {
      let newCells = Cells.slice();
      for (let i = 0; i < rowNum; i++) {
        Cells[i].push(new cell());
      }
      setCells(newCells);
    }
    setColNum(colNum+1);
  }

  function addRow() {
    let newCells = Cells.slice();
    var newRow = [];
    for (let j = 0; j < colNum; j++) {
      newRow.push(new cell());
    }
    newCells.push(newRow);
    setCells(newCells);

    
    setRowNum(rowNum+1);
  }

  function delCol() {
    if ( fcs[1] !== -1 ) {
      var fcsRow = document.getElementById("Row" + (fcs[0] + 1));
      var fcsCol = document.getElementById("Col" + idxToAlpha(fcs[1]));
      fcsCol.classList.remove("focusRC");
      fcsRow.classList.remove("focusRC");
      var newCells = Cells.slice();
      for (let i = 0; i < rowNum; i++) {
        Cells[i].splice(fcs[1], 1);
      }
      setCells(newCells);
      setFcs([-1, -1]);
      setColNum(colNum-1);
    }
  }

  function passCell (src_i, src_j, tar_i, tar_j) {
    for (let prop in Cells[src_i][src_j]) {
      if (prop !== undefined) {
        var newCells = Cells.slice();
        newCells[tar_i][tar_j][prop] = newCells[src_i][src_j][prop];
        setCells(newCells);
      }
    }
  }

  function delRow() {
    if ( fcs[0] !== -1 ) {
      var fcsRow = document.getElementById("Row" + (fcs[0] + 1));
      var fcsCol = document.getElementById("Col" + idxToAlpha(fcs[1]));
      fcsCol.classList.remove("focusRC");
      fcsRow.classList.remove("focusRC");

      for (let i = fcs[0]; i < rowNum - 1; i++) {
        for (let j = 0; j < colNum; j++) {
          passCell(i+1, j, i, j);
        }
      }
      var newCells = Cells.slice();
      Cells.splice(rowNum - 1, 1);
      setCells(newCells);
      setFcs([-1, -1]);
      setRowNum(rowNum-1);
    }
  }

  useEffect(() => {
    for (let i = 0; i < rowNum; i++) {
      for (let j = 0; j < colNum; j++) {
        var focusCell = document.getElementById(idxToAlpha(j) + (i+1));
        focusCell.value = Cells[i][j].content;
      }
    }
  }, [Cells]);


  //render
  var firstRow = [];
  for ( let j = -1; j < colNum; j++ ) {
    firstRow.push(<th className="firstRow" id={"Col" + idxToAlpha(j)}>{idxToAlpha(j)}</th>);
  }

  var rows = [];
  var firstCol = [];
  for ( let i = 0; i < rowNum; i++ ) {
    let arow = [];
    arow = Cells[i].map( (cell, index) => {
      let s = idxToAlpha(index) + (i+1);
      return (
        <td>
          <input  
            type="text" 
            className="cell-input"
            id={s}
            onClick={(e)=>{handleCellClick(i,index)}}
            onKeyDown={(e)=>{handleCellKey(i,index,e)}}
            onBlur={()=>{handleCellBlur(i,index)}}
          />
        </td>
      );
    });
    arow.unshift(<th id={"Row"+(i+1)} className="firstCol">{i+1}</th>);
    rows = rows.concat([arow]);
  }

  return (
    <div className="wrapper">
      <div className="c0">
        <button onMouseDown={()=>{addCol()}} style={{marginTop: 60}}>+</button>
        <button onMouseDown={()=>{delCol()}}>-</button>
      </div>
      <div>
        <div className="r0">
          <button onMouseDown={()=>{addRow()}} style={{marginLeft: 100}}>+</button>
          <button onMouseDown={()=>{delRow()}}>-</button>
        </div>
        <table className="table-wrapper">
          <thead>
            {firstRow}
          </thead>
          <tbody>
            {rows.map( (e) => {
              return (
                <tr>
                  {e}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div >
  );
}

export default Table;