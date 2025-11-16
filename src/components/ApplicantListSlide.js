import React, { useRef, useState } from "react";
import DefaultHeader from "./Common/DefaultHeader";
import ApplicantDetailModal from "./ApplicantDetailModal";
import avatar1 from "../assets/icons/avatar1.png";
import avatar2 from "../assets/icons/avatar2.png";
import avatar3 from "../assets/icons/avatar3.png";
import avatar4 from "../assets/icons/avatar4.png";
import "./ApplicantListSlide.scss";

const applicants = [
  { id: 1, name: "지원자1", img: avatar1 },
  { id: 2, name: "지원자2", img: avatar2 },
  { id: 3, name: "지원자3", img: avatar3 },
  { id: 4, name: "지원자4", img: avatar4 },
  { id: 5, name: "지원자5", img: avatar1 },
  { id: 6, name: "지원자6", img: avatar2 },
  { id: 7, name: "지원자7", img: avatar3 },
  { id: 8, name: "지원자8", img: avatar4 },
  { id: 9, name: "지원자9", img: avatar1 },
  { id: 10, name: "지원자10", img: avatar2 },
  { id: 11, name: "지원자11", img: avatar3 },
  { id: 12, name: "지원자12", img: avatar4 },
  { id: 13, name: "지원자13", img: avatar1 },
  { id: 14, name: "지원자14", img: avatar2 },
  { id: 15, name: "지원자15", img: avatar3 },
  { id: 16, name: "지원자16", img: avatar4 },
  { id: 17, name: "지원자17", img: avatar1 },
  { id: 18, name: "지원자18", img: avatar2 },
  { id: 19, name: "지원자19", img: avatar3 },
  { id: 20, name: "지원자20", img: avatar4 },
  { id: 21, name: "지원자21", img: avatar1 },
  { id: 22, name: "지원자22", img: avatar2 },
  { id: 23, name: "지원자23", img: avatar3 },
  { id: 24, name: "지원자24", img: avatar4 },

];

export default function ApplicantListSlide({ open, onClose }) {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const contentRef = useRef(null);

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleInvite = (applicant) => {
    setSelectedTeamMembers((prev) => {
      const exists = prev.some((m) => m.id === applicant.id);
      if (exists) return prev; // 중복 방지
      return [...prev, applicant];
    });
    setIsModalOpen(false);
    setSelectedApplicant(null);
    // 상단 배너가 바로 보이도록 스크롤 업
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const hasSelection = selectedTeamMembers.length > 0;

  return (
    <>
      <div className={`als-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`als-panel ${open ? "open" : ""}`}>
        <DefaultHeader title="프로젝트 지원자 목록" onBack={onClose} />
        <div className="als-content" ref={contentRef}>
          {hasSelection ? (
            <div className="selected-banner">
              <p className="selected-title">[모집자]님이 선정했어요.</p>
              <p className="selected-sub">함께하게 될 팀원들이에요!</p>
              <div className="selected-avatars">
                {selectedTeamMembers.map((m) => (
                  <div className="selected-avatar" key={`selected-${m.id}`}>
                    <img src={m.img} alt={m.name} />
                    <p>{m.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="description">지원자 목록에서 함께 할 팀원을 선정해주세요.</p>
          )}
          <hr />
          <p className="highlight-text">
            <span className="project-name">[프로젝트명]</span>에 지원한 <br />
            <span className="red">예비 팀원 목록</span>이에요.
          </p>
          <div className="avatars-container">
            <div className="avatars-grid">
               {applicants.map((a) => {
                 const isSelected = selectedTeamMembers.some((m) => m.id === a.id);
                 return (
                   <div
                     key={a.id}
                     className={`avatar-card ${isSelected ? "selected" : ""}`}
                     onClick={() => handleApplicantClick(a)}
                   >
                     <img src={a.img} alt={a.name} />
                     <p>{a.name}</p>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
        <div className="bottom-fixed-button">
          <button className={`select-team-button ${hasSelection ? "active" : ""}`}>
            {hasSelection ? "프로젝트 시작하기!" : "함께 할 팀원을 선정하세요."}
          </button>
        </div>
      </div>
      
      {/* 지원자 상세 모달 */}
      <ApplicantDetailModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        applicant={selectedApplicant}
        onInvite={handleInvite}
      />
    </>
  );
}
