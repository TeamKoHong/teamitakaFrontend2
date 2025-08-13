import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';
import RatingInputStars from '../../../components/RatingManagement/RatingInputStars/RatingInputStars';

const EvaluationStep3 = ({ memberData, evaluationData, onGoProject, onGoHome }) => {
  return (
    <div className={styles.stepContainer}>
      {/* 진행 표시기 */}
      <ProgressIndicator currentStep={2} totalSteps={2} />

      {/* 완료 섹션 */}
      <div className={styles.successSection}>
        <div className={styles.successIcon}>
          <span className={styles.checkmark}>✓</span>
        </div>
        <div className={styles.successMessage}>저장 완료</div>
        <div className={styles.successDescription}></div>
      </div>

      {/* 간단 정보 */}
      {memberData && (
        <div className={styles.projectInfoCard}>
          <div className={styles.memberProfiles}>
            <div className={styles.currentMember}>
              <img src={memberData.avatar} alt={memberData.name} className={styles.profileImage} />
              <div className={styles.memberInfo}>
                <div className={styles.memberName}>{memberData.name}</div>
              </div>
            </div>
          </div>
          <div className={styles.starsContainer}>
            <RatingInputStars initialRating={evaluationData?.overallRating || 0} readOnly={true} />
          </div>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.primary}`} onClick={onGoProject}>완료</button>
      </div>

      <div className={styles.centerLink} role="button" tabIndex={0} onClick={onGoHome}>프로젝트 관리 홈으로</div>
    </div>
  );
};

export default EvaluationStep3;