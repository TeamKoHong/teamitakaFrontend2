import React, { useState } from 'react';
import RatingInputStars from '../../../components/RatingManagement/RatingInputStars/RatingInputStars';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';

const EvaluationStep2 = ({
  projectData,
  memberData,
  evaluationData,
  onNext,
  onPrev,
  onOverallRatingChange,
  onRoleDescriptionChange,
  onSubmit
}) => {
  
  
  // CTA 라벨/활성 상태 결정
  const hasRating = (evaluationData.overallRating || 0) > 0;
  const hasDescription = evaluationData.roleDescription.trim().length > 0;
  const bothEmpty = !hasRating && !hasDescription;
  const isDisabled = bothEmpty || (!hasRating && hasDescription);
  const ctaLabel = bothEmpty
    ? '평가 보내기'
    : (!hasDescription && hasRating ? '나중에 할게요' : '평가 보내기');

  // 키워드 입력 기능 제거

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
                    className={`${styles.profileImage} ${index === 0 ? styles.completed : ''}`}
                  />
                  {index === 0 && (
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
      <ProgressIndicator currentStep={2} totalSteps={2} />

      {/* 전체 별점 섹션 */}
      <div className={styles.overallRatingSection}>
        <div className={styles.overallLabel}>
          해당 팀원의 전체 총점은 몇 점인가요?
        </div>
        <div className={styles.starsContainer}>
          <RatingInputStars
            initialRating={evaluationData.overallRating}
            onRatingChange={onOverallRatingChange}
            readOnly={false}
          />
        </div>
      </div>

      {/* 역할 입력 섹션 */}
      <div className={styles.roleSection}>
        <div className={styles.roleLabel}>
          해당 팀원의 업무 분담 및
          <br />
          구체적인 역할은 무엇이었나요?
        </div>
        <div className={styles.subDescription}>
          현재 작성되는 평가는 AI 키워드 추출 되어 해당 팀원의 평가키워드에 반영됩니다. 익명이니 자유롭게 작성해주세요.
        </div>
        <textarea
          className={styles.roleInput}
          placeholder="내용을 입력해주세요."
          value={evaluationData.roleDescription}
          onChange={(e) => onRoleDescriptionChange(e.target.value)}
        />
        {/* 목업 키워드 칩 표시 제거 */}
      </div>

      {/* 입력 완료 상태 피드백 제거 */}
      
      {/* 버튼 컨테이너 */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={onSubmit}
          disabled={isDisabled}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default EvaluationStep2; 