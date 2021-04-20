import React, { useState , useEffect} from 'react';

function cell() {
  this.clk = 0;
  this.content = "";
  this.isFunc = false;
  this.functType = "NULL";
  this.functValue = 0;
  this.functRef = [
    [-1, -1],
    [-1, -1],
  ];
};

function Table() {
  const [rowNum, setRowNum] = useState(100);
  const [colNum, setColNum] = useState(26);
  const initCells = [];
  for (let i = 0; i < rowNum; i++) {
    initCells.push([]);
    for (let j = 0; j < colNum; j++) {
      initCells.push(new cell());
    }
  }
  const [Cells, setCells] = useState(initCells);

  useEffect(() => {
    // 使用瀏覽器 API 更新文件標題
    document.title = `You clicked times`;
  }, [Cells]);

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
       
        { Cells.map( (cell) =>  
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
        </tbody>)}
        </table>
      </div>
    </div >
  );
}

export default Table;