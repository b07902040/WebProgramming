import React, { useState, useRef } from "react";

export default () => {
  const [content, setcontent] = useState(
    Array.from({ length: 100 }, (e) => Array.from({ length: 26 }, () => ""))
  );
  const [focus, setfocus] = useState({ row: -1, column: -1, editing: false });
  const [copied, setcopied] = useState({ row: -1, column: -1, value: "" });
  const nextInput = useRef();
  const focusnextInput = () =>
    nextInput.current !== null && nextInput.current.focus();
  const originInput = useRef();
  const focusOriginInput = () =>
    originInput.current !== null && originInput.current.focus();
  const error = "ERROR!";

  const unfocus = () => {
    setfocus({ row: -1, column: -1, editing: false });
  };

  const addrow = (event) => {
    event.stopPropagation();
    event.target.blur();
    const row = focus.row < 0 ? content.length : focus.row;
    setcontent((oldContent) => {
      let newContent = oldContent.map((e) =>
        e.map((f) => {
          if (isFormula(f)) {
            let cells = f.matchAll(/[A-Za-z]+[0-9]+/g);
            for (let cell of cells) {
              let originRow = cell[0].match(/[0-9]+/)[0];
              let originRowNum = parseInt(originRow, 10) - 1;
              if (originRowNum >= row) {
                f = f.replace(originRow, "" + (originRowNum + 2));
              }
            }
          }
          return f;
        })
      );
      newContent = newContent.map((e) => e.slice());
      newContent.splice(
        row,
        0,
        Array.from({ length: oldContent[0].length }, () => "")
      );
      return newContent;
    });
    focusOriginInput();
  };

  const deleterow = (event) => {
    event.stopPropagation();
    event.target.blur();
    if (focus.row >= 0 && content.length > 1) {
      setcontent((oldContent) => {
        let newContent = oldContent.map((e) =>
          e.map((f) => {
            if (isFormula(f)) {
              let cells = f.matchAll(/[A-Za-z]+[0-9]+/g);
              for (let cell of cells) {
                let originRow = cell[0].match(/[0-9]+/)[0];
                let originRowNum = parseInt(originRow, 10) - 1;
                if (originRowNum === focus.row) {
                  return error;
                }
                if (originRowNum > focus.row) {
                  f = f.replace(originRow, "" + originRowNum);
                }
              }
            }
            return f;
          })
        );
        newContent = newContent.filter((e, i) => i !== focus.row);
        return newContent;
      });
      focusOriginInput();
    }
  };

  const addcolumn = (event) => {
    event.stopPropagation();
    event.target.blur();
    const column = focus.column < 0 ? content[0].length : focus.column;
    setcontent((oldContent) => {
      let newContent = oldContent.map((e) =>
        e.map((f) => {
          if (isFormula(f)) {
            let cells = f.matchAll(/[A-Za-z]+[0-9]+/g);
            for (let cell of cells) {
              let originColumn = cell[0].match(/[A-Za-z]+/)[0];
              let originColumnNum = str2int(originColumn) - 1;
              if (originColumnNum >= column) {
                f = f.replace(originColumn, int2str(originColumnNum + 2));
              }
            }
          }
          return f;
        })
      );
      newContent = newContent.map((e) => e.slice());
      newContent.forEach((e) => e.splice(column, 0, ""));
      return newContent;
    });
    focusOriginInput();
  };

  const deletecolumn = (event) => {
    event.stopPropagation();
    event.target.blur();
    if (focus.column >= 0 && content[0].length > 1) {
      setcontent((oldContent) => {
        let newContent = oldContent.map((e) =>
          e.map((f) => {
            if (isFormula(f)) {
              let cells = f.matchAll(/[A-Za-z]+[0-9]+/g);
              for (let cell of cells) {
                let originColumn = cell[0].match(/[A-Za-z]+/)[0];
                let originColumnNum = str2int(originColumn) - 1;
                if (originColumnNum === focus.column) {
                  return error;
                }
                if (originColumnNum > focus.column) {
                  f = f.replace(originColumn, int2str(originColumnNum));
                }
              }
            }
            return f;
          })
        );
        newContent = newContent.map((e) => e.slice());
        newContent.forEach((e) => e.splice(focus.column, 1));
        return newContent;
      });
      focusOriginInput();
    }
  };

  const int2str = (i) => {
    // 1 => A, 27 => AA
    let ans = "";
    while (i > 0) {
      let remainder = i % 26;
      ans = String.fromCharCode("A".charCodeAt(0) + remainder - 1) + ans;
      i = (i - remainder) / 26;
    }
    return ans;
  };

  const str2int = (s) => {
    // A => 1, Aa => 27
    let ans = 0;
    for (let i = 0; i < s.length; i++) {
      ans *= 26;
      ans +=
        (s.charCodeAt(i) - "A".charCodeAt(0) + 1) %
        ("a".charCodeAt(0) - "A".charCodeAt(0));
    }
    return ans;
  };

  const focusOn = (row, column) => (event) => {
    event.stopPropagation();
    if (row !== focus.row || column !== focus.column)
      setfocus({ row, column, editing: false });
  };

  const editOn = (row, column) => (event) => {
    event.stopPropagation();
    setfocus({ row, column, editing: true });
  };

  const handleChange = (row, column) => (event) => {
    setcontent((oldContent) => {
      let newContent = oldContent.map((e) => e.slice());
      newContent[row][column] = event.target.value;
      return newContent;
    });
  };

  const onKeyUp = (row, column) => (event) => {
    // console.log(event.target.value);
    if (focus.editing) {
      if (event.key === "Enter") {
        if (row !== content.length - 1) {
          focusnextInput();
          event.target.blur();
        }
        setfocus({
          row: Math.min(row + 1, content.length - 1),
          column: column,
          editing: false,
        });
      }
    } else {
      if (event.key === "Enter") {
        setfocus((state) => ({
          ...state,
          editing: true,
        }));
      } else if (event.key === "delete" || event.key === "Backspace") {
        setcontent((oldContent) => {
          let newContent = oldContent.map((e) => e.slice());
          newContent[row][column] = "";
          return newContent;
        });
      } else if (event.key.length === 1) {
        setcontent((oldContent) => {
          let newContent = oldContent.map((e) => e.slice());
          newContent[row][column] = event.key;
          return newContent;
        });
        setfocus((state) => ({
          ...state,
          editing: true,
        }));
      }
    }
  };

  const isFormula = (s) => {
    return s.length !== 0 && s[0] === "=";
  };

  const parseValidIndex = (s) => {
    const invalid = { valid: false };
    let result = { valid: true, data: [] };
    let cells = s.matchAll(/[A-Za-z]+[0-9]+/g);
    for (let cell of cells) {
      let row = parseInt(cell[0].match(/[0-9]+/)[0], 10) - 1;
      if (row >= content.length || row < 0) return invalid;
      let column = str2int(cell[0].match(/[A-Za-z]+/)[0]) - 1;
      if (column >= content[0].length || column < 0) return invalid;
      result.data.push({ row, column });
    }
    return result;
  };

  const add = (data, row, column) => {
    if (data[0].row === row && data[0].column === column) return error;
    let n1 = +valueof(content[data[0].row][data[0].column], row, column);
    if (isNaN(n1)) return error;

    if (data[1].row === row && data[1].column === column) return error;
    let n2 = +valueof(content[data[1].row][data[1].column], row, column);
    if (isNaN(n2)) return error;

    return n1 + n2;
  };

  const subtract = (data, row, column) => {
    if (data[0].row === row && data[0].column === column) return error;
    let n1 = +valueof(content[data[0].row][data[0].column], row, column);
    if (isNaN(n1)) return error;

    if (data[1].row === row && data[1].column === column) return error;
    let n2 = +valueof(content[data[1].row][data[1].column], row, column);
    if (isNaN(n2)) return error;

    return n1 - n2;
  };

  const sum = (data, row, column) => {
    if (data[0].row > data[1].row) return error;
    if (data[0].column > data[1].column) return error;
    let sum = 0;
    for (let i = data[0].row; i <= data[1].row; i++) {
      for (let j = data[0].column; j <= data[1].column; j++) {
        if (i === row && j === column) return error;
        let n = +valueof(content[i][j], row, column);
        if (isNaN(n)) return error;
        sum += n;
      }
    }
    return sum;
  };

  const valueof = (s, row, column) => {
    if (isFormula(s)) {
      if (/^=\s*[A-Za-z]+[0-9]+\s*\+\s*[A-Za-z]+[0-9]+\s*$/.test(s)) {
        let result = parseValidIndex(s);
        if (result.valid) {
          return add(result.data, row, column);
        } else return error;
      } else if (/^=\s*[A-Za-z]+[0-9]+\s*-\s*[A-Za-z]+[0-9]+\s*$/.test(s)) {
        let result = parseValidIndex(s);
        if (result.valid) {
          return subtract(result.data, row, column);
        } else return error;
      } else if (
        /^=\s*[Ss]um\s*\(\s*[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+\s*\)\s*$/.test(
          s
        )
      ) {
        let result = parseValidIndex(s);
        if (result.valid) {
          return sum(result.data, row, column);
        } else return error;
      } else return error;
    } else return s;
  };

  const checkValue = (row, column) => () => {
    let value = valueof(content[row][column], row, column);
    if (value === error) {
      setcontent((oldContent) => {
        let newContent = oldContent.map((e) => e.slice());
        newContent[row][column] = error;
        return newContent;
      });
    }
  };

  const copy = (row, column) => () => {
    setcopied({ row, column, value: content[row][column] });
  };

  const paste = (row, column) => () => {
    setcontent((oldContent) => {
      let newContent = oldContent.map((e) => e.slice());
      let value = copied.value;
      if (isFormula(value)) {
        let cells = copied.value.matchAll(/[A-Za-z]+[0-9]+/g);
        for (let cell of cells) {
          let originRow = cell[0].match(/[0-9]+/)[0];
          let originRowNum = parseInt(originRow, 10) - 1;
          let newRowNum = originRowNum + row - copied.row;
          if (newRowNum < 0 || newRowNum > content.length) {
            value = error;
            break;
          }
          // value = value.replace(originRow, "" + (newRowNum + 1));

          let originColumn = cell[0].match(/[A-Za-z]+/)[0];
          let originColumnNum = str2int(originColumn) - 1;
          let newColumnNum = originColumnNum + column - copied.column;
          if (newColumnNum < 0 || newColumnNum > content[0].length) {
            value = error;
            break;
          }
          value = value.replace(
            cell[0],
            int2str(newColumnNum + 1) + (newRowNum + 1)
          );
        }
        if (valueof(value, row, column) === error) value = error;
      }
      newContent[row][column] = value;
      return newContent;
    });
  };

  return (
    <div onClick={unfocus}>
      <div className="header">
        <div className="buttons_top">
          <button className="button_big button_top" onClick={addcolumn}>
            +
          </button>
          <button className="button_big button_top" onClick={deletecolumn}>
            -
          </button>
        </div>
      </div>
      <div className="section">
        <div className="left">
          <div className="buttons_left">
            <button className="button_big button_left" onClick={addrow}>
              +
            </button>
            <button className="button_big button_left" onClick={deleterow}>
              -
            </button>
          </div>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th className="table_left"></th>
                {content[0].map((e, idx) =>
                  idx === focus.column ? (
                    <th className="table_top selected" key={idx}>
                      {int2str(idx + 1)}
                    </th>
                  ) : (
                    <th className="table_top" key={idx}>
                      {int2str(idx + 1)}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {content.map((e, idx) => (
                <tr key={idx}>
                  {idx === focus.row ? (
                    <th className="table_left selected">{idx + 1}</th>
                  ) : (
                    <th className="table_left">{idx + 1}</th>
                  )}
                  {e.map((f, i) => (
                    <td key={`${idx}_${i}`}>
                      <input
                        type="text"
                        className="innertext"
                        value={
                          idx === focus.row &&
                          i === focus.column &&
                          focus.editing
                            ? f
                            : valueof(f, idx, i)
                        }
                        // value={f}
                        ref={
                          i === focus.column
                            ? idx === focus.row + 1
                              ? nextInput
                              : idx === focus.row
                              ? originInput
                              : null
                            : null
                        }
                        readOnly={
                          idx !== focus.row ||
                          i !== focus.column ||
                          !focus.editing
                        }
                        onClick={focusOn(idx, i)}
                        onDoubleClick={editOn(idx, i)}
                        onChange={handleChange(idx, i)}
                        onBlur={checkValue(idx, i)}
                        onCopy={copy(idx, i)}
                        onPaste={paste(idx, i)}
                        onKeyUp={onKeyUp(idx, i)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
