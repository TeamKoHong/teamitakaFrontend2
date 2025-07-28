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

// 새로 추가된 팀 매칭 페이지 임포트
import TeamMatchingPage from './pages/TeamMatchingPage/TeamMatchingPage'; // TeamMatchingPage 경로에 맞게 수정

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 경로를 프로젝트 관리 페이지로 설정 */}
        <Route path="/" element={<Navigate to="/project-management" replace />} />
        <Route path="/main" element={<Navigate to="/project-management" replace />} />
        <Route path="/my" element={<Navigate to="/project-management" replace />} />

        {/* 기존 프로젝트 관리 및 상세 페이지 라우트 */}
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/project/:id/member" element={<ProjectMemberPage />} />
        <Route path="/project/:id/proceedings" element={<ProceedingsPage />} />
        {/*<Route path="/project/:id/vote" element={<ProjectVotePage />} />*/}
        <Route path="/project/:id/calender" element={<ProjectCalender />} />

        {/* 평가 관련 페이지 라우트 */}
        <Route path="/project/rating-management" element={<RatingManagementPage/>}/>
        <Route path="/project/:projectId/rating-project" element={<RatingProjectPage/>}/>
        <Route path="/project/:projectId/evaluate/:memberId" element={<TeamMemberEvaluationPage />} />
        <Route path="/project/:projectId/rating-status/given" element={<RatingProjectStatusPage />} />
        <Route path="/project/:projectId/rating-status/received" element={<RatingProjectStatusPage />} />
        <Route path="/project/:projectId/rating-status" element={<RedirectToReceived />} />

        {/* 새로 추가된 팀 매칭 페이지 라우트 */}
        <Route path="/team-matching" element={<TeamMatchingPage />} />
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
  return <Navigate to={`/project/${projectId}/rating-status/received`} replace />;
}

export default App;