import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RatingProjectStatusPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import RatingSummaryCard from '../../components/RatingManagement/RatingSummaryCard/RatingSummaryCard';
// IndividualRatingReview 컴포넌트 임포트 경로 및 방식 수정 (가장 중요!)
import IndividualRatingReview from '../../components/RatingManagement/IndividualRatingReview/IndividualRatingReview.js';
import { fetchProjectStatus } from '../../services/rating';

function RatingProjectStatusPage() {
  const { projectId } = useParams();
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProjectStatus = async () => {
      setLoading(true);
      try {
        const status = await fetchProjectStatus(projectId);
        setProjectStatus(status);
      } catch (err) {
        setError("평가 현황을 불러오는데 실패했습니다.");
        console.error("Failed to fetch project status:", err);
      } finally {
        setLoading(false);
      }
    };
    getProjectStatus();
  }, [projectId]);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>오류: {error}</div>;
  }

  if (!projectStatus) {
    return <div className={styles.noData}>평가 현황 데이터를 찾을 수 없습니다.</div>;
  }

  const completionPercentage = projectStatus.totalMembers > 0
    ? (projectStatus.completedRatings / projectStatus.totalMembers) * 100
    : 0;

  return (
    <div className={styles.container}>
      <DefaultHeader title="평가 현황" />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>{projectStatus.name}</h1>

        <section className={styles.statusSection}>
          <div className={styles.statusOverview}>
            <p className={styles.averageRating}>
              전체 평균: <span>{projectStatus.averageRating.toFixed(1)} / 5</span>
            </p>
            <p className={styles.completion}>
              평가 완료: {projectStatus.completedRatings} / {projectStatus.totalMembers}명 ({completionPercentage.toFixed(0)}%)
            </p>
          </div>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </section>

        <section className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>카테고리별 요약</h2>
          <div className={styles.summaryCards}>
            <RatingSummaryCard
              totalScore={projectStatus.averageRating}
              categories={projectStatus.categories.map(cat => ({ name: cat.name, score: cat.average }))}
            />
          </div>
        </section>

        <section className={styles.reviewsSection}>
          <h2 className={styles.sectionTitle}>개별 피드백</h2>
          <div className={styles.individualReviews}>
            {projectStatus.individualReviews.length > 0 ? (
              projectStatus.individualReviews.map((review) => (
                <IndividualRatingReview key={review.id} review={review} />
              ))
            ) : (
              <p className={styles.noReviews}>아직 제출된 개별 피드백이 없습니다.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default RatingProjectStatusPage;