import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { submitEvaluation, fetchProjectMembers, fetchEvaluationTargets } from '../../services/evaluation';
import styles from './TeamMemberEvaluationPage.module.scss';
import avatar1 from '../../assets/icons/avatar1.png';
import avatar2 from '../../assets/icons/avatar2.png';
import avatar3 from '../../assets/icons/avatar3.png';
// import avatar4 from '../../assets/icons/avatar4.png'; // 필요 시 교체용으로 대기
import DefaultHeader from '../../components/Common/DefaultHeader';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import EvaluationStep1 from './components/EvaluationStep1';
import EvaluationStep2 from './components/EvaluationStep2';
import EvaluationStep3 from './components/EvaluationStep3';

function TeamMemberEvaluationPage() {
  const { projectId, memberId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // 1: 카테고리, 2: 전체/역할, 3: 완료
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [nextPendingMemberAfterSubmit, setNextPendingMemberAfterSubmit] = useState(null);
  const [remainingCount, setRemainingCount] = useState(0);
  const [evaluationData, setEvaluationData] = useState({
    categoryRatings: {
      participation: 0,
      communication: 0,
      responsibility: 0,
      collaboration: 0,
      individualAbility: 0
    },
    overallRating: 0,
    roleDescription: '',
    extractedKeywords: [],
    encouragementMessage: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user || !user.userId) {
          throw new Error('사용자 정보를 찾을 수 없습니다.');
        }

        // Fetch project members and evaluation targets
        const [members, evalTargets] = await Promise.all([
          fetchProjectMembers(projectId),
          fetchEvaluationTargets(projectId, user.userId)
        ]);

        // Create project data structure (dummy for now - can be enhanced with project API)
        const projectData = {
          id: projectId,
          name: '프로젝트', // TODO: Fetch from project API
          members: members.map((member, index) => ({
            id: member.user_id,
            name: member.User?.username || '알 수 없음',
            position: member.role || '팀원',
            avatar: [avatar1, avatar2, avatar3][index % 3] // Cycle through avatars
          }))
        };

        // Find the member to evaluate
        let targetMember;
        if (memberId) {
          // Specific member requested
          targetMember = projectData.members.find(m => m.id === memberId);
        } else {
          // No specific member - use next pending from evaluation targets
          if (evalTargets.nextPendingMember) {
            targetMember = projectData.members.find(m => m.id === evalTargets.nextPendingMember.id);
          }
        }

        if (!targetMember && projectData.members.length > 0) {
          // Fallback to first member who is not current user
          targetMember = projectData.members.find(m => m.id !== user.userId) || projectData.members[0];
        }

        if (!targetMember) {
          throw new Error('평가할 팀원을 찾을 수 없습니다.');
        }

        console.log('Project Data:', projectData);
        console.log('Target Member:', targetMember);
        console.log('Next Pending:', evalTargets.nextPendingMember);

        setProjectData(projectData);
        setMemberData(targetMember);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (projectId && user) {
      fetchData();
    }
  }, [projectId, memberId, user]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1); // 1 -> 2 -> 3
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCategoryRatingChange = (category, rating) => {
    setEvaluationData(prev => ({
      ...prev,
      categoryRatings: {
        ...prev.categoryRatings,
        [category]: rating
      }
    }));
  };

  const handleOverallRatingChange = (rating) => {
    setEvaluationData(prev => ({
      ...prev,
      overallRating: rating
    }));
  };

  const handleRoleDescriptionChange = (description) => {
    setEvaluationData(prev => ({
      ...prev,
      roleDescription: description
    }));
  };

  const handleEncouragementMessageChange = (message) => {
    setEvaluationData(prev => ({
      ...prev,
      encouragementMessage: message
    }));
  };

  const handleKeywordsChange = (keywords) => {
    setEvaluationData(prev => ({
      ...prev,
      extractedKeywords: keywords
    }));
  };

  const handleSubmitEvaluation = async () => {
    if (!user || !user.userId) {
      setError('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    if (!memberData || !memberData.id) {
      setError('평가 대상을 찾을 수 없습니다.');
      return;
    }

    // Validate all category ratings are set
    const hasAllRatings = Object.values(evaluationData.categoryRatings).every(rating => rating > 0);
    if (!hasAllRatings) {
      setError('모든 항목에 대해 평가를 입력해주세요.');
      return;
    }

    if (evaluationData.overallRating === 0) {
      setError('전체 평가를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      console.log('평가 데이터 제출:', {
        projectId,
        reviewerId: user.userId,
        revieweeId: memberData.id,
        evaluationData
      });

      await submitEvaluation(projectId, user.userId, memberData.id, evaluationData);

      console.log('평가 제출 성공');

      // Fetch updated evaluation targets after submission
      try {
        const updatedTargets = await fetchEvaluationTargets(projectId, user.userId);
        setNextPendingMemberAfterSubmit(updatedTargets.nextPendingMember);

        // Calculate remaining count (pending targets excluding current user)
        const pendingTargets = updatedTargets.targets?.filter(t => t.status === 'pending') || [];
        setRemainingCount(pendingTargets.length);

        console.log('다음 평가 대상:', updatedTargets.nextPendingMember);
        console.log('남은 평가 대상:', pendingTargets.length);
      } catch (targetErr) {
        console.error('평가 대상 조회 오류:', targetErr);
        // Continue even if fetching targets fails
      }

      // Move to completion step
      setCurrentStep(3);
    } catch (err) {
      console.error('평가 제출 오류:', err);
      setError(err.message || '평가 제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoNext = () => {
    if (nextPendingMemberAfterSubmit) {
      console.log('다음 팀원 평가로 이동:', nextPendingMemberAfterSubmit);
      navigate(`/evaluation/team-member/${projectId}/${nextPendingMemberAfterSubmit.id}`);
    }
  };

  const handleGoHome = () => {
    console.log('프로젝트 관리로 돌아가기');
    navigate('/project-management?tab=completed');
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>오류: {error}</div>;
  }

  if (!projectData || !memberData) {
    return <div className={styles.noData}>데이터를 찾을 수 없습니다.</div>;
  }

  const renderCurrentStep = () => {
    const commonProps = {
      projectData,
      memberData,
      evaluationData,
      onNext: handleNextStep,
      onPrev: handlePrevStep,
      onCategoryRatingChange: handleCategoryRatingChange,
      onOverallRatingChange: handleOverallRatingChange,
      onRoleDescriptionChange: handleRoleDescriptionChange,
      onEncouragementMessageChange: handleEncouragementMessageChange,
      onKeywordsChange: handleKeywordsChange,
      onSubmit: handleSubmitEvaluation
    };

    switch (currentStep) {
      case 1:
        // Step 1: 카테고리 점수 입력 → Next 시 Step 2 이동
        return (
          <EvaluationStep1
            {...commonProps}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <EvaluationStep2
            {...commonProps}
          />
        );
      case 3:
        return (
          <EvaluationStep3
            memberData={memberData}
            evaluationData={evaluationData}
            nextPendingMember={nextPendingMemberAfterSubmit}
            remainingCount={remainingCount}
            onGoNext={handleGoNext}
            onGoHome={handleGoHome}
          />
        );
      default:
        return (
          <EvaluationStep1
            {...commonProps}
            onNext={handleNextStep}
          />
        );
    }
  };

  return (
    <div className={styles.pageContainer}>
      {currentStep !== 3 && <DefaultHeader title="팀원 평가" />}
      <div className={styles.content}>
        {renderCurrentStep()}
      </div>
      <BottomNav />
    </div>
  );
}

export default TeamMemberEvaluationPage; 