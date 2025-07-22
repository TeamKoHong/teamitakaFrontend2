import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';

const EvaluationStep1 = ({
  projectData,
  memberData,
  evaluationData,
  onNext,
  onCategoryRatingChange
}) => {
  const categories = [
    {
      key: 'participation',
      name: '참여도',
      description: '해당 팀원의 프로젝트 내에서 참여도를 점수로 평가해주세요'
    },
    {
      key: 'communication',
      name: '소통',
      description: '해당 팀원과의 의사소통 태도를 점수로 평가해주세요'
    },
    {
      key: 'responsibility',
      name: '책임감',
      description: '해당 팀원의 프로젝트 책임감을 점수로 평가해주세요'
    }
  ];

  // 모든 카테고리가 평가되었는지 확인
  const isAllCategoriesRated = categories.every(
    category => evaluationData.categoryRatings[category.key] > 0
  );

  return (
    <div className={styles.stepContainer}>
      {/* 프로젝트 정보 카드 */}
      <div className={styles.projectInfoCard}>
        <div className={styles.projectName}>{projectData.name}</div>
        <div className={styles.projectDescription}>{projectData.description}</div>
        
        {/* 팀원 프로필 */}
        <div className={styles.memberProfiles}>
          <div className={styles.currentMember}>
            <img
              src={memberData.avatar}
              alt={memberData.name}
              className={styles.profileImage}
            />
            <div className={styles.memberInfo}>
              <div className={styles.currentLabel}>현재 평가</div>
              <div className={styles.memberName}>{memberData.name} 팀원</div>
            </div>
          </div>
          <div className={styles.otherMembers}>
            {projectData.members
              .filter(member => member.id !== memberData.id)
              .map((member, index) => (
                <div key={member.id} className={styles.profileItem}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className={`${styles.profileImage} ${member.id === 103 ? styles.completed : ''}`}
                  />
                  {member.id === 103 && (
                    <div className={styles.statusIcon}>
                      <span className={styles.checkmark}>✓</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 진행 표시기 */}
      <ProgressIndicator currentStep={1} totalSteps={2} />

      {/* 질문 */}
      <div className={styles.questionText}>
        해당 팀원의 능력 별 점수는 몇 점인가요?
      </div>

      {/* 카테고리별 평가 섹션 */}
      <div className={styles.categorySection}>
        {categories.map((category) => (
          <div key={category.key} className={styles.categoryItem}>
            <div className={styles.categoryHeader}>
              <div className={styles.categoryName}>{category.name}</div>
              <div className={styles.categoryDescription}>{category.description}</div>
            </div>
            
            <div className={styles.sliderContainer}>
              <div 
                className={styles.sliderTrack}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percentage = (clickX / rect.width) * 100;
                  const value = Math.round((percentage / 20) + 1);
                  const clampedValue = Math.max(1, Math.min(5, value));
                  onCategoryRatingChange(category.key, clampedValue);
                }}
                onTouchStart={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touch = e.touches[0];
                  const touchX = touch.clientX - rect.left;
                  const percentage = (touchX / rect.width) * 100;
                  const value = Math.round((percentage / 20) + 1);
                  const clampedValue = Math.max(1, Math.min(5, value));
                  onCategoryRatingChange(category.key, clampedValue);
                }}
                onTouchMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touch = e.touches[0];
                  const touchX = touch.clientX - rect.left;
                  const percentage = (touchX / rect.width) * 100;
                  const value = Math.round((percentage / 20) + 1);
                  const clampedValue = Math.max(1, Math.min(5, value));
                  onCategoryRatingChange(category.key, clampedValue);
                }}
              >
                <div 
                  className={styles.sliderFill} 
                  style={{ width: `${(evaluationData.categoryRatings[category.key] || 1) * 20}%` }}
                />
                <div 
                  className={styles.sliderThumb}
                  style={{ left: `calc(${(evaluationData.categoryRatings[category.key] || 1) * 20}% - 10px)` }}
                />
              </div>
              <div className={styles.sliderLabels}>
                <span 
                  onClick={() => onCategoryRatingChange(category.key, 1)}
                  className={styles.labelButton}
                >
                  1
                </span>
                <span 
                  onClick={() => onCategoryRatingChange(category.key, 2)}
                  className={styles.labelButton}
                >
                  2
                </span>
                <span 
                  onClick={() => onCategoryRatingChange(category.key, 3)}
                  className={styles.labelButton}
                >
                  3
                </span>
                <span 
                  onClick={() => onCategoryRatingChange(category.key, 4)}
                  className={styles.labelButton}
                >
                  4
                </span>
                <span 
                  onClick={() => onCategoryRatingChange(category.key, 5)}
                  className={styles.labelButton}
                >
                  5
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 입력 완료 상태 피드백 */}
      {!isAllCategoriesRated && (
        <div className={styles.completionFeedback}>
          모든 카테고리를 평가해주세요
        </div>
      )}
      
      {/* 다음 단계 버튼 */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={onNext}
          disabled={!isAllCategoriesRated}
        >
          다음으로 넘어가기
        </button>
      </div>
    </div>
  );
};

export default EvaluationStep1; 