import React from "react";
import ProjectCard from "../ProjectCard";

function ProgressComponent() {
  return (
    <>
      <main>
        <section className="project-info">
          <p className="project-explain">
            팀원들과 함께 프로젝트를 공유하고 <br />
            <strong>티미타카</strong>가 해보세요!
          </p>
        </section>
        <div className="project-filter">
          <select className="project-select">
            <option value="all">최신순 </option>
            <option value="progress">날짜 순</option>
            <option value="complete">회의 빠른 순</option>
          </select>
        </div>
        <section className="project-list">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </section>
      </main>
    </>
  );
}

export default ProgressComponent;
