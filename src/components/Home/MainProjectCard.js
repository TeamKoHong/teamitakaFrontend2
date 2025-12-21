import React from "react";
import "./MainProjectCard.scss";

function formatDate(dateStr) {
  if (!dateStr) return "";
  // "2025-12-20T00:00:00.000Z" -> "2025.12.20"
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function calcDDay(endStr) {
  if (!endStr) return "D-??";
  const end = new Date(endStr);
  if (Number.isNaN(end.getTime())) return "D-??";

  // 날짜 단위로 계산 (시간 영향 최소화)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff > 0) return `D-${String(diff).padStart(2, "0")}`;
  if (diff === 0) return "D-DAY";
  return `D+${String(Math.abs(diff)).padStart(2, "0")}`;
}

const MainProjectCard = ({ project, onClick }) => {
  // 필드 연결
  const title =
    project?.title ||
    project?.name ||
    project?.project_name ||
    "프로젝트명";

  const start =
    project?.startDate ||
    project?.start_date ||
    project?.start ||
    "";

  const end =
    project?.endDate ||
    project?.end_date ||
    project?.end ||
    "";

  const meetingTime =
    project?.meetingTime ||
    project?.meeting_time ||
    "고정 회의 시간";

  const thumbnail =
    project?.thumbnailUrl ||
    project?.thumbnail_url ||
    project?.imageUrl ||
    project?.image_url ||
    project?.coverImage ||
    project?.cover_image ||
    "";

  const periodText =
    start && end
      ? `${formatDate(start)} ~ ${formatDate(end)}`
      : start
      ? `${formatDate(start)}`
      : "프로젝트 기간";

  const ddayText = calcDDay(end);

  return (
    <button type="button" className="main-project-card" onClick={onClick}>
      {/* 썸네일: 위쪽 크게 */}
      <div className="thumb">
        {thumbnail ? (
          <img src={thumbnail} alt={`${title} 썸네일`} />
        ) : (
          <div className="thumb-placeholder" aria-hidden />
        )}
      </div>

      {/* 아래 정보 영역 */}
      <div className="body">
        <div className="left">
          <h3 className="title">{title}</h3>

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

        {/* D-day: 오른쪽 원형 */}
        <div className="right">
          <div className="d-day">{ddayText}</div>
        </div>
      </div>
    </button>
  );
};

export default MainProjectCard;
