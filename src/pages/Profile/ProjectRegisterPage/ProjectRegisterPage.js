import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileDetail } from '../../../services/profile'; // 기존 서비스 재사용
import styles from './ProjectRegisterPage.module.scss';

// Assets
import backIcon from '../../../assets/back.png';
// 체크 아이콘 (SVG 컴포넌트)
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
// 문서 아이콘 (SVG 컴포넌트)
const DocIcon = ({ isSelected }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={isSelected ? "white" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={isSelected ? "white" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ProjectRegisterPage() {
  const navigate = useNavigate();
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // 단일 선택
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제로는 "불러올 수 있는 프로젝트 목록"을 주는 API를 호출해야 하지만,
    // 여기서는 전체 프로젝트를 가져와서 필터링하는 방식으로 구현합니다.
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await getProfileDetail();
        
        if (response.success) {
          const allProjects = response.data.projects || [];
          
          // 조건: 상호평가가 완료된 프로젝트 (COMPLETED) 이면서
          // 아직 프로필에 등록되지 않은 것(API에서 구분해주지 않는다면 클라이언트에서 처리)
          // 여기서는 예시로 status가 'COMPLETED'인 모든 프로젝트를 불러옵니다.
          // 테스트를 위해 강제로 더미 데이터를 섞을 수도 있습니다.
          
          const completedProjects = allProjects.filter(p => {
             const status = String(p.status || "").toUpperCase();
             // 실제 로직: COMPLETED 상태이거나 제목에 [상호평가 완료]가 있는 경우
             return status === "COMPLETED" || p.title.includes("[상호평가 완료]");
          });

          // 만약 데이터가 없으면 테스트용 더미 데이터를 넣어 보여줍니다 (개발용)
          if (completedProjects.length === 0) {
              setAvailableProjects([
                  { id: 'dummy1', title: '미래 모빌리티 디자인', description: '수업 프로젝트', type: '수업 프로젝트' },
                  { id: 'dummy2', title: '비주얼 마케팅 디자인 팀원 모집', description: '사이드 프로젝트', type: '사이드 프로젝트' },
              ]);
          } else {
              setAvailableProjects(completedProjects);
          }
        }
      } catch (error) {
        console.error("프로젝트 로딩 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSelect = (id) => {
    // 이미 선택된 것을 누르면 해제, 아니면 선택
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    } else {
      setSelectedProjectId(id);
    }
  };

  const handleSubmit = () => {
    if (!selectedProjectId) return;
    
    // 여기서 백엔드로 "이 프로젝트를 내 프로필에 등록하겠다"는 요청을 보냅니다.
    // 성공 시 프로필 페이지로 이동
    console.log(`Loading project ${selectedProjectId}...`);
    
    // 예시: 등록 API 호출 await registerProject(selectedProjectId);
    
    alert('프로젝트가 성공적으로 불러와졌습니다!');
    navigate('/profile'); 
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로가기" />
        </button>
        <div className={styles.headerTitle}>완료된 프로젝트 불러오기</div>
      </div>

      {/* 리스트 콘텐츠 */}
      <div className={styles.content}>
        {isLoading ? (
          <div>로딩 중...</div>
        ) : availableProjects.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            불러올 수 있는 완료된 프로젝트가 없습니다.
          </div>
        ) : (
          availableProjects.map((project) => {
            const isSelected = selectedProjectId === (project.projectId || project.id);
            const projectId = project.projectId || project.id;

            return (
              <div 
                key={projectId} 
                className={`${styles.projectCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleSelect(projectId)}
              >
                <div className={styles.cardIconWrapper}>
                  <DocIcon isSelected={isSelected} />
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardType}>
                    {project.type || "팀 프로젝트"} {/* 데이터에 type이 없으면 기본값 */}
                  </span>
                  <span className={styles.cardTitle}>{project.title}</span>
                  <span className={styles.cardDesc}>{project.description || "프로젝트 설명이 없습니다."}</span>
                </div>
                {isSelected && <CheckIcon className={styles.checkIcon} />}
              </div>
            );
          })
        )}
      </div>

      {/* 하단 버튼 */}
      <div className={styles.bottomButtonContainer}>
        <button 
          className={`${styles.loadButton} ${selectedProjectId ? styles.active : ''}`}
          disabled={!selectedProjectId}
          onClick={handleSubmit}
        >
          불러오기
        </button>
      </div>
    </div>
  );
}