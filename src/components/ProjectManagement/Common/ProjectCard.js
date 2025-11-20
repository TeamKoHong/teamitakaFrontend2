import React from "react";
import "./ProjectCard.scss";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import CircularProgress from "../../Common/CircularProgress";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  if (!project) return null;
  const {
    project_id,
    title,
    start_date,
    end_date,
    meeting_time,
    updated_at,
    progress_percent
  } = project;

  const period = start_date && end_date ? `${start_date} ~ ${end_date}` : "프로젝트 기간 미정";
  const meetingTimeDisplay = meeting_time || "회의 시간 미정";
  const progressValue = Number(progress_percent) || 0;

  return (
    <div
      className="project-card"
      onClick={() => navigate(`/project/${project_id}`)}
    >
      <div className="card-content">
        {/* 프로젝트 정보 */}
        <div className="info">
          <h3 className="title">{title || '프로젝트명'}</h3>
        </div>

        <div className="details">
          <p>
            <IoCalendarOutline className="details-icon" /> {period}
          </p>
          <p>
            <IoTimeOutline className="details-icon" /> {meetingTimeDisplay}
          </p>
        </div>

        {/* 팀원 리스트: 서버가 제공 시 추후 적용 */}
        <div className="team">
        </div>
      </div>

      {/* D-Day 원형 프로그레스 */}
      <div className="projectCard-right">
        <p className="time-ago">
          {updated_at ? '업데이트됨' : ''} <span className="dot" />
        </p>
        <CircularProgress percentage={progressValue} />
      </div>
    </div>
  );
};

export default ProjectCard;
