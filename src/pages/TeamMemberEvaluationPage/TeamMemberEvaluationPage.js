import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TeamMemberEvaluationPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import EvaluationStep1 from './components/EvaluationStep1';
import EvaluationStep2 from './components/EvaluationStep2';
import EvaluationStep3 from './components/EvaluationStep3';
import EvaluationStep4 from './components/EvaluationStep4';
import EvaluationStep5 from './components/EvaluationStep5';

function TeamMemberEvaluationPage() {
  const { projectId, memberId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [evaluationData, setEvaluationData] = useState({
    categoryRatings: {
      participation: 4,
      communication: 2,
      responsibility: 4,
      collaboration: 3,
      individualAbility: 5
    },
    overallRating: 0,
    roleDescription: '',
    extractedKeywords: [],
    encouragementMessage: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 실제 API 호출로 대체 예정
        const dummyProject = {
          id: parseInt(projectId),
          name: '연합동아리 부스전 기획 프로젝트',
          description: '서울 디자인 전시 부스를 위한 기획 프로젝트',
          period: '2024.01.01 ~ 2024.02.01',
          members: [
            {
              id: 101,
              name: '김재원',
              position: '프론트엔드 개발자',
              avatar: '/assets/icons/avatar1.png'
            },
            {
              id: 102,
              name: '이영희',
              position: '백엔드 개발자',
              avatar: '/assets/icons/avatar2.png'
            },
            {
              id: 103,
              name: '박철수',
              position: '디자이너',
              avatar: '/assets/icons/avatar3.png'
            }
          ]
        };

        // 김재원(memberId: 101)을 기본 평가 대상으로 설정
        const dummyMember = dummyProject.members.find(m => m.id === parseInt(memberId)) || dummyProject.members[0];
        
        setProjectData(dummyProject);
        setMemberData(dummyMember);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, memberId]);

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
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

  const handleSubmitEvaluation = async () => {
    try {
      // 실제 API 호출로 대체 예정
      console.log('평가 데이터 제출:', evaluationData);
      
      // 키워드 추출 시뮬레이션 (역할 설명에서 키워드 추출)
      const roleText = evaluationData.roleDescription.toLowerCase();
      let keywords = [];
      
      if (roleText.includes('창의') || roleText.includes('아이디어') || roleText.includes('혁신')) {
        keywords.push('창의성');
      }
      if (roleText.includes('배려') || roleText.includes('팀워크') || roleText.includes('협력')) {
        keywords.push('배려심');
      }
      if (roleText.includes('책임') || roleText.includes('성실')) {
        keywords.push('책임감');
      }
      if (roleText.includes('소통') || roleText.includes('의견')) {
        keywords.push('소통능력');
      }
      if (roleText.includes('리더') || roleText.includes('주도')) {
        keywords.push('리더십');
      }
      
      // 기본 키워드 추가 (키워드가 없을 경우)
      if (keywords.length === 0) {
        keywords = ['창의성', '배려심'];
      }
      
      setEvaluationData(prev => ({
        ...prev,
        extractedKeywords: keywords
      }));
      
      handleNextStep();
    } catch (err) {
      setError('평가 제출에 실패했습니다.');
    }
  };

  const handleComplete = async () => {
    try {
      // 실제 API 호출로 대체 예정
      console.log('평가 완료:', evaluationData);
      handleNextStep();
      
      // 잠시 후 다음 팀원으로 이동하거나 평가 목록으로 이동
      setTimeout(() => {
        navigate(`/project/${projectId}/rating-status`);
      }, 2000);
    } catch (err) {
      setError('평가 완료 처리에 실패했습니다.');
    }
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
      onSubmit: handleSubmitEvaluation,
      onComplete: handleComplete
    };

    switch (currentStep) {
      case 1:
        return <EvaluationStep1 {...commonProps} />;
      case 2:
        return <EvaluationStep2 {...commonProps} />;
      case 3:
        return <EvaluationStep3 {...commonProps} />;
      case 4:
        return <EvaluationStep4 {...commonProps} />;
      case 5:
        return <EvaluationStep5 {...commonProps} />;
      default:
        return <EvaluationStep1 {...commonProps} />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <DefaultHeader title="팀원 평가" />
      <div className={styles.content}>
        {renderCurrentStep()}
      </div>
      <BottomNav />
    </div>
  );
}

export default TeamMemberEvaluationPage; 