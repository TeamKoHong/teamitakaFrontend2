import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProjectDetailPage.module.scss';

// 1. 검증된 서비스 함수 임포트
import { fetchProjectDetails } from '../../services/rating';

// Assets
import backIcon from '../../assets/back.png';
import linkIconPng from '../../assets/icons/link.png';
import profileDefault from '../../assets/profile_default.png';

function displayText(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.host;
  } catch (e) {
    return url.replace(/^https?:\/\//, '');
  }
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setIsLoading(true);
        // 2. '/api/projects/${projectId}' 주소로 정확히 호출함
        const response = await fetchProjectDetails(projectId);
        
        // 서비스에서 이미 JSON 처리를 하므로 response.data 혹은 response를 바로 사용
        const data = response.data || response;
        setProjectData(data);
      } catch (err) {
        console.error('상세 정보 로드 실패:', err);
        setError("프로젝트 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) loadProjectData();
  }, [projectId]);

  if (isLoading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!projectData) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={backIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.headerTitle}>나의 프로젝트</h1>
        <button className={styles.editButton}>편집</button>
      </header>

      <div className={styles.mainImageArea}>
        <img 
          src={projectData.photo_url || profileDefault} 
          alt="썸네일" 
          className={styles.mainImage} 
        />
      </div>

      <section className={styles.infoSection}>
        <h2 className={styles.projectTitle}>
          {projectData.title?.replace("[상호평가 완료]", "").trim()}
        </h2>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 기간</span>
            <span className={styles.value}>
              {projectData.start_date} - {projectData.end_date}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 정보</span>
            <span className={styles.value}>{projectData.description}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 유형</span>
            <span className={styles.value}>
              {projectData.project_type === 'side' ? '사이드 프로젝트' : '수업 프로젝트'}
            </span>
          </div>
        </div>

        <div className={styles.tagWrapper}>
          <span className={styles.label}>키워드</span>
          <div className={styles.tags}>
            {/* 백엔드 모델 구조에 따라 Hashtags 혹은 keywords 사용 */}
            {(projectData.Hashtags || projectData.keywords || []).map((tag, i) => (
              <span key={i} className={styles.tag}>
                #{typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.sectionDivider} />

      <section className={styles.resultSection}>
        <h3 className={styles.sectionTitle}>프로젝트 결과물</h3>
        {projectData.result_link ? (
          <a href={projectData.result_link} className={styles.resultLink} target="_blank" rel="noopener noreferrer">
            <img src={linkIconPng} alt="링크" className={styles.linkIcon} />
            <span className={styles.urlText}>{displayText(projectData.result_link)}</span>
          </a>
        ) : (
          <p className={styles.emptyText}>등록된 결과물이 없습니다</p>
        )}
      </section>
    </div>
  );
}