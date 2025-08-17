// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import "react-spring-bottom-sheet/dist/style.css";
import ProjectMemberPage from "./pages/ProjectMemberPage/ProjectMemberPage";
import ProceedingsPage from "./pages/ProceedingsPage/ProceedingsPage";
// import ProjectVotePage from "./pages/ProjectVotePage/ProjectVotePage";
import ProjectCalender from "./pages/ProjectCalendar/ProjectCalendar";

import RatingManagementPage from './pages/RatingManagementPage/RatingManagementPage';
import RatingProjectPage from './pages/RatingProjectPage/RatingProjectPage';
import RatingProjectStatusPage from './pages/RatingProjectStatusPage/RatingProjectStatusPage';
import TeamMemberEvaluationPage from './pages/TeamMemberEvaluationPage/TeamMemberEvaluationPage';
import CategorySliderDemo from './components/Common/CategorySliderDemo';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
// 새로 추가된 팀 매칭 페이지 임포트
import TeamMatchingPage from './pages/TeamMatchingPage/TeamMatchingPage'; // TeamMatchingPage 경로에 맞게 수정
import RecruitmentPage from './pages/RecruitmentPage/RecruitmentPage';
import SearchPage from './pages/SearchPage/SearchPage';

// 메인 페이지 임포트
import MainPage from './components/Home/MainPage';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 경로를 프로젝트 관리 페이지로 설정 
        <Route path="/" element={<Navigate to="/project-management" replace />} />
        <Route path="/main" element={<Navigate to="/project-management" replace />} />
        <Route path="/my" element={<Navigate to="/project-management" replace />} />*/}

        {/*메인 홈 페이지 라우트*/}
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* 기본 경로를 프로젝트 관리 페이지로 설정 */}
        <Route path="/my" element={<Navigate to="/project-management" replace />} />

        {/* 기존 프로젝트 관리 및 상세 페이지 라우트 */}
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/project/:id/member" element={<ProjectMemberPage />} />
        <Route path="/project/:id/proceedings" element={<ProceedingsPage />} />
        {/*<Route path="/project/:id/vote" element={<ProjectVotePage />} />*/}
        <Route path="/project/:id/calender" element={<ProjectCalender />} />

        {/* 평가 관련 페이지 라우트 - URL 구조 개선 */}
        <Route path="/evaluation/management" element={<RatingManagementPage/>}/>
        <Route path="/evaluation/project/:projectId" element={<RatingProjectPage/>}/>
        <Route path="/evaluation/team-member/:projectId/:memberId" element={<TeamMemberEvaluationPage />} />
        <Route path="/evaluation/status/:projectId/given" element={<RatingProjectStatusPage />} />
        <Route path="/evaluation/status/:projectId/received" element={<RatingProjectStatusPage />} />
        <Route path="/evaluation/status/:projectId" element={<RedirectToReceived />} />
        
        {/* 기존 URL 호환성을 위한 리다이렉트 */}
        <Route path="/project/rating-management" element={<Navigate to="/evaluation/management" replace />} />
        <Route path="/project/:projectId/rating-project" element={<Navigate to="/evaluation/project/:projectId" replace />} />
        <Route path="/project/:projectId/evaluate/:memberId" element={<Navigate to="/evaluation/team-member/:projectId/:memberId" replace />} />
        <Route path="/project/:projectId/rating-status/given" element={<Navigate to="/evaluation/status/:projectId/given" replace />} />
        <Route path="/project/:projectId/rating-status/received" element={<Navigate to="/evaluation/status/:projectId/received" replace />} />
        <Route path="/project/:projectId/rating-status" element={<Navigate to="/evaluation/status/:projectId" replace />} />

        {/* 새로 추가된 팀 매칭 페이지 라우트 */}
        <Route path="/team-matching" element={<TeamMatchingPage />} />
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* 기존 /team 경로를 팀 매칭 페이지로 리다이렉트 */}
        <Route path="/team" element={<Navigate to="/team-matching" replace />} />

        {/* 데모 컴포넌트 라우트 */}
        <Route path="/demo/category-slider" element={<CategorySliderDemo />} />
      </Routes>
    </Router>
  );
};

function RedirectToReceived() {
  const { projectId } = useParams();
  return <Navigate to={`/evaluation/status/${projectId}/received`} replace />;
}

export default App;