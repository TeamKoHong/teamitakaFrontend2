import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';

const EvaluationStep5 = () => {
  return (
    <div className={styles.stepContainer}>
      {/* 진행 표시기 */}
      <ProgressIndicator currentStep={5} totalSteps={5} />
      
      {/* 전송 완료 섹션 */}
      <div className={styles.successSection}>
        <div className={styles.successIcon}>
          <span className={styles.checkmark}>✓</span>
        </div>
        <div className={styles.successMessage}>
          전송 완료
        </div>
      </div>
    </div>
  );
};

export default EvaluationStep5; 