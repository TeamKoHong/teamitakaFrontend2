import React from "react";
import "./RecruitingProject.scss";
import { TbEyeFilled } from "react-icons/tb";
import { RiFileList2Fill } from "react-icons/ri";
import avatar1 from "../assets/icons/avatar1.png";
import avatar2 from "../assets/icons/avatar2.png";
import avatar3 from "../assets/icons/avatar3.png";
import avatar4 from "../assets/icons/avatar4.png";

const RecruitingProject = ({ recruitment, onSelectTeam }) => {
  if (!recruitment) return null;

  const {
    title,
    description,
    views = 0,
    applicant_count = 0,
    recruitment_end,
  } = recruitment;

  // D-day 계산
  const getDDayText = () => {
    if (!recruitment_end) return 'D-DAY';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(recruitment_end);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'D-DAY';
    if (diffDays > 0) return `D-${diffDays}`;
    return '마감';
  };

  // 더미 아바타 (실제로는 API에서 지원자 아바타를 가져와야 함)
  const dummyAvatars = [avatar1, avatar2, avatar3, avatar4];

  return (
    <div className="recruiting-project-container">
      <div className="recruiting-card">
        <h3>{title || '프로젝트명'}</h3>
        <p className="description">
          {description || '프로젝트 설명이 없습니다.'}
        </p>
        <div className="info">
          <div className="info-left">
            <div className="views">
              <TbEyeFilled className="info-view-icon" />
              <span>{views}</span>
            </div>
            <div className="comments">
              <RiFileList2Fill className="info-icon" />
              <span>{applicant_count}</span>
            </div>
          </div>
          <span className="d-day">{getDDayText()}</span>
        </div>
      </div>

      <div className="apply-status">
        <p className="apply-count">{title || '모집 중인 프로젝트명'}</p>
        <h2>{applicant_count}명</h2>
        <p className="apply-desc">
          총 <span className="highlight">{applicant_count}명</span>의 지원서가 도착했어요!
        </p>
        <div className="avatars">
          {dummyAvatars.slice(0, Math.min(4, Number(applicant_count))).map((avatar, idx) => (
            <img key={idx} src={avatar} alt={`avatar ${idx + 1}`} />
          ))}
        </div>
      </div>

      <button className="team-btn" onClick={onSelectTeam}>
        팀원 선정하러 가기
      </button>
    </div>
  );
};

export default RecruitingProject;
