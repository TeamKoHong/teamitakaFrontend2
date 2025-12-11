import React, { useState } from "react";
import "./InterestKeywords.css";
import PlusOrange from "../assets/plus_orange.png";

export default function InterestKeywords() {
  const [keywords, setKeywords] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAddClick = () => {
    setInputVisible(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setKeywords([...keywords, inputValue.trim()]);
      setInputValue("");
      setInputVisible(false);
    }
  };

  return (
    <div className="interest-container">

      <div className="interest-label">관심 영역 키워드</div>

      {/* 키워드 리스트 + 입력창 + 기존 버튼 */}
      <div className="keyword-row">

        {/* 키워드들 */}
        {keywords.map((kw, idx) => (
          <div key={idx} className="keyword-pill">
            {kw}
          </div>
        ))}

        {/* 입력창 */}
        {inputVisible && (
          <input
            className="keyword-input"
            placeholder="입력 후 엔터"
            value={inputValue}
            autoFocus
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}

        {/* + 버튼 (맨 끝 고정) */}
        <button className="interest-add-btn" onClick={handleAddClick}>
          <img src={PlusOrange} alt="add" className="interest-plus-icon" />
        </button>

      </div>
    </div>
  );
}
