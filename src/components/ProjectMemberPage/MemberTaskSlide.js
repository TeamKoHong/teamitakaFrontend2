// src/components/MemberTaskSlide/MemberTaskSlide.jsx
import React, { useState } from "react";
import DefaultHeader from "../Common/DefaultHeader";
import MemberDetailCard from "./MemberDetailCard"; // 기존 카드 컴포넌트
import "./MemberTaskSlide.scss";

export default function MemberTaskSlide({ open, member, onClose }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleComplete = () => {
    // 완료 버튼 클릭 시 편집 모드 종료
    setIsEditing(false);
  };

  const handleClose = () => {
    // 슬라이드 닫을 때 편집 모드도 초기화
    setIsEditing(false);
    onClose();
  };

  return (
    <>
      {/* 1) 오버레이 */}
      <div className={`mts-overlay ${open ? "open" : ""}`} onClick={handleClose} />

      {/* 2) 사이드 패널 */}
      <div className={`mts-panel ${open ? "open" : ""}`}>
        {/* 헤더: 편집 모드일 때 완료 버튼 표시 */}
        <DefaultHeader 
          title="팀원 정보 편집" 
          showChat={false} 
          onBack={handleClose}
          rightElement={
            isEditing ? (
              <button 
                className="header-complete-btn"
                onClick={handleComplete}
              >
                완료
              </button>
            ) : null
          }
        />

        {/* 상세 카드 */}
        <div className="mts-content">
          <MemberDetailCard 
            member={member} 
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </>
  );
}
