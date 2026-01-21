import React from 'react';
import EvaluationStep3 from '../TeamMemberEvaluationPage/components/EvaluationStep3';
import { useNavigate } from 'react-router-dom';

/**
 * 팀원 평가 완료 화면 테스트 페이지
 * 
 * 목적: 평가 플로우를 거치지 않고 완료 화면 디자인을 빠르게 확인
 * URL: /test/evaluation-completion
 */
const EvaluationCompletionTest = () => {
    const navigate = useNavigate();

    // 더미 멤버 데이터
    const mockMemberData = {
        id: 'test-member-001',
        avatar: 'https://via.placeholder.com/55/FF6B6B/FFFFFF?text=KJW',
        name: '김재원',
        role: 'Developer',
    };

    // 더미 평가 데이터
    const mockEvaluationData = {
        overallRating: 4,
        abilities: {
            participation: 5,
            communication: 4,
            responsibility: 4,
        },
        roleDescription: 'UI/UX 디자인 및 프론트엔드 개발을 담당했습니다.',
    };

    const handleGoNext = () => {
        console.log('다음 팀원 평가하러 가기 클릭');
        alert('다음 팀원 평가하러 가기 (테스트 모드)');
    };

    const handleGoHome = () => {
        console.log('프로젝트 관리 홈으로 가기 클릭');
        navigate('/project-management');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f2f2f2',
            position: 'relative'
        }}>
            <EvaluationStep3
                memberData={mockMemberData}
                evaluationData={mockEvaluationData}
                nextPendingMember={true}
                onGoNext={handleGoNext}
                onGoHome={handleGoHome}
                onClose={handleGoHome}
            />
        </div>
    );
};

export default EvaluationCompletionTest;
