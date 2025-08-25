import React from "react";
import "./RecruitingComponent.scss";
import SectionHeader from "../Common/SectionHeader";
import { useState } from "react";
import { TbEyeFilled } from "react-icons/tb";
import { RiFileList2Fill } from "react-icons/ri";
import RecruitingProjectSlide from "../../RecruitingProjectSlide";

const RecruitingComponent = () => {
  const [openSlide, setOpenSlide] = useState(false);

  return (
    <div className="recruiting-container">
      {/* 기존 레이아웃 */}
      <div className="recruiting-top">
        <div className="recruiting-top-info">
          <SectionHeader
            explainText={`프로젝트 모집 기간이 완료되어\n팀원을 구해보세요!`}
            highlightText="팀원"
            filterOptions={[
              { value: "latest", label: "최신순" },
              { value: "date", label: "날짜순" },
              { value: "meeting", label: "회의 빠른 순" },
            ]}
            onFilterChange={(e) => console.log(e.target.value)}
          />
        </div>
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
      </div>
      <hr />
      <div className="recruiting-bottom">
        <div className="recruiting-bottom-info">
          <p>
            모집 인원이 아쉽게 다 모이지 않았어요 <br />
            <span className="highlight">다시 한번 모집</span>해보세요
          </p>
        </div>
        <div className="recruiting-action">
          <p className="recruiting-action-explain">
            목표 모집 인원에 도달하지 못했어요.
          </p>
          <p className="project-name">프로젝트명</p>
          <div className="buttons">
            <button className="btn delete">삭제하기</button>
            <button className="btn retry" onClick={() => setOpenSlide(true)}>
              다시 모집하기
            </button>
          </div>
        </div>
      </div>

      {/* 슬라이드 */}
      <RecruitingProjectSlide
        open={openSlide}
        onClose={() => setOpenSlide(false)}
      />
    </div>
  );
};

export default RecruitingComponent;
