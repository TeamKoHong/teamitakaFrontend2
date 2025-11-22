import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import Button from '../../../components/DesignSystem/Button/Button';
import BottomCTA from '../../../components/DesignSystem/Layout/BottomCTA';
import RatingStars from '../../../components/DesignSystem/Input/RatingStars';

const EvaluationStep3 = ({
  memberData,
  evaluationData,
  nextPendingMember,
  onGoNext,
  onGoHome
}) => {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').replace('.', '');

  return (
    <div className={styles.stepContainer}>
      <div className={styles.successWrap}>
        {/* Completed Member Card */}
        {memberData && (
          <div className={styles.completedMemberCard}>
            <div className={styles.cardHeader}>
              <div className={styles.roleTag}>담당 업무</div>
              <div className={styles.evalDate}>{today} (평가날짜)</div>
            </div>
            <div className={styles.cardBody}>
              <img src={memberData.avatar} alt={memberData.name} className={styles.memberAvatar} />
              <div className={styles.memberInfo}>
                <div className={styles.memberName}>{memberData.name}</div>
                <div className={styles.starRating}>
                  <RatingStars value={evaluationData?.overallRating || 0} readOnly size="sm" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        <div className={styles.successContent}>
          <div className={styles.checkIconCircle}>✓</div>
          <div className={styles.successMessage}>팀원 평가를 완료했어요!</div>
        </div>

        {/* Buttons */}
        <BottomCTA>
          <div className={styles.buttonBlock}>
            {nextPendingMember && (
              <Button
                variant="primary"
                fullWidth
                onClick={onGoNext}
                rightIcon={<span>→</span>}
              >
                다음 팀원 평가하러 가기
              </Button>
            )}

            <button
              className={styles.homeLink}
              onClick={onGoHome}
            >
              프로젝트 관리 홈으로
            </button>
          </div>
        </BottomCTA>
      </div>
    </div>
  );
};

export default EvaluationStep3;