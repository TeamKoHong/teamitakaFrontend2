// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useLocation } from "react-router-dom";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import "react-spring-bottom-sheet/dist/style.css";
import ProjectMemberPage from "./pages/ProjectMemberPage/ProjectMemberPage";
import ProceedingsPage from "./pages/ProceedingsPage/ProceedingsPage";
// import ProjectVotePage from "./pages/ProjectVotePage/ProjectVotePage";
import ProjectCalender from "./pages/ProjectCalendar/ProjectCalendar";

import RatingManagementPage from './pages/RatingManagementPage/RatingManagementPage';
import RatingProjectPage from './pages/RatingProjectPage/RatingProjectPage';
import RatingProjectStatusPage from './pages/RatingProjectStatusPage/RatingProjectStatusPage';
import TeamMemberEvaluationPage from './pages/TeamMemberEvaluationPage/TeamMemberEvaluationPage';
import CategorySliderDemo from './components/Common/CategorySliderDemo';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
// 새로 추가된 팀 매칭 페이지 임포트
import TeamMatchingPage from './pages/TeamMatchingPage/TeamMatchingPage'; // TeamMatchingPage 경로에 맞게 수정
import RecruitmentPage from './pages/RecruitmentPage/RecruitmentPage';
import SearchPage from './pages/SearchPage/SearchPage';

// 메인 페이지 임포트
import MainPage from './components/Home/MainPage';

// 네비게이션 가드 컴포넌트
const EvaluationGuard = ({ children, projectId, memberId }) => {
  const location = useLocation();
  
  // 평가 플로우에서 뒤로가기 시 경고
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (location.pathname.includes('/evaluation/')) {
        e.preventDefault();
        e.returnValue = '평가 작성 중입니다. 페이지를 나가시겠습니까?';
        return e.returnValue;
      }
    };

    const handlePopState = (e) => {
      if (location.pathname.includes('/evaluation/')) {
        const confirmLeave = window.confirm('평가 작성 중입니다. 페이지를 나가시겠습니까?');
        if (!confirmLeave) {
          window.history.pushState(null, '', location.pathname);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]);

  return children;
};

// 프로젝트 권한 검증 컴포넌트
const ProjectPermissionGuard = ({ children, projectId }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const checkPermission = async () => {
      try {
        setIsLoading(true);
        // 실제 구현에서는 API 호출로 프로젝트 접근 권한 확인
        // const response = await api.checkProjectPermission(projectId);
        // setHasPermission(response.hasPermission);
        
        // 임시로 true 반환 (실제로는 권한 검증 로직 구현)
        setHasPermission(true);
      } catch (err) {
        setError('프로젝트 접근 권한을 확인할 수 없습니다.');
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      checkPermission();
    }
  }, [projectId]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        권한 확인 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '16px'
      }}>
        <div style={{ fontSize: '16px', color: '#666' }}>{error}</div>
        <button 
          onClick={() => window.location.href = '/project-management'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f76241',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          프로젝트 관리로 돌아가기
        </button>
      </div>
    );
  }

  if (!hasPermission) {
    return <Navigate to="/project-management" replace />;
  }

  return children;
};

// 가드 래퍼 컴포넌트들
const ProjectPermissionGuardWrapper = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage />
    </ProjectPermissionGuard>
  );
};

const TeamMemberEvaluationGuardWrapper = () => {
  const { projectId, memberId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <EvaluationGuard projectId={projectId} memberId={memberId}>
        <TeamMemberEvaluationPage />
      </EvaluationGuard>
    </ProjectPermissionGuard>
  );
};

const StatusPageGuardWrapper = () => {
  const { projectId } = useParams();
  const location = useLocation();
  
  if (location.pathname.includes('/given')) {
    return (
      <ProjectPermissionGuard projectId={projectId}>
        <RatingProjectStatusPage />
      </ProjectPermissionGuard>
    );
  } else if (location.pathname.includes('/received')) {
    return (
      <ProjectPermissionGuard projectId={projectId}>
        <RatingProjectStatusPage />
      </ProjectPermissionGuard>
    );
  } else {
    return (
      <ProjectPermissionGuard projectId={projectId}>
        <RedirectToReceived />
      </ProjectPermissionGuard>
    );
  }
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 경로를 프로젝트 관리 페이지로 설정 
        <Route path="/" element={<Navigate to="/project-management" replace />} />
        <Route path="/main" element={<Navigate to="/project-management" replace />} />
        <Route path="/my" element={<Navigate to="/project-management" replace />} />*/}

        {/*메인 홈 페이지 라우트*/}
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* 기본 경로를 프로젝트 관리 페이지로 설정 */}
        <Route path="/my" element={<Navigate to="/project-management" replace />} />

        {/* 기존 프로젝트 관리 및 상세 페이지 라우트 */}
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/project/:id/member" element={<ProjectMemberPage />} />
        <Route path="/project/:id/proceedings" element={<ProceedingsPage />} />
        {/*<Route path="/project/:id/vote" element={<ProjectVotePage />} />*/}
        <Route path="/project/:id/calender" element={<ProjectCalender />} />

        {/* 평가 관련 페이지 라우트 - URL 구조 개선 및 가드 추가 */}
        <Route path="/evaluation/management" element={<RatingManagementPage/>}/>
        <Route 
          path="/evaluation/project/:projectId" 
          element={<ProjectPermissionGuardWrapper />}
        />
        <Route 
          path="/evaluation/team-member/:projectId/:memberId" 
          element={<TeamMemberEvaluationGuardWrapper />}
        />
        <Route 
          path="/evaluation/status/:projectId/given" 
          element={<StatusPageGuardWrapper />}
        />
        <Route 
          path="/evaluation/status/:projectId/received" 
          element={<StatusPageGuardWrapper />}
        />
        <Route 
          path="/evaluation/status/:projectId" 
          element={<StatusPageGuardWrapper />}
        />
        
        {/* 기존 URL 호환성을 위한 리다이렉트 */}
        <Route path="/project/rating-management" element={<Navigate to="/evaluation/management" replace />} />
        <Route path="/project/:projectId/rating-project" element={<Navigate to="/evaluation/project/:projectId" replace />} />
        <Route path="/project/:projectId/evaluate/:memberId" element={<Navigate to="/evaluation/team-member/:projectId/:memberId" replace />} />
        <Route path="/project/:projectId/rating-status/given" element={<Navigate to="/evaluation/status/:projectId/given" replace />} />
        <Route path="/project/:projectId/rating-status/received" element={<Navigate to="/evaluation/status/:projectId/received" replace />} />
        <Route path="/project/:projectId/rating-status" element={<Navigate to="/evaluation/status/:projectId" replace />} />

        {/* 새로 추가된 팀 매칭 페이지 라우트 */}
        <Route path="/team-matching" element={<TeamMatchingPage />} />
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* 기존 /team 경로를 팀 매칭 페이지로 리다이렉트 */}
        <Route path="/team" element={<Navigate to="/team-matching" replace />} />

        {/* 데모 컴포넌트 라우트 */}
        <Route path="/demo/category-slider" element={<CategorySliderDemo />} />
      </Routes>
    </Router>
  );
};

function RedirectToReceived() {
  const { projectId } = useParams();
  return <Navigate to={`/evaluation/status/${projectId}/received`} replace />;
}

export default App;