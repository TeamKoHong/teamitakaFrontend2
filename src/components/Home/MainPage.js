// [MainPage.js]
import React from 'react';
import { useNavigate } from "react-router-dom";
import './main.scss';
import BottomNav from '../Common/BottomNav/BottomNav';

import bellIcon from '../../assets/icons/bell.png';
import schoolIcon from '../../assets/icons/school.png';
import mascotImg from '../../assets/icons/project_empty.png';

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div className="main-page">
      {/* ===== 상단: 앱바 + 프로필 카드 ===== */}
      <div className="top-card">
        {/* 앱바 */}
        <header className="header">
          <h1 className="logo">Teamitaka</h1>
          <button
            className="icon-btn"
            aria-label="알림"
            onClick={() => navigate('/notifications')}
          >
            <img src={bellIcon} alt="알림" className="alarm-icon" />
          </button>
        </header>

        {/* 프로필 카드 */}
        <section className="profile-card" aria-label="프로필 요약">
          <div className="profile-left">
            <div className="profile-img" aria-hidden>🧍</div>
          </div>

          {/* 왼쪽: 텍스트 정보 */}
          <div className="profile-middle">
            <div className="name">
              <span className="name-strong">사용자명</span>{' '}
              <span className="name-regular">티미님</span>
            </div>

            <div className="school">
              <img src={schoolIcon} alt="" className="school-icon" />
              재학중인 대학교 학과 재학 중
            </div>

            <div className="stats">
              <span className="stats-strong">현재 진행중인 프로젝트</span>{' '}
              <span className="count">총 N건</span>
              <br />
              협업 경험 <span className="muted">00회</span>
            </div>

            <div className="tags">
              <span className="tag pill">키워드1</span>
              <span className="tag pill">키워드2</span>
            </div>
          </div>
        </section>
      </div>

      {/* ===== 내가 참여 중인 프로젝트 ===== */}
      <h2 className="section-title">내가 참여 중인 프로젝트</h2>
      <section className="my-projects">
        <div className="empty-card" role="status" aria-live="polite">
          <img src={mascotImg} alt="" className="empty-img" />
          <p className="empty-text">
            진행 중인 프로젝트가 없어요.
            <br />
            지금 바로 프로젝트를 시작해보세요!
          </p>
          <button className="primary-btn" type="button">
            팀 프로젝트 시작하기
          </button>
        </div>
      </section>

      {/* ===== 프로젝트 지원하기 버튼 ===== */}
      <div className="support-btn-wrap">
        <button
          className="support-btn"
          type="button"
          onClick={() => navigate("/apply2")}
        >
          프로젝트 지원하기
        </button>
      </div>

      <div className="bottom-spacer" />
      <BottomNav />
    </div>
  );
};

export default MainPage;
