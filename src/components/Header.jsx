import React from "react";
import "./Header.css";
import BackIcon from "../assets/back.png";

export default function Header() {
  return (
    <div className="header-container">
      <img src={BackIcon} className="back-icon" alt="back" />
      <h1 className="header-title">프로필 편집</h1>
    </div>
  );
}
