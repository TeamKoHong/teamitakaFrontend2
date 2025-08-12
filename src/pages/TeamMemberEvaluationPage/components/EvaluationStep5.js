import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';

const EvaluationStep5 = () => {
  return (
    <div className={styles.stepContainer}>
      {/* 진행 표시기 */}
  <ProgressIndicator currentStep={3} totalSteps={3} />
      
      {/* 전송 완료 섹션 */}
      <div className={styles.successSection}>
        <div className={styles.successIcon}>
          <span className={styles.checkmark}>✓</span>
        </div>
        <div className={styles.successMessage}>
          전송 완료
        </div>
        <div className={styles.successDescription}>
          평가가 성공적으로 제출되었습니다!
        </div>
        <div className={styles.successDescription}>
          잠시 후 평가 관리 페이지로 이동합니다.
        </div>
      </div>
    </div>
  );
};

export default EvaluationStep5; 