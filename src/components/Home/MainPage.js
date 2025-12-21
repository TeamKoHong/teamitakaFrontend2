import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "./main.scss";
import BottomNav from "../Common/BottomNav/BottomNav";

import bellIcon from "../../assets/icons/bell.png";
import schoolIcon from "../../assets/icons/school.png";
import mascotImg from "../../assets/icons/project_empty.png";

import { getMe } from "../../services/user";
import { getSummary } from "../../services/dashboard";
import { getMyProjects } from "../../services/projects";

import ProjectCard from "../ProjectManagement/Common/ProjectCard";

// ✅ TODO 컴포넌트 임포트
import TodoBox from "../ProjectDetailPage/TodoBox";

const MainPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [meRes, sumRes] = await Promise.all([
          getMe().catch((e) => {
            throw e;
          }),
          getSummary().catch((e) => {
            throw e;
          }),
        ]);

        if (!mounted) return;

        if (meRes?.success && meRes.user) setUser(meRes.user);
        if (sumRes?.success) setSummary(sumRes.data || sumRes.summary || null);
      } catch (e) {
        setError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        setProjectError(null);

        const res = await getMyProjects({
          status: "ACTIVE",
          limit: 5,
          offset: 0,
        });

        if (!mounted) return;

        if (res?.success) setProjects(res.items || []);
      } catch (e) {
        if (!mounted) return;
        if (e?.code === "UNAUTHORIZED") return;
        setProjectError("프로젝트 목록을 불러오는 데 실패했습니다.");
      } finally {
        if (mounted) setIsLoadingProjects(false);
      }
    };

    loadProjects();
    return () => {
      mounted = false;
    };
  }, []);

  const ongoingCount = summary?.projects?.ongoing ?? "N";
  const unreadCount = summary?.notifications?.unread ?? "0";
  const teamExperience = user?.teamExperience ?? 0;

  return (
    <div className="main-page">
      <div className="top-card">
        <header className="header">
          <h1 className="logo">Teamitaka</h1>
          <button
            className="icon-btn"
            aria-label="알림"
            onClick={() => navigate("/notifications")}
          >
            <img src={bellIcon} alt="알림" className="alarm-icon" />
            {unreadCount !== "0" && (
              <span className="badge" aria-label={`안 읽은 알림 ${unreadCount}건`}>
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        <section className="profile-card" aria-label="프로필 요약">
          <div className="profile-middle">
            <div className="name">
              {isLoading && <span>불러오는 중...</span>}
              {!isLoading && user && (
                <>
                  <span className="name-regular">사용자명</span>{" "}
                  <span className="name-strong">{user.username || user.email}</span>
                  <span className="name-regular">님</span>
                </>
              )}
              {!isLoading && !user && !error && <span>사용자 정보를 불러올 수 없습니다.</span>}
            </div>

            <div className="school">
              <img src={schoolIcon} alt="" className="school-icon" />
              {user?.university && user?.major
                ? `${user.university} ${user.major} 재학 중`
                : "학과 정보가 없습니다"}
            </div>

            <div className="stats">
              <span className="stats-strong">현재 진행중인 프로젝트</span>{" "}
              <span className="count">총 {ongoingCount}건</span>
              <br />
              팀플 경험 <span className="count">{teamExperience}회</span>
            </div>

            <div className="tags">
              {user?.keywords && user.keywords.length > 0 ? (
                user.keywords.map((keyword, idx) => (
                  <span key={idx} className="tag pill">
                    {keyword}
                  </span>
                ))
              ) : (
                <>
                  <span className="tag pill">키워드1</span>
                  <span className="tag pill">키워드2</span>
                </>
              )}
            </div>

            {error && (
              <div style={{ marginTop: "8px", color: "#F76241", fontSize: "12px" }}>
                {error} <button onClick={() => window.location.reload()}>다시 시도</button>
              </div>
            )}
          </div>

          <div className="profile-right">
            <div className="profile-img" aria-hidden>
              🧍
            </div>
          </div>
        </section>
      </div>

      <h2 className="section-title">내가 참여 중인 프로젝트</h2>
      <section className="my-projects">
        {isLoadingProjects && <div className="loading-state">프로젝트를 불러오는 중...</div>}

        {projectError && !isLoadingProjects && (
          <div className="error-state">
            <p style={{ color: "#F76241", marginBottom: "12px" }}>{projectError}</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        )}

        {!isLoadingProjects && !projectError && projects.length === 0 && (
          <div className="empty-card" role="status" aria-live="polite">
            <img src={mascotImg} alt="" className="empty-img" />
            <p className="empty-text">
              진행 중인 프로젝트가 없어요.
              <br />
              지금 바로 프로젝트를 시작해보세요!
            </p>
            <button className="primary-btn" type="button" onClick={() => navigate("/recruit")}>
              팀 프로젝트 시작하기
            </button>
          </div>
        )}

        {!isLoadingProjects && projects.length > 0 && (
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* ✅ 메인에서는 좌우 padding 영향 제거해서 상세와 폭 동일하게 */}
      <section className="main-todo-section">
        <TodoBox showFeed={false} />
      </section>

      <div className="bottom-spacer" />
      <BottomNav />
    </div>
  );
};

export default MainPage;
