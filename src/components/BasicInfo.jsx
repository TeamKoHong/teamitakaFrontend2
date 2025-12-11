import React from "react";
import "./BasicInfo.css";
import verifiedIcon from "../assets/university_verified.png";   // ← 반드시 이 파일명과 일치해야 함

export default function BasicInfo() {
  return (
    <div className="basic-info-container">
      <div className="section-title">기본정보</div>

      <div className="info-row">
        <span className="info-label">이름
             <span className="required-dot" />
        </span>
        <span className="info-value">김조형</span>
      </div>

      <div className="info-row">
        <span className="info-label">이메일주소</span>
        <span className="info-value">0000@school.com</span>
      </div>

      <div className="info-row">
        <span className="info-label">학교</span>
        <span className="info-value">
          홍익대학교
          <img src={verifiedIcon} alt="" className="verified-icon" />
        </span>
      </div>
    </div>
  );
}
