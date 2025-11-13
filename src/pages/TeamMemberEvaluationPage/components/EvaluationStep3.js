import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import RatingInputStars from '../../../components/RatingManagement/RatingInputStars/RatingInputStars';

const EvaluationStep3 = ({
  memberData,
  evaluationData,
  nextPendingMember,
  remainingCount,
  onGoNext,
  onGoHome
}) => {
  return (
    <div className={styles.stepContainer}>

      <div className={styles.successWrap}>
        {/* 상단 완료 표시 */}
        <div className={styles.successTop}>
          <div className={styles.checkIconCircle}>✓</div>
          <div className={styles.title}>저장 완료</div>
        </div>

        {/* 간단 정보 */}
        {memberData && (
          <>
            <div className={styles.memberRow}>
              <img src={memberData.avatar} alt={memberData.name} className={styles.plainAvatar} />
              <div className={styles.memberMeta}>
                <div className={styles.memberName}>{memberData.name}</div>
                <div className={styles.starRow}>
                  <RatingInputStars initialRating={evaluationData?.overallRating || 0} readOnly={true} />
                </div>
              </div>
            </div>
            <div className={styles.caption}>본인이 맡은 임무는 착실하게 해내는 팀원입니다.</div>
          </>
        )}

        {/* 남은 평가 대상 수 표시 */}
        {remainingCount > 0 && (
          <div className={styles.remainingInfo}>
            남은 평가 대상: {remainingCount}명
          </div>
        )}

        <div className={styles.buttonBlock}>
          {/* 다음 팀원 평가하기 버튼 (nextPendingMember가 있을 때만) */}
          {nextPendingMember && (
            <button
              className={`${styles.button} ${styles.primary}`}
              onClick={onGoNext}
            >
              다음 팀원 평가하기
            </button>
          )}

          {/* 프로젝트 관리로 돌아가기 버튼 */}
          <button
            className={`${styles.button} ${nextPendingMember ? styles.secondary : styles.primary}`}
            onClick={onGoHome}
          >
            프로젝트 관리로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationStep3;