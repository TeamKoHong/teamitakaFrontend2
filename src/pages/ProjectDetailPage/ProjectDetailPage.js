import MainFloatingBox from "../../components/\bProjectDetailPage/MainFloatingBox";
import ProjectDetailHeader from "../../components/\bProjectDetailPage/ProjectDetailHeader";
import TodoBox from "../../components/ProjectDetailPage/TodoBox";
import "./ProjectDetailPage.scss";
function ProjectDetailPage() {
  return (
    <div className="project-detail-page-container">
      <ProjectDetailHeader projectName="프로젝트명" />
      <MainFloatingBox />
      <TodoBox />
    </div>
  );
}
export default ProjectDetailPage;
