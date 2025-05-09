import React from "react";
import "./ProjectDetailSlideBox.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TodayIcon from "../Common/UI/TodayIcon";

function ProjectDetailSlideBox() {
  return (
    <div className="project-detail-slide-box">
      <Swiper
        spaceBetween={0}
        slidesPerView={1.1}
        pagination={{ clickable: true }}
      >
        <SwiperSlide>
          <div className="slide-card">
            <div className="start-date">시작한지 +33일</div>
            <div className="project-name">프로젝트명</div>
            <div className="project-subtitle">
              프로젝트 설명 또는 다짐이 들어가는 입력란입니다.
            </div>

            <div className="progress-wrapper">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "75%" }} />
              </div>
              <TodayIcon className="today-icon" />
            </div>

            <p className="progress-subtext">
              목표일 2000.00.00까지 27일 남았어요!
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-card">
            <div className="start-date">시작한지 +33일</div>
            <div className="project-name">프로젝트명</div>
            <div className="project-subtitle">
              프로젝트 설명 또는 다짐이 들어가는 입력란입니다.
            </div>

            <div className="progress-wrapper">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "75%" }} />
              </div>
              <TodayIcon className="today-icon" />
            </div>

            <p className="progress-subtext">
              목표일 2000.00.00까지 27일 남았어요!
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-card">
            <div className="start-date">시작한지 +33일</div>
            <div className="project-name">프로젝트명</div>
            <div className="project-subtitle">
              프로젝트 설명 또는 다짐이 들어가는 입력란입니다.
            </div>

            <div className="progress-wrapper">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "75%" }} />
              </div>
              <TodayIcon className="today-icon" />
            </div>

            <p className="progress-subtext">
              목표일 2000.00.00까지 27일 남았어요!
            </p>
          </div>
        </SwiperSlide>

        {/* 추가 슬라이드들 필요 시 여기에 */}
      </Swiper>
    </div>
  );
}

export default ProjectDetailSlideBox;
