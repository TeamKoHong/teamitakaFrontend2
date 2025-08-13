import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import RatingInputStars from '../../../components/RatingManagement/RatingInputStars/RatingInputStars';

const EvaluationStep3 = ({ memberData, evaluationData, onGoProject, onGoHome }) => {
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
              <img src={memberData.avatar} alt={memberData.name} className={styles.memberAvatar} />
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

        <div className={styles.buttonBlock}>
          <button className={`${styles.button} ${styles.primary}`} onClick={onGoProject}>완료</button>
        </div>

        <div className={styles.centerLink} role="button" tabIndex={0} onClick={onGoHome}>프로젝트 관리 홈으로</div>
      </div>
    </div>
  );
};

export default EvaluationStep3;