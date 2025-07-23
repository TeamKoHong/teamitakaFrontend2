import React from 'react';
import RatingInputStars from '../../../components/RatingManagement/RatingInputStars/RatingInputStars';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';

const EvaluationStep3 = ({
  projectData,
  memberData,
  evaluationData,
  onNext,
  onPrev,
  onSubmit
}) => {
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
      <ProgressIndicator currentStep={3} totalSteps={5} />

      {/* 전체 별점 섹션 (읽기 전용) */}
      <div className={styles.overallRatingSection}>
        <div className={styles.overallLabel}>
          해당 팀원의 전체 총점은 몇 점인가요?
        </div>
        <div className={styles.starsContainer}>
          <RatingInputStars
            initialRating={evaluationData.overallRating}
            readOnly={true}
          />
        </div>
      </div>

      {/* 역할 입력 섹션 (읽기 전용) */}
      <div className={styles.roleSection}>
        <div className={styles.roleLabel}>
          해당 팀원의 업무 분담 및 구체적인 역할은 무엇이었나요?
        </div>
        <div className={styles.roleDescription}>
          현재 작성되는 평가는 AI 키워드 추출 되어 해당 팀원의 평가키워드에 반영됩니다. 익명이니 자유롭게 작성해주세요.
        </div>
        <div className={styles.roleInput} style={{ backgroundColor: '#f8f8f8', border: 'none' }}>
          {evaluationData.roleDescription || '구체적인 역할은 어쩌구어쩌구 입니다.'}
        </div>
        
        {/* 키워드 태그 */}
        {evaluationData.extractedKeywords.length > 0 && (
          <div className={styles.keywordSection}>
            <div className={styles.keywordTags}>
              {evaluationData.extractedKeywords.map((keyword, index) => (
                <span key={index} className={styles.keywordTag}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 버튼 컨테이너 */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={onPrev}
        >
          이전
        </button>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={onSubmit}
        >
          평가 보내기
        </button>
      </div>
    </div>
  );
};

export default EvaluationStep3; 