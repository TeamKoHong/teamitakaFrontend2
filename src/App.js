import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import "react-spring-bottom-sheet/dist/style.css";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
