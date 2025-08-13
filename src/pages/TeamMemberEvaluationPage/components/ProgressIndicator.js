import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';

const ProgressIndicator = ({ currentStep, totalSteps = 5 }) => {
  return (
    <div className={styles.progressIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <div className={`${styles.progressStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}>
              <span className={styles.stepNumber}>{isCompleted ? '✓' : stepNumber}</span>
            </div>
            {stepNumber < totalSteps && (
              <div className={`${styles.progressLine} ${isCompleted ? styles.completed : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressIndicator; 