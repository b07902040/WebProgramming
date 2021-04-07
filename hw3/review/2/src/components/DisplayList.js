import React, { useState } from "react";
import TodoLine from "./TodoLine";
import Footer from "./Footer";

export default function DisplayList() {
  const [list, setList] = useState([]);
  const [option, setOption] = useState("All");
  const [text, setText] = useState("");

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      setList((pre) => {
        const preList = [...pre];
        preList.push({
          uniCode:
            preList.length > 0 ? preList[preList.length - 1].uniCode + 1 : 0,
          content: e.target.value,
          checked: false,
        });
        return preList;
      });
      setText("");
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
  };

  const mappingList = (arr) =>
    arr.map(({ uniCode, checked, content }, index) => {
      const tag = `todo-${uniCode}`;
      if (option === "Active") {
        if (checked !== false) return null;
      }
      if (option === "Completed") {
        if (checked !== true) return null;
      }
      return (
        <TodoLine
          key={tag}
          tag={tag}
          index={index}
          checked={checked}
          content={content}
          setList={setList}
        />
      );
    });

  const uncompletedNumber = list.filter((element) => element.checked === false)
    .length;
  const completedNumber = list.length - uncompletedNumber;

  return (
    <>
      <section className="todo-app__main">
        <input
          className="todo-app__input"
          placeholder="What needs to be done?"
          onKeyUp={handleKeyUp}
          value={text}
          onChange={handleInput}
        />
        <ul className="todo-app__list" id="todo-list">
          {mappingList(list)}
        </ul>
      </section>
      {list.length ? (
        <Footer
          completedNumber={completedNumber}
          uncompletedNumber={uncompletedNumber}
          setOption={setOption}
          setList={setList}
        />
      ) : null}
    </>
  );
}
