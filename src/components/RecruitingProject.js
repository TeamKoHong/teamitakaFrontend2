import React, { useState } from "react";
import "./RecruitingProject.scss";
import { TbEyeFilled } from "react-icons/tb";
import { RiFileList2Fill } from "react-icons/ri";
import avatar1 from "../assets/icons/avatar1.png";
import avatar2 from "../assets/icons/avatar2.png";
import avatar3 from "../assets/icons/avatar3.png";
import avatar4 from "../assets/icons/avatar4.png";
import ApplicantListSlide from "./ApplicantListSlide"; // 추가

const RecruitingProject = () => {
  const [showApplicantSlide, setShowApplicantSlide] = useState(false);

  return (
    <div className="recruiting-project-container">
      <div className="recruiting-card">
        <h3>교내 동아리 전시 프로젝트 팀원 구합니다.</h3>
        <p className="description">
          교내 1층 전시 홀에 작품을 설치 할 예정입니다. 자유주제이며 함께 두달
          동안 할 팀원을 구합니다.
        </p>
        <div className="info">
          <div className="info-left">
            <div className="views">
              <TbEyeFilled className="info-view-icon" />
              <span>214</span>
            </div>
            <div className="comments">
              <RiFileList2Fill className="info-icon" />
              <span>12</span>
            </div>
          </div>
          <span className="d-day">D-DAY</span>
        </div>
      </div>

      <div className="apply-status">
        <p className="apply-count">모집 중인 프로젝트명</p>
        <h2>24명</h2>
        <p className="apply-desc">
          총 <span className="highlight">24명</span>의 지원서가 도착했어요!
        </p>
        <div className="avatars">
          <img src={avatar1} alt="avatar" />
          <img src={avatar2} alt="avatar" />
          <img src={avatar3} alt="avatar" />
          <img src={avatar4} alt="avatar" />
        </div>
      </div>

      <button className="team-btn" onClick={() => setShowApplicantSlide(true)}>
        팀원 선정하러 가기
      </button>

      <ApplicantListSlide
        open={showApplicantSlide}
        onClose={() => setShowApplicantSlide(false)}
      />
    </div>
  );
};

export default RecruitingProject;
