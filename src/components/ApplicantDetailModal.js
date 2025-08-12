import React from "react";
import PentagonChart from "./Common/UI/PentagonChart";
import "./ApplicantDetailModal.scss";

const ApplicantDetailModal = ({ isOpen, onClose, applicant, onInvite }) => {
  if (!isOpen || !applicant) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 샘플 스킬 데이터 (실제로는 applicant 데이터에서 가져올 예정)
  const skills = {
    업무능력: 85,
    노력: 75,
    열정: 90,
    실력: 70,
    소통: 80
  };

  return (
    <div className="applicant-modal-overlay" onClick={handleOverlayClick}>
      <div className="applicant-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-content">
          {/* 프로필 섹션 */}
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={applicant.img} alt={applicant.name} />
            </div>
            <div className="profile-info">
              <h3 className="applicant-name">{applicant.name}</h3>
              <div className="experience-badge">3년차</div>
            </div>
          </div>

          {/* 소개 섹션 */}
          <div className="section-caption">소개</div>
          <div className="introduction">
            <p>
              안녕하세요! 저는 O O 프로젝트의 팀원이 되고 프로젝트를 성공적으로 완성하고 싶습니다. 미쳐...
            </p>
          </div>

          {/* 업무능력 차트 */}
          <div className="skills-section">
            <PentagonChart skills={skills} />
          </div>

          {/* 첨부 이력서 */}
          <div className="resume-section">
            <div className="resume-caption">첨부 이력서</div>
            <div className="resume-card">
              <div className="resume-texts">
                <div className="resume-title">이력서 제목</div>
                <div className="resume-sub">이력서 소개</div>
              </div>
              <div className="resume-arrow">›</div>
            </div>
          </div>

          {/* 팀원으로 초대하기 버튼 */}
          <button
            className="invite-button"
            onClick={() => {
              if (onInvite && applicant) {
                onInvite(applicant);
              }
              onClose();
            }}
          >
            
            팀원으로 초대하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;
