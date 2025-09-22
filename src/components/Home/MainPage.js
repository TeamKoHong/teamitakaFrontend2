import React from 'react';
import './main.scss';
import BottomNav from '../Common/BottomNav/BottomNav';
import bellIcon from '../../assets/icons/bell.png';
import schoolIcon from '../../assets/icons/school.png';
import qrIcon from '../../assets/icons/qrCode.png';
import mascotImg from '../../assets/icons/project_empty.png';

const MainPage = () => {
  return (
    <div className="main-page">

      {/* ===== 상단 통합 박스 (헤더 + 프로필) ===== */}
      <div className="top-card">
        {/* 헤더 */}
        <header className="header">
          <h1 className="logo">Teamitaka</h1>
          <button className="icon-btn" aria-label="알림">
            <img src={bellIcon} alt="알림" className="alarm-icon" />
          </button>
        </header>

        {/* 유저 프로필 카드 */}
        <section className="profile-card">
          {/* 오른쪽: 프로필 이미지 */}
          <div className="profile-left">
            <div className="profile-img" aria-hidden>🧍</div>
            {/* ⭐ QR 버튼을 이미지에 붙이도록 이 위치로 이동 */}
            <button className="qr-btn" aria-label="내 QR">
              <img src={qrIcon} alt="QR" className="qr-icon" />
            </button>
          </div>

          {/* 왼쪽: 사용자 정보 */}
          <div className="profile-middle">
            <div className="name">
              사용자명 <span className="emph">티미</span>님
            </div>

            <div className="school">
              <img src={schoolIcon} alt="" className="school-icon" />
              재학중인 대학교 학과 재학 중
            </div>

            <div className="stats">
              현재 진행중인 프로젝트 <span className="count">총 N건</span>
              <span className="divider"></span>
              <br />
              팀플 경험 <span className="muted">00회</span>
            </div>

            <div className="tags">
              <span className="tag pill">키워드1</span>
              <span className="tag pill">키워드2</span>
            </div>
          </div>

          {/* ⭐ 기존 profile-right 블록 제거 (QR를 위로 이동했기 때문) */}
        </section>
      </div>

      {/* ===== 내가 참여 중인 프로젝트 ===== */}
      <h2 className="section-title">내가 참여 중인 프로젝트</h2>
      <section className="my-projects">
        <div className="empty-card">
          <img src={mascotImg} alt="" className="empty-img" />
          <p className="empty-text">
            진행 중인 프로젝트가 없어요.<br />
            지금 바로 프로젝트를 시작해보세요!
          </p>
          <button className="primary-btn">팀 프로젝트 시작하기</button>
        </div>
      </section>

      <div className="bottom-spacer" />
      <BottomNav />
    </div>
  );
};

export default MainPage;
