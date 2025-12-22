import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import "./main.scss";
import BottomNav from "../Common/BottomNav/BottomNav";

import bellIcon from "../../assets/icons/bell.png";
import schoolIcon from "../../assets/icons/school.png";
import mascotImg from "../../assets/icons/project_empty.png";
import mainlogo from "../../assets/icons/Teamitaka_main_logo.png";

import { getMe } from "../../services/user";
import { getSummary } from "../../services/dashboard";
import { getMyProjects } from "../../services/projects";

import ProjectCard from "../ProjectManagement/Common/ProjectCard";
import MainProjectCard from "./MainProjectCard";

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

  // ✅ 캐러셀 dots용
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // ✅ 프로젝트가 바뀌면 dot/스크롤 초기화
  useEffect(() => {
    setActiveIndex(0);
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
  }, [projects]);

  // ✅ 캐러셀 스크롤 시 현재 인덱스 계산
  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild;
    if (!firstCard) return;

    // 카드 너비 + gap(12px) 기준으로 인덱스 계산
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 12;
    const step = cardWidth + gap;

    const idx = Math.round(el.scrollLeft / step);
    const safeIdx = Math.max(0, Math.min(idx, projects.length - 1));
    setActiveIndex(safeIdx);
  };

  // ✅ dot 클릭 시 해당 카드로 이동(선택 기능)
  const scrollToIndex = (idx) => {
    const el = carouselRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild;
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 12;
    const step = cardWidth + gap;

    el.scrollTo({
      left: idx * step,
      behavior: "smooth",
    });
  };

  const ongoingCount = summary?.projects?.ongoing ?? "N";
  const unreadCount = summary?.notifications?.unread ?? "0";
  const teamExperience = user?.teamExperience ?? 0;

  return (
    <div className="main-page">
      <div className="top-card">
        <header className="header">
          <h1 className="logo">  <img src={mainlogo} alt="Teamitaka" className="logo-img" /> </h1>
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
                  <span className="name-strong">{user.username || user.email}</span>
                  <span className="name-regular">티미님</span>{" "}
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
          <>
            <div
              className="main-project-carousel"
              ref={carouselRef}
              onScroll={handleCarouselScroll}
            >
              {projects.map((project) => (
                <MainProjectCard
                  key={project.project_id}
                  project={project}
                  onClick={() => navigate(`/project/${project.project_id}`)}
                />
              ))}
            </div>

            {/* dots (●●●) */}
            <div className="carousel-dots" aria-label="프로젝트 캐러셀 페이지 표시">
              {projects.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`dot ${i === activeIndex ? "is-active" : ""}`}
                  aria-label={`프로젝트 ${i + 1}로 이동`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 메인에서는 좌우 padding 영향 제거해서 상세와 폭 동일하게 */}
      <section className="main-todo-section">
        <TodoBox showFeed={false} />
      </section>

      <div className="bottom-spacer" />
      <BottomNav />
    </div>
  );
};

export default MainPage;
