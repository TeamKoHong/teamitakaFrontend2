import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProjectRecruitPublish.scss";

export default function ProjectRecruitPublish() {
  const nav = useNavigate();
  const { state } = useLocation();
  const redirectTo = state?.redirectTo || "/recruit";

  // 1.5초 뒤 완료 화면으로 이동
  useEffect(() => {
    const t = setTimeout(() => {
      nav("/recruit/publish/done", { state: { redirectTo } });
    }, 1500);
    return () => clearTimeout(t);
  }, [nav, redirectTo]);

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
