import React from 'react';
import './main.scss';
import BottomNav from '../Common/BottomNav/BottomNav';
import bellIcon from '../../assets/icons/bell.png';
import schoolIcon from '../../assets/icons/school.png';
import qrIcon from '../../assets/icons/qrCode.png';
import mascotImg from '../../assets/icons/sample.jpg'; // 실제 이미지 교체 예정임임

const MainPage = () => {
  return (
    <div className="main-page">
      {/* ===== 헤더 ===== */}
      <header className="header">
        <h1 className="logo">Teamitaka</h1>
        <button className="icon-btn" aria-label="알림">
          <img src={bellIcon} alt="알림" className="alarm-icon" />
        </button>
      </header>

      {/* ===== 유저 프로필 카드 ===== */}
      <section className="profile-card">
        <div className="profile-left">
          <div className="profile-img" aria-hidden>🧍</div>
        </div>

        <div className="profile-middle">
          <div className="name">사용자명 <span className="emph">티미</span>님</div>

          <div className="school">
            <img src={schoolIcon} alt="" className="school-icon" />
            재학중인 대학교 학과명
          </div>

          <div className="stats">
            현재 진행중인 프로젝트 <span className="count">총 N건</span>
            <span className="divider">|</span>
            팀플 경험 <span className="muted">00회</span>
          </div>

          <div className="tags">
            <span className="tag pill">키워드1</span>
            <span className="tag pill">키워드2</span>
          </div>
        </div>

        <div className="profile-right">
          <button className="qr-btn" aria-label="내 QR">
            <img src={qrIcon} alt="QR" className="qr-icon" />
          </button>
        </div>
      </section>

      {/* ===== 내가 참여 중인 프로젝트 ===== */}
      <section className="my-projects">
        <h2 className="section-title">내가 참여 중인 프로젝트</h2>

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
