import React from "react";
import "./ProjectCard.scss";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline, IoTimeOutline, IoPeopleOutline } from "react-icons/io5";
import CircularProgress from "../../Common/CircularProgress";
import { formatDateRange, getRelativeTime } from "../../../utils/dateFormat";

const ProjectCard = ({ project, type = "project" }) => {
  const navigate = useNavigate();
  if (!project) return null;

  // Use explicit type prop to determine navigation
  const isRecruitment = type === "recruitment";
  const id = isRecruitment ? project.recruitment_id : project.project_id;
  const {
    title,
    start_date,
    end_date,
    recruitment_start,
    recruitment_end,
    meeting_time,
    last_feed_at,
    progress_percent,
    applicant_count
  } = project;

  // Use recruitment dates if available, otherwise use project dates
  const startDate = recruitment_start || start_date;
  const endDate = recruitment_end || end_date;

  // Format dates for display
  const formattedPeriod = formatDateRange(startDate, endDate);
  const period = formattedPeriod ||
                 (isRecruitment ? "모집 기간 미정" : "프로젝트 기간 미정");
  const meetingTimeDisplay = meeting_time || "회의 시간 미정";
  const progressValue = Number(progress_percent) || 0;

  const handleClick = () => {
    if (isRecruitment) {
      navigate(`/recruitment/${id}/team-select`);
    } else {
      navigate(`/project/${id}`);
    }
  };

  return (
    <div
      className="project-card"
      onClick={handleClick}
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
          {isRecruitment && (
            <p className="applicant-info">
              <IoPeopleOutline className="details-icon" /> {applicant_count || 0}명 지원
            </p>
          )}
        </div>

        {/* 팀원 리스트: 서버가 제공 시 추후 적용 */}
        <div className="team">
        </div>
      </div>

      {/* D-Day 원형 프로그레스 */}
      <div className="projectCard-right">
        {last_feed_at && (
          <p className="time-ago">
            {getRelativeTime(last_feed_at)}
          </p>
        )}
        <CircularProgress percentage={progressValue} />
      </div>
    </div>
  );
};

export default ProjectCard;
