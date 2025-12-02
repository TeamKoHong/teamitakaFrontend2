import React from "react";
import "./RecruitingProjectCard.scss";
import { TbEyeFilled } from "react-icons/tb";
import { RiFileList2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const RecruitingProjectCard = ({ recruitment }) => {
  const navigate = useNavigate();

  if (!recruitment) return null;

  const {
    recruitment_id,
    title,
    description,
    recruitment_end,
  } = recruitment;

  // 숫자로 변환 (문자열로 올 수 있음)
  const views = Number(recruitment.views) || 0;
  const applicantCount = Number(recruitment.applicant_count) || 0;

  const handleClick = () => {
    navigate(`/recruitment/${recruitment_id}`);
  };

  // D-day 계산 및 표시 포맷
  const getDDayText = () => {
    if (!recruitment_end) return 'D-DAY';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거하고 날짜만 비교
    
    const endDate = new Date(recruitment_end);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'D-DAY';
    if (diffDays > 0) return `D-${diffDays}`;
    return '마감'; // 마감일이 지난 경우
  };

  return (
    <div className="recruiting-project-card">
      <div className="recruiting-card" onClick={handleClick}>
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
              <span>{applicantCount}</span>
            </div>
          </div>
          <span className="d-day">{getDDayText()}</span>
        </div>
      </div>
    </div>
  );
};

export default RecruitingProjectCard;

