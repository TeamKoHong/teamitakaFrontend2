import React from "react";
import "./ProjectCard.scss";

// 아이콘 라이브러리 (react-icons) 사용
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";

// 원형 프로그레스 바
const CircularProgress = ({ percentage }) => {
  const radius = 18;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* 배경 원 */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#eee"
        strokeWidth={strokeWidth}
      />
      {/* 진행 바 */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#ff4d4f"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      {/* D-Day 텍스트 */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="0.75rem"
        fontWeight="bold"
        fill="#ff4d4f"
      >
        D-07
      </text>
    </svg>
  );
};

const ProjectCard = () => {
  return (
    <div className="project-card">
      <div className="card-content">
        {/* 프로젝트 정보 */}
        <div className="info">
          <h3 className="title">프로젝트명</h3>
          <p className="time-ago">
            2시간 전 <span className="dot" />
          </p>
        </div>

        <div className="details">
          <p>
            <IoCalendarOutline /> 프로젝트 기간
          </p>
          <p>
            <IoTimeOutline /> 고정 회의 시간
          </p>
        </div>

        {/* 팀원 리스트 */}
        <div className="team">
          <div className="member" style={{ backgroundColor: "#ddd" }} />
          <div
            className="member"
            style={{ backgroundColor: "#bbb", left: "1rem" }}
          />
          <div
            className="member"
            style={{ backgroundColor: "#999", left: "2rem" }}
          />
          <div
            className="member"
            style={{ backgroundColor: "#777", left: "3rem" }}
          />
        </div>
      </div>

      {/* D-Day 원형 프로그레스 */}
      <div className="progress">
        <CircularProgress percentage={70} />
      </div>
    </div>
  );
};

export default ProjectCard;
