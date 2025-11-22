import React from 'react';
import styles from './StepIndicator.module.scss';

const StepIndicator = ({ currentStep, totalSteps }) => {
    return (
        <div className={styles.indicatorContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                    <div key={stepNum} className={styles.stepWrapper}>
                        {/* Step Circle */}
                        <div
                            className={`
                ${styles.stepCircle} 
                ${isCurrent ? styles.current : ''} 
                ${isCompleted ? styles.completed : ''}
              `}
                        >
                            {isCompleted ? (
                                <span className={styles.checkIcon}>✓</span>
                            ) : (
                                stepNum
                            )}
                        </div>

                        {/* Separator (except for last step) */}
                        {stepNum < totalSteps && (
                            <div className={`${styles.separator} ${stepNum < currentStep ? styles.active : ''}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
