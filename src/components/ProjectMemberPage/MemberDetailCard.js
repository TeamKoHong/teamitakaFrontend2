import React from "react";
import { ReactComponent as EditIcon } from "../../assets/icons/editIcon.svg";
import "./MemberDetailCard.scss";
import avatar1 from "../../assets/icons/avatar1.png";
import UnderArrow from "../Common/UI/UnderArrow";
export default function MemberDetailCard({ member }) {
  const handleClick = () => {
    // 타임라인 열기 로직
    console.log("타임라인 열기");
  };

  return (
    <div className="member-detail-card">
      <button className="edit-btn">
        <EditIcon />
      </button>
      <div className="avatar-wrapper">
        <img src={avatar1} alt="이미지" className="avatar-large" />
      </div>
      <p className="member-name">팀원명</p>
      <p className="member-role">담당파트명</p>

      <ul className="member-meta">
        <li>
          <div className="square" />
          <span className="meta-label">담당 역할</span>
          <span className="meta-value">조장</span>
        </li>
        <li>
          <div className="square" />
          <span className="meta-label">담당 업무</span>
          <span className="meta-value">디자인, 발표</span>
        </li>
      </ul>

      {/* 예: 타임라인 토글 */}
      <div className="timeline-toggle">
        <p>업무 타임라인 확인하기 </p>
        <div className="toggle-btn">
          <UnderArrow onClick={handleClick} />
        </div>
      </div>
      {/* 여기 아래에 실제 타임라인 컴포넌트를 조건부로 렌더하면 됩니다 */}
    </div>
  );
}
