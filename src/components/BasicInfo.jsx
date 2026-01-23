import React from "react";
import "./BasicInfo.css";
import verifiedIcon from "../assets/university_verified.png";   // ← 반드시 이 파일명과 일치해야 함

<<<<<<< HEAD
export default function BasicInfo() {
=======
export default function BasicInfo({
  name = "김조형",
  email = "0000@school.com",
  university = "홍익대학교",
  showVerified = true
}) {
>>>>>>> main
  return (
    <div className="basic-info-container">
      <div className="section-title">기본정보</div>

      <div className="info-row">
        <span className="info-label">이름
             <span className="required-dot" />
        </span>
<<<<<<< HEAD
        <span className="info-value">김조형</span>
=======
        <span className="info-value">{name}</span>
>>>>>>> main
      </div>

      <div className="info-row">
        <span className="info-label">이메일주소</span>
<<<<<<< HEAD
        <span className="info-value">0000@school.com</span>
=======
        <span className="info-value">{email}</span>
>>>>>>> main
      </div>

      <div className="info-row">
        <span className="info-label">학교</span>
        <span className="info-value">
<<<<<<< HEAD
          홍익대학교
          <img src={verifiedIcon} alt="" className="verified-icon" />
=======
          {university}
          {showVerified && (
            <img src={verifiedIcon} alt="" className="verified-icon" />
          )}
>>>>>>> main
        </span>
      </div>
    </div>
  );
}
