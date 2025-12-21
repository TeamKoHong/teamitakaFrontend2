import React from "react";
import "./MainProjectCard.scss";

const MainProjectCard = ({ project, onClick }) => {
  // 여기 필드명은 너희 프로젝트 데이터에 맞게 바꿔서 연결해야 함
  const title = project?.title || project?.name || project?.project_name || "프로젝트명";
  const start = project?.startDate || project?.start_date || project?.start || "";
  const end = project?.endDate || project?.end_date || project?.end || "";
  const meetingTime = project?.meetingTime || project?.meeting_time || "회의 시간 미정";

  // 썸네일(이미지)도 필드에 맞게끔 바꿔서 연결해야함
  const thumbnail =
    project?.thumbnailUrl ||
    project?.thumbnail_url ||
    project?.imageUrl ||
    project?.image_url ||
    project?.coverImage ||
    project?.cover_image ||
    "";

  const periodText =
    start && end ? `${start} ~ ${end}` : start ? `${start}` : "프로젝트 기간";

  return (
    <button type="button" className="main-project-card" onClick={onClick}>
      <div className="card-left">
        {/* 이미지 영역 */}
        <div className="thumb">
          {thumbnail ? (
            <img src={thumbnail} alt={`${title} 썸네일`} />
          ) : (
            <div className="thumb-placeholder" aria-hidden />
          )}
        </div>

        <div className="info">
          <div className="title-row">
            <h3 className="title">{title}</h3>
            <span className="update-dot" aria-label="업데이트됨" />
          </div>

          <div className="meta">
            <div className="meta-row">
              <span className="meta-icon" aria-hidden>📅</span>
              <span className="meta-text">{periodText}</span>
            </div>
            <div className="meta-row">
              <span className="meta-icon" aria-hidden>⏰</span>
              <span className="meta-text">{meetingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* D-day */}
      <div className="card-right">
        <div className="d-day">D-07</div>
      </div>
    </button>
  );
};

export default MainProjectCard;
