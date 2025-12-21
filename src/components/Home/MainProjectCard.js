import React from "react";
import "./MainProjectCard.scss";
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5"; 

function formatDate(dateStr) {
  if (!dateStr) return "";
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff > 0) return `D-${String(diff).padStart(2, "0")}`;
  if (diff === 0) return "D-DAY";
  return `D+${String(Math.abs(diff)).padStart(2, "0")}`;
}

const MainProjectCard = ({ project, onClick }) => {
  const title = project?.title || project?.name || project?.project_name || "프로젝트명";

  const start = project?.startDate || project?.start_date || project?.start || "";
  const end = project?.endDate || project?.end_date || project?.end || "";

  const meetingTime = project?.meetingTime || project?.meeting_time || "고정 회의 시간";

  const thumbnail =
    project?.thumbnailUrl ||
    project?.thumbnail_url ||
    project?.imageUrl ||
    project?.image_url ||
    project?.coverImage ||
    project?.cover_image ||
    "";

  const periodText =
    start && end ? `${formatDate(start)} ~ ${formatDate(end)}` : start ? `${formatDate(start)}` : "프로젝트 기간";

  const ddayText = calcDDay(end);

  return (
    <button type="button" className="main-project-card" onClick={onClick}>
      <div className="thumb">
        {thumbnail ? <img src={thumbnail} alt={`${title} 썸네일`} /> : <div className="thumb-placeholder" aria-hidden />}
      </div>

      <div className="body">
        <div className="left">
          <h3 className="title">{title}</h3>

          {/* ✅ 여기부터 아이콘 교체 + 정렬 안정 구조 */}
          <div className="meta">
            <div className="meta-row">
              <IoCalendarOutline className="meta-icon" aria-hidden />
              <span className="meta-text">{periodText}</span>
            </div>

            <div className="meta-row">
              <IoTimeOutline className="meta-icon" aria-hidden />
              <span className="meta-text">{meetingTime}</span>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="d-day">{ddayText}</div>
        </div>
      </div>
    </button>
  );
};

export default MainProjectCard;
