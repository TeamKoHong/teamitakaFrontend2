import React, { useState } from "react";
import "./TeamMatchingComplete.scss";
import DefaultHeader from "./Common/DefaultHeader";
import userDefaultImg from "../assets/icons/user_default_img.svg";
import KickoffSlide from "./Kickoff/KickoffSlide";
import { createProjectFromRecruitment } from "../services/recruitment";
import { useNavigate } from "react-router-dom";

export default function TeamMatchingComplete({ open, onClose, selectedMembers, recruitmentId, onNext }) {
  const navigate = useNavigate();
  const [kickoffOpen, setKickoffOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    // 킥오프 슬라이드 열기
    setKickoffOpen(true);
  };

  const handleKickoffComplete = async (kickoffData) => {
    if (!recruitmentId || !selectedMembers || selectedMembers.length === 0) {
      alert('필수 정보가 누락되었습니다.');
      return;
    }

    setLoading(true);
    
    try {
      // API 요청 데이터 구성
      const requestData = {
        title: kickoffData.title,
        resolution: kickoffData.desc || '', // 설명 또는 다짐
        start_date: kickoffData.start,
        end_date: kickoffData.end,
        memberUserIds: selectedMembers.map(member => member.user_id)
      };

      console.log('✅ 프로젝트 생성 요청:', requestData);

      // 프로젝트 생성 API 호출
      const result = await createProjectFromRecruitment(recruitmentId, requestData);
      
      console.log('✅ 프로젝트 생성 성공:', result);
      alert('프로젝트가 생성되었습니다!');

      // 킥오프 슬라이드 닫기
      setKickoffOpen(false);
      
      // 팀 매칭 완료 슬라이드도 닫기
      if (onClose) {
        onClose();
      }

      // 내 프로젝트 관리 페이지로 이동
      navigate('/project-management');
      
    } catch (err) {
      console.error('❌ 프로젝트 생성 실패:', err);
      
      if (err.code === 'UNAUTHORIZED') {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else if (err.code === 'ALREADY_CONVERTED') {
        alert('이미 프로젝트로 전환된 모집글입니다.');
        setKickoffOpen(false);
        if (onClose) {
          onClose();
        }
      } else {
        alert(err.message || '프로젝트 생성에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKickoffClose = () => {
    setKickoffOpen(false);
  };

  return (
    <>
      <div className={`tmc-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`tmc-panel ${open ? "open" : ""}`}>
        <DefaultHeader title="팀 매칭 완료" onBack={onClose} />
        
        <div className="tmc-content">
          <div className="tmc-members">
            {selectedMembers && selectedMembers.length > 0 ? (
              selectedMembers.map((member) => (
                <div key={member.id} className="tmc-member-card">
                  <img 
                    src={member.img || userDefaultImg} 
                    alt={member.name} 
                    className="tmc-member-avatar"
                  />
                </div>
              ))
            ) : (
              <p className="tmc-empty">선택된 팀원이 없습니다.</p>
            )}
          </div>

          <div className="tmc-message">
            <div className="tmc-title">
              팀 매칭이 <span className="highlight">완료</span>되었어요!
            </div>
            <p className="tmc-subtitle">
              킥오프를 작성해 팀원을 시작해보세요.
            </p>
          </div>
        </div>
        <div className="tmc-footer">
          <button 
            className="tmc-button active"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? '처리 중...' : '킥오프 작성하기'}
          </button>
        </div>
      </div>

      {/* 킥오프 작성 슬라이드 */}
      <KickoffSlide
        open={kickoffOpen}
        onClose={handleKickoffClose}
        onComplete={handleKickoffComplete}
      />
    </>
  );
}

