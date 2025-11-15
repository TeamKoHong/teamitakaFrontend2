import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProjectRecruitPublish.scss";
import { loadRecruitDraft, clearRecruitDraft } from "../../../api/recruit";
import { createProject } from "../../../services/projects";

export default function ProjectRecruitPublish() {
  const nav = useNavigate();
  const { state } = useLocation();
  const redirectTo = state?.redirectTo || "/recruit";
  const [error, setError] = useState(null);

  useEffect(() => {
    const publishProject = async () => {
      try {
        // 1. localStorage에서 draft 읽기
        const draft = loadRecruitDraft();
        if (!draft || !draft.title) {
          throw new Error("프로젝트 정보가 없습니다. 다시 시도해주세요.");
        }

        // 2. 백엔드 API 형식으로 변환
        const projectData = {
          title: draft.title,
          description: draft.desc || "",
          start_date: draft.start || undefined,
          end_date: draft.end || undefined,
          status: "예정", // 기본값
        };

        // 3. API 호출
        const result = await createProject(projectData);
        console.log("✅ Project created:", result);

        // 4. localStorage draft 삭제
        clearRecruitDraft();

        // 5. 완료 페이지로 이동
        nav("/recruit/publish/done", {
          state: {
            redirectTo,
            projectId: result.project_id
          }
        });
      } catch (err) {
        console.error("🚨 Project creation error:", err);

        // 에러 처리
        if (err.code === "UNAUTHORIZED") {
          alert("로그인이 필요합니다.");
          nav("/login", { state: { from: "/recruit/publish" } });
        } else {
          setError(err.message || "프로젝트 생성에 실패했습니다.");
        }
      }
    };

    publishProject();
  }, [nav, redirectTo]);

  // 에러 화면
  if (error) {
    return (
      <div className="publish-page">
        <div className="publish-body">
          <h1 className="loading-title">
            <span className="accent">오류가 발생했습니다</span>
          </h1>
          <p className="loading-sub">{error}</p>
          <button
            className="retry-btn"
            onClick={() => nav(-1)}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: "#ff6b35",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 화면
  return (
    <div className="publish-page">
      <div className="publish-body">
        <h1 className="loading-title">
          <span className="accent">팀원 모집글을</span><br />
          업로드 하고 있어요
        </h1>
        <p className="loading-sub">잠시만 기다려주세요!</p>

        <div className="dots" aria-label="로딩 중">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
