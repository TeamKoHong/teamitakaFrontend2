import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultHeader from "./Common/DefaultHeader";
import ApplicantDetailModal from "./ApplicantDetailModal";
import { getRecruitmentApplicants, approveApplicant, convertToProject } from "../services/recruitment";
import avatar1 from "../assets/icons/avatar1.png";
import avatar2 from "../assets/icons/avatar2.png";
import avatar3 from "../assets/icons/avatar3.png";
import avatar4 from "../assets/icons/avatar4.png";
import "./ApplicantListSlide.scss";

export default function ApplicantListSlide({ open, onClose, recruitmentId }) {
  const navigate = useNavigate();
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!open || !recruitmentId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getRecruitmentApplicants(recruitmentId);
        console.log('🔍 [ApplicantListSlide] API 응답 전체:', data);
        console.log('🔍 [ApplicantListSlide] recruitmentId:', recruitmentId);

        // API가 배열을 직접 반환하는 경우와 객체로 감싸서 반환하는 경우 모두 처리
        const applications = Array.isArray(data) ? data : (data.applications || []);
        console.log('🔍 [ApplicantListSlide] applications 배열:', applications);

        // Map backend data to component format
        const mappedApplicants = applications.map((app) => {
          console.log('🔍 [ApplicantListSlide] 개별 application:', app);
          console.log('🔍 [ApplicantListSlide] User 정보:', app.User);
          return {
            id: app.application_id,
            name: app.User?.username || "지원자",
            img: app.User?.avatar || avatar1,
            application_id: app.application_id,
            user_id: app.user_id,
            status: app.status,
            introduction: app.introduction,
            skills: Array.isArray(app.User?.skills)
              ? app.User.skills
              : (typeof app.User?.skills === 'string' && app.User.skills
                ? app.User.skills.split(',').map(s => s.trim())
                : []),
            experience_years: app.User?.experience_years,
            university: app.User?.university,
            major: app.User?.major,
            portfolios: app.ApplicationPortfolios || [],
            User: app.User,
          };
        });
        console.log('🔍 [ApplicantListSlide] 매핑된 지원자 목록:', mappedApplicants);
        setApplicants(mappedApplicants);

        // 이미 승인된 지원자들을 선택된 팀원 목록에 추가
        const approvedApplicants = mappedApplicants.filter(a => a.status === 'ACCEPTED');
        if (approvedApplicants.length > 0) {
          setSelectedTeamMembers(approvedApplicants);
        }
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
        if (err.code === 'UNAUTHORIZED') {
          alert("로그인이 필요합니다.");
          navigate("/login");
        } else {
          setError("지원자 목록을 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [open, recruitmentId, navigate]);

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleInvite = async (applicant) => {
    try {
      // Call approval API
      await approveApplicant(applicant.application_id);

      // Add to selected team members
      setSelectedTeamMembers((prev) => {
        const exists = prev.some((m) => m.id === applicant.id);
        if (exists) return prev; // 중복 방지
        return [...prev, applicant];
      });

      setIsModalOpen(false);
      setSelectedApplicant(null);

      // 상단 배너가 바로 보이도록 스크롤 업
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    } catch (err) {
      console.error("Failed to approve applicant:", err);
      if (err.code === 'UNAUTHORIZED') {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        alert("팀원 승인에 실패했습니다.");
      }
    }
  };

  const hasSelection = selectedTeamMembers.length > 0;

  const handleStartProject = async () => {
    if (!hasSelection || !recruitmentId) return;

    try {
      const result = await convertToProject(recruitmentId);
      console.log("✅ Project created:", result);
      alert("프로젝트가 생성되었습니다!");

      // Navigate to the created project or projects list
      if (result.project_id) {
        navigate(`/projects/${result.project_id}`);
      } else {
        navigate("/projects");
      }
    } catch (err) {
      console.error("Failed to convert to project:", err);
      if (err.code === 'UNAUTHORIZED') {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        alert("프로젝트 생성에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <div className={`als-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`als-panel ${open ? "open" : ""}`}>
        <DefaultHeader title="프로젝트 지원자 목록" onBack={onClose} />
        <div className="als-content" ref={contentRef}>
          {loading && <p className="description">지원자 목록을 불러오는 중...</p>}
          {error && <p className="description" style={{color: "red"}}>{error}</p>}
          {!loading && !error && (
            <>
              {hasSelection ? (
                <div className="selected-banner">
                  <p className="selected-title">[모집자]님이 선정했어요.</p>
                  <p className="selected-sub">함께하게 될 팀원들이에요!</p>
                  <div className="selected-avatars">
                    {selectedTeamMembers.map((m) => (
                      <div className="selected-avatar" key={`selected-${m.id}`}>
                        <img src={m.img} alt={m.name} />
                        <p>{m.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="description">지원자 목록에서 함께 할 팀원을 선정해주세요.</p>
              )}
              <hr />
              <p className="highlight-text">
                <span className="project-name">[프로젝트명]</span>에 지원한 <br />
                <span className="red">예비 팀원 목록</span>이에요.
              </p>
              <div className="avatars-container">
                <div className="avatars-grid">
                   {applicants.map((a) => {
                     const isSelected = selectedTeamMembers.some((m) => m.id === a.id);
                     const isApproved = a.status === 'ACCEPTED';
                     return (
                       <div
                         key={a.id}
                         className={`avatar-card ${isSelected || isApproved ? "selected" : ""}`}
                         onClick={() => handleApplicantClick(a)}
                       >
                         <img src={a.img} alt={a.name} />
                         <p>{a.name}</p>
                         {isApproved && <span className="approved-badge">✓</span>}
                       </div>
                     );
                   })}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="bottom-fixed-button">
          <button
            className={`select-team-button ${hasSelection ? "active" : ""}`}
            onClick={hasSelection ? handleStartProject : undefined}
            disabled={!hasSelection}
          >
            {hasSelection ? "프로젝트 시작하기!" : "함께 할 팀원을 선정하세요."}
          </button>
        </div>
      </div>
      
      {/* 지원자 상세 모달 */}
      <ApplicantDetailModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        applicant={selectedApplicant}
        onInvite={handleInvite}
      />
    </>
  );
}
