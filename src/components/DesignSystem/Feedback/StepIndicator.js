import React from 'react';
import styles from './StepIndicator.module.scss';
import firstStep from '../../../assets/icons/first-step.png';
import secondStep from '../../../assets/icons/second-step.png';
import secondStepOrange from '../../../assets/icons/second-step-orange.png';
import checkStep from '../../../assets/icons/check-step.png';
import lineGray from '../../../assets/icons/line-gray.png';
import lineOrange from '../../../assets/icons/line-orange.png';

const StepIndicator = ({ currentStep, totalSteps }) => {
    const getStepImage = (stepNum) => {
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        // Step 1
        if (stepNum === 1) {
            return isCompleted ? checkStep : firstStep;
        }

        // Step 2
        if (stepNum === 2) {
            return isCurrent ? secondStepOrange : secondStep;
        }

        return null;
    };

    return (
        <div className={styles.indicatorContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNum = index + 1;
                const stepImage = getStepImage(stepNum);

                return (
                    <div key={stepNum} className={styles.stepWrapper}>
                        {/* Step Image */}
                        <img
                            src={stepImage}
                            alt={`Step ${stepNum}`}
                            className={styles.stepImage}
                        />

                        {/* Separator (except for last step) */}
                        {stepNum < totalSteps && (
                            <img
                                src={stepNum < currentStep ? lineOrange : lineGray}
                                alt="separator"
                                className={styles.separator}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
