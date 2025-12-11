import React from "react";
import "./MajorInput.css";

export default function MajorInput() {
  return (
    <div className="major-container">

      <div className="major-header">
        <div className="major-label-wrapper">
          <span className="major-label">학과</span>
          <span className="major-required-dot"></span>
        </div>

        <button className="major-add-btn">+ 전공 추가</button>
      </div>

      <div className="major-input-wrapper">
  <input
    type="text"
    className="major-input"
    placeholder="전공을 입력해주세요."
  />
</div>


    </div>
  );
}
