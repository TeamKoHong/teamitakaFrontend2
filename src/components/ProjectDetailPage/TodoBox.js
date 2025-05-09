import React from "react";
import "./TodoBox.scss";
function todoBox() {
  return (
    <div className="todo-box-container">
      <h2>오늘의 할일</h2>
      <div className="todo-box">
        <ul>
          <li className="todo-list">
            <p>지표 엑셀에 정리하기</p>
            <div className="checkBox" />
          </li>
          <li className="todo-list">
            <p>지표 자료 및 분석하기</p>
            <div className="checkBox" />
          </li>
        </ul>
      </div>
    </div>
  );
}
export default todoBox;
