import React from "react";
import "./ProjectCard.scss";
import avatar1 from "../../../assets/icons/avatar1.png";
import avatar2 from "../../../assets/icons/avatar2.png";
import avatar3 from "../../../assets/icons/avatar3.png";
import avatar4 from "../../../assets/icons/avatar4.png";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";

// 원형 프로그레스 바
const CircularProgress = ({ percentage }) => {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="64" height="64" viewBox="0 0 44 44">
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
        stroke="#F76241"
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
        font-family="KIMM_Bold"
        fontStyle="normal"
        dy=".3em"
        fontSize="12px"
        fontWeight="400"
        fill="#F76241"
      >
        D-07
      </text>
    </svg>
  );
};

const ProjectCard = () => {
  const navigate = useNavigate();

  const handleGoToProjectDetail = (projectId) => {
    navigate(`/project/${projectId}`);
  };
  return (
    <div
      className="project-card"
      onClick={
        () => handleGoToProjectDetail(1) // 클릭 시 프로젝트 상세 페이지로 이동
      }
    >
      <div className="card-content">
        {/* 프로젝트 정보 */}
        <div className="info">
          <h3 className="title">프로젝트명</h3>
        </div>

        <div className="details">
          <p>
            <IoCalendarOutline className="details-icon" /> 프로젝트 기간
          </p>
          <p>
            <IoTimeOutline className="details-icon" /> 고정 회의 시간
          </p>
        </div>

        {/* 팀원 리스트 */}
        <div className="team">
          <img
            src={avatar1}
            alt="팀원아바타"
            className="member"
            style={{ backgroundColor: "#ddd", zIndex: "6" }}
          />
          <img
            src={avatar2}
            alt="팀원아바타"
            className="member"
            style={{ backgroundColor: "#bbb", left: "1.5rem", zIndex: "5" }}
          />
          <img
            src={avatar3}
            alt="팀원아바타"
            className="member"
            style={{ backgroundColor: "#999", left: "3rem", zIndex: "4" }}
          />
          <img
            src={avatar4}
            alt="팀원아바타"
            className="member"
            style={{ backgroundColor: "#777", left: "4.5rem", zIndex: "3" }}
          />
        </div>
      </div>

      {/* D-Day 원형 프로그레스 */}
      <div className="projectCard-right">
        <p className="time-ago">
          2시간 전 <span className="dot" />
        </p>
        <CircularProgress percentage={70} />
      </div>
    </div>
  );
};

export default ProjectCard;
