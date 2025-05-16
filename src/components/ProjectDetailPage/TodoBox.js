import React, { useState } from "react";
import "./TodoBox.scss";

function TodoBox() {
  const [todos, setTodos] = useState([
    { id: 1, text: "지표 엑셀에 정리하기", checked: false },
    { id: 2, text: "자료 조사 및 분석하기", checked: false },
  ]);

  const toggle = (id) => {
    setTodos((list) =>
      list.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="todo-box-container">
      <h2>오늘의 할 일</h2>
      <div className="todo-box">
        <ul>
          {todos.map((item, idx) => (
            <li
              className={`todo-list ${item.checked ? "checked" : ""}`}
              key={item.id}
            >
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggle(item.id)}
                />
                <span className="todo-text">{item.text}</span>
                <span className="checkBox" />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoBox;
