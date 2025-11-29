import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import './CompletedProjectCard.scss';

// 더미 아바타 이미지 (실제 프로젝트에서는 API에서 가져올 수 있음)
const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
];

const CompletedProjectCard = ({ project, onClick }) => {
  const isPending = project.evaluation_status === 'PENDING';

  // 팀원 아바타 (API에 members 정보가 없으므로 더미 사용)
  const memberAvatars = project.members || DEFAULT_AVATARS;

  // 프로젝트 설명 (없으면 기본 텍스트)
  const description = project.description || '프로젝트 설명이 들어갑니다.';

  return (
    <div
      className="completed-project-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
    >
      {isPending && (
        <div className="evaluation-badge">상호평가 진행 전</div>
      )}

      {/* 상단 영역: 제목 + 화살표 */}
      <div className="card-header">
        <h3 className="project-title">{project.title}</h3>
        <IoChevronForward className="arrow-icon" />
      </div>

      {/* 설명 텍스트 */}
      <p className="project-description">{description}</p>

      {/* 하단 영역: 프로필 이미지 */}
      <div className="card-footer">
        <div className="team-avatars">
          {memberAvatars.slice(0, 4).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`팀원 ${index + 1}`}
              className="avatar"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedProjectCard;
