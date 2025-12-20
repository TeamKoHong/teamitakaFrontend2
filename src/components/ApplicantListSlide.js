import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultHeader from "./Common/DefaultHeader";
import ApplicantDetailModal from "./ApplicantDetailModal";
import TeamMatchingComplete from "./TeamMatchingComplete";
import { getRecruitmentApplicants} from "../services/recruitment";
import userDefaultImg from "../assets/icons/user_default_img.svg";
import deleteIcon from "../assets/icons/deleteIcon.svg";
import arrowIcon from "../assets/icons/arrow_back_ios.svg";
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
  
  // Team Matching Complete state
  const [isMatchingCompleteOpen, setIsMatchingCompleteOpen] = useState(false);
  
  // Drag & Drop states
  const [draggedApplicant, setDraggedApplicant] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const longPressTimer = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

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
            img: app.User?.avatar || userDefaultImg,
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

        // 슬라이드를 열 때마다 선택 상태 초기화 (로컬 상태로만 관리)
        setSelectedTeamMembers([]);
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

  const handleInvite = (applicant) => {
    // 로컬 상태로만 관리 (백엔드 API는 프로젝트 시작 시에만 호출)
    setSelectedTeamMembers((prev) => {
      const exists = prev.some((m) => m.id === applicant.id);
      if (exists) return prev; // 중복 방지
      return [...prev, applicant];
    });

    // 로컬 applicants 상태도 업데이트
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === applicant.id
          ? { ...a, status: 'ACCEPTED' }
          : a
      )
    );

    setIsModalOpen(false);
    setSelectedApplicant(null);

    // 상단 배너가 바로 보이도록 스크롤 업
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  const hasSelection = selectedTeamMembers.length > 0;

  // 슬라이드 닫을 때 상태 초기화
  const handleClose = () => {
    setSelectedTeamMembers([]);
    setDraggedApplicant(null);
    setIsDragging(false);
    setIsOverDeleteZone(false);
    setSelectedApplicant(null);
    setIsModalOpen(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    onClose();
  };

  const handleStartProject = () => {
    if (!hasSelection || !recruitmentId) {
      console.log("❌ 조건 미충족 - return");
      return;
    }

    console.log("✅ 선택된 팀원:", selectedTeamMembers);
    console.log("✅ 팀 매칭 완료 슬라이드 열기");
    // 팀 매칭 완료 슬라이드 열기
    setIsMatchingCompleteOpen(true);
  };

  const handleMatchingCompleteClose = () => {
    setIsMatchingCompleteOpen(false);
    // 팀 매칭 완료가 닫히면 지원자 목록도 닫기
    onClose();
  };

  // Drag handlers (for selected team members only)
  const handleLongPressStart = (e, applicant) => {
    e.stopPropagation();
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    dragStartPos.current = { x: clientX, y: clientY };

    longPressTimer.current = setTimeout(() => {
      // Long press 완료 시 드래그 가능 상태로만 설정 (아직 드래그 중은 아님)
      setDraggedApplicant(applicant);
      setDragPosition({ x: clientX, y: clientY });
    }, 500); // 500ms long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDragMove = (e) => {
    if (!draggedApplicant) return;

    e.preventDefault();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    // 실제 움직임이 있을 때만 드래그 상태로 전환 (최소 5px 이동)
    if (!isDragging) {
      const deltaX = Math.abs(clientX - dragStartPos.current.x);
      const deltaY = Math.abs(clientY - dragStartPos.current.y);
      
      if (deltaX > 5 || deltaY > 5) {
        setIsDragging(true);
      } else {
        return; // 아직 충분히 움직이지 않음
      }
    }

    setDragPosition({ x: clientX, y: clientY });

    // Check if over delete zone (bottom 150px)
    const windowHeight = window.innerHeight;
    setIsOverDeleteZone(clientY > windowHeight - 150);
  };

  const handleDragEnd = () => {
    // 드래그 가능 상태였지만 실제로 드래그하지 않았으면 그냥 리셋
    if (!isDragging && draggedApplicant) {
      setDraggedApplicant(null);
      handleLongPressEnd();
      return;
    }

    if (!isDragging || !draggedApplicant) return;

    // If over delete zone, remove from selected team members
    if (isOverDeleteZone) {
      setSelectedTeamMembers((prev) => 
        prev.filter((m) => m.id !== draggedApplicant.id)
      );
      
      // 예비 팀원 목록의 상태도 업데이트
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === draggedApplicant.id
            ? { ...a, status: 'PENDING' }
            : a
        )
      );
    }

    // Reset drag state
    setDraggedApplicant(null);
    setIsDragging(false);
    setIsOverDeleteZone(false);
    handleLongPressEnd();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <>
      <div className={`als-overlay ${open ? "open" : ""}`} onClick={handleClose} />
      <div 
        className={`als-panel ${open ? "open" : ""}`}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <DefaultHeader title="프로젝트 지원자 목록" onBack={handleClose} />
        <div className="als-content" ref={contentRef}>
          {loading && <p className="description">지원자 목록을 불러오는 중...</p>}
          {error && <p className="description" style={{color: "red"}}>{error}</p>}
          {!loading && !error && (
            <>
              {hasSelection ? (
                <div className="selected-banner">
                  <p className="selected-title">[모집자]님이 선정했어요.</p>
                  <p className="selected-sub">함께하게 될 팀원들<span>이에요!</span></p>
                  <div className="selected-avatars">
                    {selectedTeamMembers.map((m) => {
                      const isBeingDragged = draggedApplicant?.id === m.id;
                      return (
                        <div 
                          className={`selected-avatar ${isBeingDragged ? "dragging" : ""}`}
                          key={`selected-${m.id}`}
                          onMouseDown={(e) => handleLongPressStart(e, m)}
                          onMouseUp={handleLongPressEnd}
                          onMouseLeave={handleLongPressEnd}
                          onTouchStart={(e) => handleLongPressStart(e, m)}
                          onTouchCancel={handleLongPressEnd}
                        >
                          <img src={m.img} alt={m.name} />
                          <p>{m.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="description-container">
                  <p className="description-title">함께 할 팀원을 선정해주세요.</p>
                  <p className="description-text">원하는 지원자 프로필을 꾹 눌러 드래그 해보세요!</p>
                </div>
                
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
                     return (
                       <div
                         key={a.id}
                         className={`avatar-card ${isSelected ? "selected" : ""}`}
                         onClick={() => handleApplicantClick(a)}
                       >
                         <img src={a.img} alt={a.name} />
                         <p>{a.name}</p>
                       </div>
                     );
                   })}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Delete Zone - 드래그 중일 때만 표시 */}
        {isDragging ? (
          <div className={`bottom-fixed-button dragging-mode ${isOverDeleteZone ? "delete-zone-active" : ""}`}>
            <div className="delete-zone-content">
              <div className="arrow-indicators">
                <img src={arrowIcon} alt="" className="arrow-icon arrow-1" />
                <img src={arrowIcon} alt="" className="arrow-icon arrow-2" />
                <img src={arrowIcon} alt="" className="arrow-icon arrow-3" />
              </div>
              <div className="delete-icon-wrapper">
                <img src={deleteIcon} alt="삭제" className="delete-icon" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bottom-fixed-button">
            <button
              className={`select-team-button ${hasSelection ? "active" : ""}`}
              onClick={hasSelection ? handleStartProject : undefined}
              disabled={!hasSelection}
            >
              {hasSelection ? "다음" : "함께 할 팀원을 선정하세요."}
            </button>
          </div>
        )}

        {/* Dragging Avatar */}
        {isDragging && draggedApplicant && (
          <div 
            className="dragging-avatar"
            style={{
              position: 'fixed',
              left: dragPosition.x - 32,
              top: dragPosition.y - 32,
              pointerEvents: 'none',
              zIndex: 10000,
            }}
          >
            <img src={draggedApplicant.img} alt={draggedApplicant.name} />
            <p>{draggedApplicant.name}</p>
          </div>
        )}
      </div>
      
      {/* 지원자 상세 모달 */}
      <ApplicantDetailModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        applicant={selectedApplicant}
        onInvite={handleInvite}
      />

      {/* 팀 매칭 완료 슬라이드 */}
      <TeamMatchingComplete
        open={isMatchingCompleteOpen}
        onClose={handleMatchingCompleteClose}
        selectedMembers={selectedTeamMembers}
        recruitmentId={recruitmentId}
      />
    </>
  );
}
