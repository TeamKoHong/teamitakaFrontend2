import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/project-management" element={<ProjectManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
