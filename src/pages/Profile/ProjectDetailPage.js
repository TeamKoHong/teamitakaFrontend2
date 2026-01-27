import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProjectDetailPage.module.scss';

// 서비스 함수 임포트
import { fetchProjectDetails, fetchReviewSummary } from '../../services/rating';

// Assets
import backIcon from '../../assets/back.png';
import linkIconPng from '../../assets/icons/link.png';
import profileDefault from '../../assets/profile_default.png';

/**
 * URL에서 도메인만 추출하거나 프로토콜을 제거하여 표시용 텍스트 생성
 */
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
  const [ratingData, setRatingData] = useState({ average: 0 }); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        
        // 1. 프로젝트 상세 정보와 별점 요약을 동시에 호출
        const [projectRes, reviewRes] = await Promise.all([
          fetchProjectDetails(projectId),
          fetchReviewSummary(projectId).catch(() => ({ data: { averageRating: 0 } }))
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

  if (isLoading) return <div className={styles.loading}>데이터를 불러오는 중입니다...</div>;
  if (!projectData) return <div className={styles.error}>프로젝트 정보를 찾을 수 없습니다.</div>;

  const resultUrl = projectData.result_link || projectData.result_url;

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <img src={backIcon} alt="뒤로가기" />
        </button>
        <h1 className={styles.headerTitle}>나의 프로젝트</h1>
        <div style={{ width: '24px' }} /> {/* 좌우 밸런스를 위한 더미 공간 */}
      </header>

      {/* 메인 이미지 영역 */}
      <div className={styles.mainImageArea}>
        <img 
          src={projectData.photo_url || projectData.thumbnail || profileDefault} 
          alt="썸네일" 
          className={styles.mainImage} 
        />
      </div>

      {/* 프로젝트 상세 정보 섹션 */}
      <section className={styles.infoSection}>
        <h2 className={styles.projectTitle}>
          {projectData.title?.replace("[상호평가 완료]", "").trim()}
        </h2>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 기간</span>
            <span className={styles.value}>
              {projectData.start_date || '미정'} - {projectData.end_date || '미정'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 정보</span>
            <span className={styles.value}>{projectData.description || '정보가 없습니다.'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>프로젝트 유형</span>
            <span className={styles.value}>
              {projectData.project_type === 'side' ? '사이드 프로젝트' : '교내 프로젝트'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>참여인원</span>
            <span className={styles.value}>
               {projectData.memberCount || '정보 없음'}
            </span>
          </div>
        </div>

        {/* 키워드/해시태그 영역 */}
        <div className={styles.tagWrapper}>
          <div className={styles.keywordLabel}>키워드</div>
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

      {/* 프로젝트 결과물 섹션 */}
      <section className={styles.resultSection}>
        <h3 className={styles.sectionTitle}>프로젝트 결과물</h3>
        {resultUrl ? (
          <a 
            href={resultUrl} 
            className={styles.resultLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={linkIconPng} alt="링크" className={styles.linkIcon} />
            <span className={styles.urlText}>{displayText(resultUrl)}</span>
          </a>
        ) : (
          <p className={styles.emptyText}>등록된 결과물이 없습니다</p>
        )}
      </section>

      <hr className={styles.sectionDivider} />

      {/* 내가 받은 별점 섹션 */}
      <section className={styles.ratingSection}>
        <h3 className={styles.ratingTitle}>내가 받은 별점</h3>
        <div className={styles.starContainer}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={star <= Math.round(ratingData.average) ? styles.starActive : styles.starInactive}
              >
                ★
              </span>
            ))}
          </div>
          <span className={styles.ratingScore}>
            {Number(ratingData.average).toFixed(1)}
          </span>
        </div>
      </section>
    </div>
  );
}