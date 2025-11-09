import React, { useState } from "react";
import { ReactComponent as EditIcon } from "../../assets/icons/editIcon.svg";
import "./MemberDetailCard.scss";
import avatar1 from "../../assets/icons/avatar1.png";
// import UnderArrow from "../Common/UI/UnderArrow"; // 현재 사용 안 함

export default function MemberDetailCard({ member }) {
  const [isEditing, setIsEditing] = useState(false);
  const [memberData, setMemberData] = useState({
    name: "팀원명",
    role: "담당파트명",
    responsibility: "조장",
    tasks: "디자인, 발표"
  });

  // const handleClick = () => {
  //   // 타임라인 열기 로직
  //   console.log("타임라인 열기");
  // };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setMemberData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="member-detail-card">
      <button className="edit-btn" onClick={handleEditToggle}>
        <EditIcon />
      </button>
      <div className="avatar-wrapper">
        <img src={avatar1} alt="이미지" className="avatar-large" />
      </div>
      <p className="member-name">{memberData.name}</p>
      <p className="member-role">{memberData.role}</p>

      <ul className="member-meta">
        <li>
          <span className="meta-label">담당 역할</span>
          <span 
            className={`meta-value ${isEditing ? 'editable' : ''}`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInputChange('responsibility', e.target.textContent)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
              }
            }}
          >
            {memberData.responsibility}
          </span>
        </li>
        <li>          
          <span className="meta-label">담당 업무</span>
          <span 
            className={`meta-value ${isEditing ? 'editable' : ''}`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleInputChange('tasks', e.target.textContent)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
              }
            }}
          >
            {memberData.tasks}
          </span>
        </li>
      </ul>

      
      
      {/* 여기 아래에 실제 타임라인 컴포넌트를 조건부로 렌더하면 됩니다 */}
    </div>
  );
}
