import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import "react-spring-bottom-sheet/dist/style.css";
import ProjectMemberPage from "./pages/ProjectMemberPage/ProjectMemberPage";
import ProceedingsPage from "./pages/ProceedingsPage/ProceedingsPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamMatchingPage from './pages/TeamMatching/TeamMatchingPage';
// import ProjectVotePage from "./pages/ProjectVotePage/ProjectVotePage";
import ProjectCalender from "./pages/ProjectCalendar/ProjectCalendar";

import RatingManagementPage from './pages/RatingManagementPage/RatingManagementPage';
import RatingProjectPage from './pages/RatingProjectPage/RatingProjectPage';
import RatingProjectStatusPage from './pages/RatingProjectStatusPage/RatingProjectStatusPage';
import TeamMemberEvaluationPage from './pages/TeamMemberEvaluationPage/TeamMemberEvaluationPage';
import CategorySliderDemo from './components/Common/CategorySliderDemo';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/project-management" replace />} />
        <Route path="/main" element={<Navigate to="/project-management" replace />} />
        <Route path="/my" element={<Navigate to="/project-management" replace />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/project/:id/member" element={<ProjectMemberPage />} />
        <Route path="/project/:id/proceedings" element={<ProceedingsPage />} />
        {/*<Route path="/project/:id/vote" element={<ProjectVotePage />} />*/}
        <Route path="/project/:id/calender" element={<ProjectCalender />} />
        <Route path="/project/rating-management" element={<RatingManagementPage/>}/>
        <Route path="/project/:projectId/rating-project" element={<RatingProjectPage/>}/>
        <Route path="/project/:projectId/evaluate/:memberId" element={<TeamMemberEvaluationPage />} />
        <Route path="/project/:projectId/rating-status/given" element={<RatingProjectStatusPage />} />
        <Route path="/project/:projectId/rating-status/received" element={<RatingProjectStatusPage />} />
        <Route path="/project/:projectId/rating-status" element={<RedirectToReceived />} />
        <Route path="/team" element={<Navigate to="/project-management" replace />} />
        <Route path="/my" element={<Navigate to="/project-management" replace />} />
        <Route path="/demo/category-slider" element={<CategorySliderDemo />} />
                <Route path="/team-matching" element={<TeamMatchingPage />} />

      </Routes>
    </Router>
  );
};

function RedirectToReceived() {
  const { projectId } = useParams();
  return <Navigate to={`/project/${projectId}/rating-status/received`} replace />;
}

export default App;
