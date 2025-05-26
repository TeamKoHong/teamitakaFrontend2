import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import "react-spring-bottom-sheet/dist/style.css";
import ProjectMemberPage from "./pages/ProjectMemberPage/ProjectMemberPage";
import ProceedingsPage from "./pages/ProceedingsPage/ProceedingsPage";
// import ProjectVotePage from "./pages/ProjectVotePage/ProjectVotePage";
import ProjectCalender from "./pages/ProjectCalendar/ProjectCalendar";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/project/:id/member" element={<ProjectMemberPage />} />
        <Route path="/project/:id/proceedings" element={<ProceedingsPage />} />
        {/*<Route path="/project/:id/vote" element={<ProjectVotePage />} />*/}
        <Route path="/project/:id/calender" element={<ProjectCalender />} />
      </Routes>
    </Router>
  );
};

export default App;
