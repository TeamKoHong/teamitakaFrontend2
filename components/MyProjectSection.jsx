import './MyProjectSection.css';

export default function MyProjectSection() {
  return (
    <div className="my-project-section">
      <h2 className="section-title">나의 프로젝트</h2>
      <div className="project-add-box">
        <img src="/project_add.png" alt="프로젝트 추가" className="add-icon" />
        <span className="add-text">프로젝트 등록하기</span>
      </div>
    </div>
  );
}
