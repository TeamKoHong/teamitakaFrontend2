// src/components/MemberTaskSlide/MemberTaskSlide.jsx
import React from "react";
import DefaultHeader from "../Common/DefaultHeader";
import MemberDetailCard from "./MemberDetailCard"; // 기존 카드 컴포넌트
import "./MemberTaskSlide.scss";

export default function MemberTaskSlide({ open, member, onClose }) {
  return (
    <>
      {/* 1) 오버레이 */}
      <div className={`mts-overlay ${open ? "open" : ""}`} onClick={onClose} />

      {/* 2) 사이드 패널 */}
      <div className={`mts-panel ${open ? "open" : ""}`}>
        {/* 헤더: 뒤로가기 아이콘 눌러도 onClose */}
        <DefaultHeader title="팀원 업무" showChat={false} onBack={onClose} />

        {/* 상세 카드 */}
        <div className="mts-content">
          <MemberDetailCard member={member} />
        </div>
      </div>
    </>
  );
}
