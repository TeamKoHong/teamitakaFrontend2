import React, { useState } from "react";
import "./InterestKeywords.css";
import PlusOrange from "../assets/plus_orange.png";

<<<<<<< HEAD
export default function InterestKeywords() {
  const [keywords, setKeywords] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

=======
export default function InterestKeywords({ value, onChange }) {
  // 내부 상태 (props 없을 때 사용 - 기존 동작 유지)
  const [internalKeywords, setInternalKeywords] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // controlled vs uncontrolled 모드 판단
  const isControlled = value !== undefined && onChange !== undefined;
  const currentKeywords = isControlled ? value : internalKeywords;

>>>>>>> main
  const handleAddClick = () => {
    setInputVisible(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
<<<<<<< HEAD
      setKeywords([...keywords, inputValue.trim()]);
=======
      const newKeywords = [...currentKeywords, inputValue.trim()];
      if (isControlled) {
        onChange(newKeywords);
      } else {
        setInternalKeywords(newKeywords);
      }
>>>>>>> main
      setInputValue("");
      setInputVisible(false);
    }
  };

<<<<<<< HEAD
=======
  const handleRemoveKeyword = (indexToRemove) => {
    const newKeywords = currentKeywords.filter((_, idx) => idx !== indexToRemove);
    if (isControlled) {
      onChange(newKeywords);
    } else {
      setInternalKeywords(newKeywords);
    }
  };

>>>>>>> main
  return (
    <div className="interest-container">

      <div className="interest-label">관심 영역 키워드</div>

      {/* 키워드 리스트 + 입력창 + 기존 버튼 */}
      <div className="keyword-row">

        {/* 키워드들 */}
<<<<<<< HEAD
        {keywords.map((kw, idx) => (
          <div key={idx} className="keyword-pill">
=======
        {currentKeywords.map((kw, idx) => (
          <div
            key={idx}
            className="keyword-pill"
            onClick={() => handleRemoveKeyword(idx)}
            style={{ cursor: 'pointer' }}
            title="클릭하여 삭제"
          >
>>>>>>> main
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
