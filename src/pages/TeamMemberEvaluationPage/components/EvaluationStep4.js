import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';

const EvaluationStep4 = ({
  memberData,
  evaluationData,
  onNext,
  onComplete,
  onEncouragementMessageChange
}) => {
  return (
    <div className={styles.stepContainer}>
      {/* 진행 표시기 */}
      <ProgressIndicator currentStep={4} totalSteps={5} />
      
      {/* 완료 확인 섹션 */}
      <div className={styles.completionSection}>
        <div className={styles.completionIcon}>
          <span className={styles.checkmark}>✓</span>
        </div>
        <div className={styles.completionMessage}>
          평가 팀원 {memberData.name}
        </div>
        <div className={styles.completionMessage}>
          해당 팀원의 평가가 완료 되었습니다. 평가해주셔서 감사합니다.
        </div>
      </div>

      {/* 응원 메시지 섹션 */}
      <div className={styles.encouragementSection}>
        <div className={styles.encouragementLabel}>
          해당 팀원에게 힘이 되는 한마디를 남겨보세요!
        </div>
        <div className={styles.encouragementWarning}>
          비방·비하·욕설이 담긴 글은 작성이 불가합니다.
        </div>
        <textarea
          className={styles.encouragementInput}
          placeholder="힘이 되는 응원의 한마디."
          value={evaluationData.encouragementMessage}
          onChange={(e) => onEncouragementMessageChange(e.target.value)}
        />
      </div>

      {/* 완료 버튼 */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={onComplete}
        >
          완료하기
        </button>
      </div>
    </div>
  );
};

export default EvaluationStep4; 