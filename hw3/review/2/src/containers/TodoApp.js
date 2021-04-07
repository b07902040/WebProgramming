import React from "react";
import Header from "../components/Header";
import DisplayList from "../components/DisplayList";

export default function TodoApp() {
  return (
    <>
      <Header text="todos" />
      <DisplayList />
    </>
  );
}
