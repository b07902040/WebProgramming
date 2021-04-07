import React from "react";

export default function Footer({
  completedNumber,
  uncompletedNumber,
  setOption,
  setList,
}) {
  const handleClear = () => {
    setList((pre) => {
      const preList = [...pre];
      return preList.filter((element) => element.checked !== true);
    });
  };

  return (
    <footer className="todo-app__footer" id="todo-footer">
      <div className="todo-app__total">{uncompletedNumber} left</div>
      <ul className="todo-app__view-buttons">
        <button type="button" onClick={() => setOption("All")}>
          All
        </button>
        <button type="button" onClick={() => setOption("Active")}>
          Active
        </button>
        <button type="button" onClick={() => setOption("Completed")}>
          Completed
        </button>
      </ul>
      {completedNumber ? (
        <div className="todo-app__clean">
          <button type="button" onClick={handleClear}>
            Clear completed
          </button>
        </div>
      ) : null}
    </footer>
  );
}
