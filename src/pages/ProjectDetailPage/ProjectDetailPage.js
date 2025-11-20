import MainFloatingBox from "../../components/ProjectDetailPage/MainFloatingBox";
import ProjectDetailHeader from "../../components/ProjectDetailPage/ProjectDetailHeader";
import TodoBox from "../../components/ProjectDetailPage/TodoBox";
import ProjectDetailSlideBox from "../../components/ProjectDetailPage/ProjectDetailSlideBox";
import "./ProjectDetailPage.scss";

function ProjectDetailPage() {
  return (
    <div className="project-detail-page-container">
      <ProjectDetailHeader projectName="프로젝트명" />
      <MainFloatingBox />
      <ProjectDetailSlideBox />
      <TodoBox />
    </div>
  );
}
export default ProjectDetailPage;
