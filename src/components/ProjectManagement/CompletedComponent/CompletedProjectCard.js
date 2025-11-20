import React from 'react';
import { IoCalendarOutline } from 'react-icons/io5';
import { formatDateRange } from '../../../utils/dateUtils';
import './CompletedProjectCard.scss';

// 더미 아바타 이미지 (실제 프로젝트에서는 API에서 가져올 수 있음)
const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
];

const CompletedProjectCard = ({ project, onClick }) => {
  const isPending = project.evaluation_status === 'PENDING';

  // 날짜 범위 생성 (API에 start_date, end_date가 없으면 더미 사용)
  const dateRange = formatDateRange(project.start_date, project.end_date) || '2025.01.23 - 2025.02.01';

  // 팀원 아바타 (API에 members 정보가 없으므로 더미 사용)
  const memberAvatars = project.members || DEFAULT_AVATARS;

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

      <div className="card-content">
        <div className="project-info">
          <h3 className="project-title">{project.title}</h3>

          <div className="date-row">
            <IoCalendarOutline className="calendar-icon" />
            <span className="date-text">{dateRange}</span>
          </div>
        </div>

        <div className="team-avatars">
          {memberAvatars.slice(0, 2).map((avatar, index) => (
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
