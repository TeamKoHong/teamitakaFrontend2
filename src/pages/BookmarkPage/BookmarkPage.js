import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import projectDefaultImg from "../../assets/icons/project_default_img.png";
import ApplicationHistorySlide from "../../components/BookmarkPage/ApplicationHistorySlide";
import { getBookmarkedRecruitments, toggleRecruitmentScrap } from "../../services/recruitment";
import "./BookmarkPage.scss";

function BookmarkPage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState("bookmark"); // "bookmark" | "application"

  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const bookmarksResponse = await getBookmarkedRecruitments();

        // 북마크 처리 - 백엔드가 이미 평탄화된 데이터를 반환함
        const bookmarksData = bookmarksResponse.data || [];
        const bookmarksWithUniv = bookmarksData.map(item => {
          return {
            scrap_id: item.scrap_id,
            recruitment_id: item.recruitment_id,
            id: item.recruitment_id, // 호환성을 위해
            title: item.title || '제목 없음',
            description: item.description || '',
            status: item.status, // 'ACTIVE' or 'CLOSED'
            photo_url: item.photo_url,
            imageUrl: item.photo_url, // 호환성을 위해
            scrap_count: item.scrap_count,
            created_at: item.created_at,
            start_date: item.start_date || item.created_at,
            deadline: item.deadline,
            end_date: item.deadline,
            university: item.university || null, // 백엔드에서 User 정보 미포함 시 null
          };
        });
        setBookmarks(bookmarksWithUniv);
      } catch (err) {
        console.error('북마크 목록 조회 실패:', err);
        if (err.message === 'UNAUTHORIZED' || err.code === 'UNAUTHORIZED') {
          setError('로그인이 필요합니다.');
        } else {
          setError('북마크 목록을 불러오는데 실패했습니다.');
        }
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 북마크 총 개수 (요약 문구용)
  const totalBookmarkCount = bookmarks.length;

  const handleProjectClick = (recruitmentId) => {
    console.log('📍 모집글 클릭:', recruitmentId);
    navigate(`/recruitment/${recruitmentId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '00.00';
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleBookmarkToggle = async (e, recruitmentId) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    try {
      await toggleRecruitmentScrap(recruitmentId);
      // 북마크 해제 후 목록에서 제거
      setBookmarks(prev => prev.filter(b => b.recruitment_id !== recruitmentId));
    } catch (err) {
      console.error('북마크 토글 실패:', err);
      alert('북마크 해제에 실패했습니다.');
    }
  };

  return (
    <div className="bookmark-page-container">
      <DefaultHeader title="북마크" />

      <main className="bookmark-main">
        {/* 북마크 요약 문구 */}
        <div className="bookmark-summary">
          <p className="summary-text">
            내가 저장한 프로젝트입니다.
            <br />
            <span className="summary-second-line">
              지원한 프로젝트가 총{" "}
              <span className="urgent-count">{totalBookmarkCount}건</span>
              {" "}있습니다.
            </span>
          </p>
        </div>

        {/* 탭: 북마크 | 지원 내역 (기존 모집중/모집마감 버튼을 변경) */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${mainTab === "bookmark" ? "active" : ""}`}
            onClick={() => setMainTab("bookmark")}
          >
            북마크
          </button>
          <button
            className={`tab-button ${mainTab === "application" ? "active" : ""}`}
            onClick={() => setMainTab("application")}
          >
            지원 내역
          </button>
        </div>

        {/* 북마크 탭: 프로젝트 목록 */}
        {mainTab === "bookmark" && (
          <div className="bookmark-project-list">
          {isLoading ? (
            <div className="bookmark-loading">로딩 중...</div>
          ) : error ? (
            <div className="bookmark-error">{error}</div>
          ) : bookmarks.length === 0 ? (
            <div className="bookmark-empty">북마크가 없습니다.</div>
          ) : (
            bookmarks.map((project) => (
              <div
                key={project.recruitment_id}
                className="bookmark-project-card"
                onClick={() => handleProjectClick(project.recruitment_id)}
              >
                <div className="bookmark-project-content">
                  <div className="bookmark-project-dates">
                    {formatDate(project.start_date)} ~ {formatDate(project.deadline)}
                  </div>
                  <h3 className="bookmark-project-title">{project.title}</h3>
                  <p className="bookmark-project-description">{project.description}</p>
                </div>
                <div className="bookmark-project-image">
                  <img
                    src={project.photo_url || projectDefaultImg}
                    alt={project.title}
                    onError={(e) => { e.target.src = projectDefaultImg; }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="22"
                    viewBox="0 0 16 22"
                    fill="none"
                    className="bookmark-toggle-icon"
                    onClick={(e) => handleBookmarkToggle(e, project.recruitment_id)}
                  >
                    <path d="M0 2C0 0.89543 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V19.8851C16 21.5539 14.0766 22.4888 12.7644 21.4577L9.23564 18.6851C8.51042 18.1153 7.48958 18.1153 6.76436 18.6851L3.23564 21.4577C1.92338 22.4888 0 21.5539 0 19.8851V2Z" fill="#F76241"/>
                  </svg>
                </div>
              </div>
            ))
          )}
          </div>
        )}

        {/* 지원 내역 탭: API 연결된 지원 내역 레이아웃 */}
        {mainTab === "application" && (
          <ApplicationHistorySlide
            inline={true}
            isActive={true}
          />
        )}
      </main>
    </div>
  );
}

export default BookmarkPage;
