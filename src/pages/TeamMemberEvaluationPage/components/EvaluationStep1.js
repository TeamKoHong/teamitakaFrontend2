import React from 'react';
import styles from '../TeamMemberEvaluationPage.module.scss';
import ProgressIndicator from './ProgressIndicator';
import CategorySlider from '../../../components/Common/CategorySlider';

const EvaluationStep1 = ({
  projectData,
  memberData,
  evaluationData,
  onCategoryRatingChange,
  onNext
}) => {
  // 데이터 유효성 검사
  if (!projectData || !memberData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

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
    },
    {
      key: 'collaboration',
      name: '협력',
      description: '해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가해주세요'
    },
    {
      key: 'individualAbility',
      name: '개인능력',
      description: '해당 팀원의 프로젝트 수행 능력을 점수로 평가해주세요'
    }
  ];

  // 모든 카테고리가 평가되었는지 확인
  const isAllCategoriesRated = categories.every(
    (category) => (evaluationData.categoryRatings[category.key] || 0) > 0
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

      {/* 진행 표시기 (2단계로 축소) */}
      <ProgressIndicator currentStep={1} totalSteps={2} />

      {/* 질문 */}
      <div className={styles.questionText}>
        해당 팀원의 능력별 점수는 몇 점인가요?
      </div>

      {/* 카테고리별 평가 섹션 */}
      <div className={styles.categorySection}>
        {categories.map((category) => (
          <CategorySlider
            key={category.key}
            category={category.key}
            name={category.name}
            description={category.description}
            value={evaluationData.categoryRatings[category.key] || 1}
            onChange={(rating) => onCategoryRatingChange(category.key, rating)}
            min={1}
            max={5}
            disabled={false}
            compact={false}
            showDescription={true}
            showThumb={true}
          />
        ))}
      </div>

      {/* 다음 단계 버튼 */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.nextButton} ${!isAllCategoriesRated ? styles.disabled : ''}`}
          onClick={onNext}
          disabled={!isAllCategoriesRated}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default EvaluationStep1; 