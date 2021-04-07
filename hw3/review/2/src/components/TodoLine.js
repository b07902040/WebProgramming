import React, { useState } from "react";

export default function TodoLine({ tag, index, checked, content, setList }) {
  const handleRemove = () => {
    setList((pre) => {
      const preList = [...pre];
      preList.splice(index, 1);
      return preList;
    });
  };

  return (
    <li className="todo-app__item">
      <div className="todo-app__checkbox">
        <input
          type="checkbox"
          defaultChecked={checked}
          onChange={() =>
            setList((pre) => {
              const preList = [...pre];
              preList[index].checked = !preList[index].checked;
              return preList;
            })
          }
          id={tag}
        />
        <label htmlFor={tag} />
      </div>
      <h1
        className={`todo-app__item-detail${
          checked ? " todo-app_detial_checked" : ""
        }`}
      >
        {content}
      </h1>
      <img
        src="/img/x.png"
        className="todo-app__item-x"
        alt="cancel"
        onClick={handleRemove}
      />
    </li>
  );
}
