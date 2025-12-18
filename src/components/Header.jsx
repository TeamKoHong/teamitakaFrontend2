import React from "react";
import "./Header.css";
import BackIcon from "../assets/back.png";

export default function Header({ title = "프로필 편집", onBack, rightAction }) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // 기본 동작: 브라우저 히스토리 뒤로가기
      window.history.back();
    }
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <img
          src={BackIcon}
          className="back-icon"
          alt="back"
          onClick={handleBack}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <h1 className="header-title">{title}</h1>
      <div className="header-right">
        {rightAction}
      </div>
    </div>
  );
}
