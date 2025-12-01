import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ReceivedFeedbackDetailPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import DetailCommentCard from '../../components/RatingProjectPage/DetailCommentCard';
import ReadOnlyProgressBar from '../../components/RatingProjectPage/ReadOnlyProgressBar';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import { getMockProjectSummary } from '../../fixtures/projectSummary';

/**
 * 내가 받은 평가지 상세 페이지
 * - 특정 팀원이 남긴 평가 상세 정보를 표시
 * - 코멘트와 카테고리별 점수를 함께 표시
 */
export default function ReceivedFeedbackDetailPage() {
  const { projectId, memberId } = useParams();
  const navigate = useNavigate();

  const mock = getMockProjectSummary(projectId);

  // memberId로 해당 코멘트 찾기 (없으면 인덱스로 폴백)
  const commentIndex = parseInt(memberId, 10);
  const comment = mock.comments?.find(c => c.memberId === memberId)
    || mock.comments?.[commentIndex]
    || mock.comments?.[0];

  const sliders = mock.sliders || [];

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigateToGiven = () => {
    navigate(`/evaluation/project/${projectId}/given`);
  };

  return (
    <div className={styles.pageBg}>
      <DefaultHeader
        title="내가 받은 평가지"
        onBack={handleBack}
        rightElement={
          <button className={styles.headerBtn} onClick={handleNavigateToGiven}>
            내가 한 평가
          </button>
        }
      />

      <div className={styles.scrollArea}>
        {/* 평가자 코멘트 */}
        <section className={styles.commentSection}>
          <DetailCommentCard
            avatar={comment?.avatar}
            text={comment?.text}
          />
        </section>

        {/* 카테고리별 점수 */}
        <section className={styles.slidersSection}>
          <h2 className={styles.sectionLabel}>카테고리별 점수</h2>
          <div className={styles.sliderCards}>
            {sliders.map((item, i) => (
              <div key={i} className={styles.sliderCard}>
                <ReadOnlyProgressBar label={item.name} value={item.value} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
