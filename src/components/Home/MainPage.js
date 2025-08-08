import React from 'react';
import './main.scss';
import BottomNav from '../Common/BottomNav/BottomNav';
import ProjectSlider from './ProjectSlider';
import UrgentProjects from './UrgentProjects';
import bellIcon from '../../assets/icons/bell.png';
import schoolIcon from '../../assets/icons/school.png';
import qrIcon from '../../assets/icons/qrCode.png';
//import RecruitmentSection from './RecruitmentSection';

const MainPage = () => {
  return (
    <div className="main-page">
      <header className="header">
        <h1 className="logo">Teamitaka</h1>
        <img src={bellIcon} alt="알림" className="alarm-icon" />
      </header>

      {/* 유저 프로필 카드 */}
      <section className="profile-card">
        <div className="profile-left">
          <div className="profile-img">🧍</div>
        </div>
        <div className="profile-middle">
          <div className="name">김조형</div>
          <div className="school">
          <img src={schoolIcon} alt="학교" className="school-icon"/>
          홍익대학교 디자인과 재학 중</div>
          <div className="tags">
            <span className="tag red">브랜딩</span>
            <span className="tag red">UX/UI</span>
          </div>
          <div className="info">팀플 경험 5회 · 진행 중 프로젝트 3개</div>
        </div>
        <div className="profile-right">
          <div className="badge">
            <img src={qrIcon} alt="학교" className="qr-icon"/>
            </div>
        </div>
      </section>

      {/* 오늘의 할 일 */}
      <h2 className="todo-title">오늘의 할 일</h2>
      <section className="todo-section">
        <ul className="todo-list">
          <li>
            <span>지표 엑셀에 정리하기</span>
            <input type="checkbox" />
          </li>
          <li>
            <span>자료 조사 및 분석하기</span>
            <input type="checkbox" />
          </li>
        </ul>
      </section>
       <ProjectSlider /> 
       <UrgentProjects />
       <BottomNav />
    </div>
  );
};

export default MainPage;
