import React from "react";
import ProjectCard from "../Common/ProjectCard";
import SectionHeader from "../Common/SectionHeader";

function ProgressComponent() {
  return (
    <>
      <main>
        <section className="project-info">
          <SectionHeader
            explainText={`팀원들과 함께 프로젝트를 공유하고\n티미타카 해보세요!`}
            highlightText="티미타카"
            filterOptions={[
              { value: "latest", label: "최신순" },
              { value: "date", label: "날짜순" },
              { value: "meeting", label: "회의 빠른 순" },
            ]}
            onFilterChange={(e) => console.log(e.target.value)}
          />
        </section>
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
