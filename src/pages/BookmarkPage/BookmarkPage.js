import React, { useState } from "react";
import DefaultHeader from "../../components/Common/DefaultHeader";
import projectDefaultImg from "../../assets/icons/project_default_img.png";
import SmallBookmarkIcon from "../../assets/icons/small_bookMark.svg";
import BookmarkCheckCircleIcon from "../../assets/icons/bookMark_checkCircle.svg";
import BookmarkCalendarIcon from "../../assets/icons/bookMark_calendar.svg";
import ApplicationHistorySlide from "../../components/BookmarkPage/ApplicationHistorySlide";
import MyRecruitmentSlide from "../../components/BookmarkPage/MyRecruitmentSlide";
import "./BookmarkPage.scss";

function BookmarkPage() {
  const [activeTab, setActiveTab] = useState("recruiting"); // "recruiting" | "completed"
  const [isApplicationHistoryOpen, setIsApplicationHistoryOpen] = useState(false);
  const [isMyRecruitmentOpen, setIsMyRecruitmentOpen] = useState(false);

  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const bookmarkStats = {
    totalBookmarks: 24,
    appliedProjects: 1,
    myRecruitmentPosts: 3,
    urgentDeadlines: 3
  };

  const projects = [
    {
      id: 1,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg
    },
    {
      id: 2,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg
    },
    {
      id: 3,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg
    }
  ];

  return (
    <div className="bookmark-page-container">
      <DefaultHeader title="북마크" />
      
      <main className="bookmark-main">
        {/* 북마크 요약 */}
        <div className="bookmark-summary">
          <p className="summary-text">
            오늘 지원 마감인 북마크
            <br />
            프로젝트가 총{" "}
            <span className="urgent-count">{bookmarkStats.urgentDeadlines}건</span>
            {" "}있습니다
          </p>
        </div>

        {/* 통계 섹션 */}
        <div className="bookmark-stats">
          <div className="stat-item">
            <div className="stat-top">
              <div className="stat-icon">
                <img src={SmallBookmarkIcon} alt="북마크" />
              </div>
              <span className="stat-number">{bookmarkStats.totalBookmarks}</span>
            </div>
            <div className="stat-label">북마크수</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item" onClick={() => setIsApplicationHistoryOpen(true)}>
            <div className="stat-top">
              <div className="stat-icon">
                <img src={BookmarkCheckCircleIcon} alt="지원완료" />
              </div>
              <span className="stat-number">{bookmarkStats.appliedProjects}</span>
            </div>
            <div className="stat-label">지원완료</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item" onClick={() => setIsMyRecruitmentOpen(true)}>
            <div className="stat-top">
              <div className="stat-icon">
                <img src={BookmarkCalendarIcon} alt="내가올린모집" />
              </div>
              <span className="stat-number">{bookmarkStats.myRecruitmentPosts}</span>
            </div>
            <div className="stat-label">내가올린 모집</div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "recruiting" ? "active" : ""}`}
            onClick={() => setActiveTab("recruiting")}
          >
            모집 중
          </button>
          <button
            className={`tab-button ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            모집 마감
          </button>
        </div>

        {/* 프로젝트 목록 */}
        <div className="bookmark-project-list">
          {projects.map((project) => (
            <div key={project.id} className="bookmark-project-card">
              <div className="bookmark-project-content">
                <div className="bookmark-project-dates">
                  {project.startDate} ~ {project.endDate}
                </div>
                <h3 className="bookmark-project-title">{project.title}</h3>
                <p className="bookmark-project-description">{project.description}</p>
              </div>
              <div className="bookmark-project-image">
                <img src={project.image} alt={project.title} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 지원 내역 슬라이드 */}
      <ApplicationHistorySlide 
        isOpen={isApplicationHistoryOpen}
        onClose={() => setIsApplicationHistoryOpen(false)}
      />

      {/* 내가 올린 모집글 슬라이드 */}
      <MyRecruitmentSlide 
        isOpen={isMyRecruitmentOpen}
        onClose={() => setIsMyRecruitmentOpen(false)}
      />
    </div>
  );
}

export default BookmarkPage;
