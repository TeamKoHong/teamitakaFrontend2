import React, { useState } from "react";
import "./TeamExperience.css";
import MinusIcon from "../assets/minus.png";
import PlusIcon from "../assets/plus.png";

export default function TeamExperience() {
  // ✅ 상태 추가
  const [count, setCount] = useState(0);

  // ✅ 증가/감소 함수 추가
  const increase = () => setCount(prev => prev + 1);
  const decrease = () => setCount(prev => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="team-exp-container">

      {/* 라벨 */}
      <div className="team-exp-label">나의 팀플 경험</div>

      {/* 입력 박스 */}
      <div className="team-exp-box">
        <span className="team-exp-text">팀플 경험 횟수</span>

        <div className="team-exp-counter">
          <img
            src={MinusIcon}
            alt="minus"
            className="team-exp-icon"
            onClick={decrease}        // ← 클릭 시 감소
          />

          {/* 숫자 표시 (00 형태 유지) */}
          <span className="team-exp-value">
            {String(count).padStart(2, "0")}
          </span>

          <img
            src={PlusIcon}
            alt="plus"
            className="team-exp-icon"
            onClick={increase}        // ← 클릭 시 증가
          />
        </div>

      </div>

    </div>
  );
}
