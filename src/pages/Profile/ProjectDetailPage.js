import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProjectDetailPage.module.scss';

// 서비스 함수 임포트 (기본 정보 + 별점 요약)
import { fetchProjectDetails, fetchReviewSummary } from '../../services/rating';

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
  const [ratingData, setRatingData] = useState({ average: 0 }); // 별점 상태 추가
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        
        // 프로젝트 정보와 별점 정보를 동시에 호출
        const [projectRes, reviewRes] = await Promise.all([
          fetchProjectDetails(projectId),
          fetchReviewSummary(projectId).catch(() => ({ data: { averageRating: 0 } })) // 별점 API 에러 시 0점 처리
        ]);
        
        const pData = projectRes.data || projectRes;
        const rData = reviewRes.data || reviewRes;

        setProjectData(pData);
        setRatingData({
          average: rData.averageRating || rData.average || 0
        });

      } catch (err) {
        console.error('데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) loadAllData();
  }, [projectId]);

  if (isLoading) return <div className={styles.loading}>로딩 중...</div>;
  if (!projectData) return <div className={styles.error}>데이터를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={backIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.headerTitle}>나의 프로젝트</h1>
        {/* 편집 버튼 삭제됨 */}
      </header>

      <div className={styles.mainImageArea}>
        <img 
          src={projectData.photo_url || projectData.thumbnail || profileDefault} 
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
        {/* result_link와 result_url 모두 대응 */}
        {(projectData.result_link || projectData.result_url) ? (
          <a 
            href={projectData.result_link || projectData.result_url} 
            className={styles.resultLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={linkIconPng} alt="링크" className={styles.linkIcon} />
            <span className={styles.urlText}>
              {displayText(projectData.result_link || projectData.result_url)}
            </span>
          </a>
        ) : (
          <p className={styles.emptyText}>등록된 결과물이 없습니다</p>
        )}
      </section>

      <hr className={styles.sectionDivider} />

      {/* 별점 섹션 데이터 반영 */}
      <section className={styles.ratingSection}>
        <h3 className={styles.ratingTitle}>내가 받은 별점</h3>
        <div className={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              className={star <= Math.round(ratingData.average) ? styles.starActive : styles.starInactive}
            >
              ★
            </span>
          ))}
          <span className={styles.ratingScore}>
            {Number(ratingData.average).toFixed(1)}
          </span>
        </div>
      </section>
    </div>
  );
}