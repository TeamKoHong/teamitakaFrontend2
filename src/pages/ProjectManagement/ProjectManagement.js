import React, { useState } from "react";
import "./ProjectManagement.scss";
import Header from "../../components/ProjectManagement/Header/Header";
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import ProgressComponent from "../../components/ProjectManagement/ProgressComponent/ProgressComponent";
import RecruitingComponent from "../../components/ProjectManagement/RecruitingComponent/RecruitingComponent";
import CompletedComponent from "../../components/ProjectManagement/CompletedComponent/CompletedComponent";
function ProjectManagement() {
  const [tabIndex, setTabIndex] = useState(0); // 0: 진행 중, 1: 모집중, 2: 완료된

  return (
    <div className="project-management-container">
      <Header onTabChange={setTabIndex} /> {/* Tab 변경 시 setTabIndex 실행 */}
      <main>
        {tabIndex === 0 && <ProgressComponent />}
        {tabIndex === 1 && <RecruitingComponent />}
        {tabIndex === 2 && <CompletedComponent />}
      </main>
      <BottomNav />
    </div>
  );
}

export default ProjectManagement;
