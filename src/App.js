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
import TeamMatchingPage from './pages/TeamMatchingPage/TeamMatchingPage';
import RecruitmentPage from './pages/RecruitmentPage/RecruitmentPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ProfilePage from './pages/Profile/ProfilePage';
import RecruitmentViewPage from './pages/RecruitmentViewPage/RecruitmentViewPage';

// 메인 페이지 임포트
import MainPage from './components/Home/MainPage';

// 프로젝트 지원하기 임포트
import ProjectApply from "./pages/ProjectApply/ProjectApply";
import ProjectApplySelect from "./pages/ProjectApply/ProjectApplySelect";
import ProjectApplyComplete from "./pages/ProjectApply/ProjectApplyComplete";

//알림 페이지 임포트
import NotificationSettings from './pages/NotificationsPage/NotificationSettings';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';

//프로젝트 생성하기 임포트
import ProjectRecruit from './pages/ProjectRecruit/ProjectRecruit/ProjectRecruit';
import ProjectRecruitDetail from './pages/ProjectRecruit/ProjectRecruitDetail/ProjectRecruitDetail'; 
import ProjectRecruitImage from './pages/ProjectRecruit/ProjectRecruitImage/ProjectRecruitImage'; 
import ProjectDrafts from './pages/ProjectRecruit/ProjectDrafts/ProjectDrafts';
import ProjectRecruitPreview from './pages/ProjectRecruit/ProjectRecruitPreview/ProjectRecruitPreview';
import ProjectRecruitPublish from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublish";
import ProjectRecruitPublishDone from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublishDone";


// 인증 관련 임포트
import { AuthProvider } from './contexts/AuthContext';
import ToastHost from './components/Common/ToastHost';
import AuthEventBridge from './components/Common/AuthEventBridge';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';

// 라우팅 상수 임포트
import { 
  MAIN_ROUTES, 
  PROJECT_ROUTES, 
  EVALUATION_ROUTES, 
  LEGACY_EVALUATION_ROUTES, 
  OTHER_ROUTES, 
  DEMO_ROUTES,
  isEvaluationRoute 
} from './constants/routes';

// ===== 네비게이션 가드 컴포넌트 =====

// 평가 플로우 가드
const EvaluationGuard = ({ children, projectId, memberId }) => {
  const location = useLocation();
  
  React.useEffect(() => {
    // 평가 플로우에서 뒤로가기 시 경고
    const handleBeforeUnload = (e) => {
      if (isEvaluationRoute(location.pathname)) {
        e.preventDefault();
        e.returnValue = '평가 작성 중입니다. 페이지를 나가시겠습니까?';
        return e.returnValue;
      }
    };

    // 브라우저 뒤로가기 버튼 처리
    const handlePopState = (e) => {
      if (isEvaluationRoute(location.pathname)) {
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

// 프로젝트 권한 검증 가드
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
          onClick={() => window.location.href = PROJECT_ROUTES.MANAGEMENT}
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
    return <Navigate to={PROJECT_ROUTES.MANAGEMENT} replace />;
  }

  return children;
};

// ===== 가드 래퍼 컴포넌트들 =====

// 프로젝트 평가 페이지 가드
const ProjectEvaluationGuard = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage />
    </ProjectPermissionGuard>
  );
};

// 팀원 평가 페이지 가드
const TeamMemberEvaluationGuard = () => {
  const { projectId, memberId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <EvaluationGuard projectId={projectId} memberId={memberId}>
        <TeamMemberEvaluationPage />
      </EvaluationGuard>
    </ProjectPermissionGuard>
  );
};

// 평가 상태 페이지 가드
const EvaluationStatusGuard = () => {
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

// ===== 리다이렉트 함수 =====

function RedirectToReceived() {
  const { projectId } = useParams();
  return <Navigate to={`${EVALUATION_ROUTES.STATUS_RECEIVED.replace(':projectId', projectId)}`} replace />;
}

// ===== 메인 앱 컴포넌트 =====

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastHost />
        <AuthEventBridge />
        <Routes>
          {/* ===== 공개 페이지 (로그인하지 않은 사용자만) ===== */}
          <Route path={MAIN_ROUTES.HOME} element={<PublicRoute><OnboardingPage /></PublicRoute>} />
          <Route path={MAIN_ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={MAIN_ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* 테스트 중에 메인 페이지지 보호 해제*/}
          <Route path={MAIN_ROUTES.MAIN} element={<MainPage />} />
          <Route path={MAIN_ROUTES.MY} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* ===== 메인/프로필 (인증 필요) =====
          <Route path={MAIN_ROUTES.MAIN} element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
          <Route path={MAIN_ROUTES.MY} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> */}

          {/* ===== 프로젝트 관리 라우트 (로그인 제한 없음) ===== */}
          <Route path={PROJECT_ROUTES.MANAGEMENT} element={<ProjectManagement />} />
          <Route path={PROJECT_ROUTES.DETAIL} element={<ProjectDetailPage />} />
          <Route path={PROJECT_ROUTES.MEMBER} element={<ProjectMemberPage />} />
          <Route path={PROJECT_ROUTES.PROCEEDINGS} element={<ProceedingsPage />} />
          <Route path={PROJECT_ROUTES.CALENDAR} element={<ProjectCalender />} />

          {/* ===== 평가 시스템 라우트 (로그인 제한 없음) ===== */}
          <Route path={EVALUATION_ROUTES.MANAGEMENT} element={<RatingManagementPage />} />
          <Route path={EVALUATION_ROUTES.PROJECT} element={<ProjectEvaluationGuard />} />
          <Route path={EVALUATION_ROUTES.TEAM_MEMBER} element={<TeamMemberEvaluationGuard />} />
          <Route path={EVALUATION_ROUTES.STATUS_GIVEN} element={<EvaluationStatusGuard />} />
          <Route path={EVALUATION_ROUTES.STATUS_RECEIVED} element={<EvaluationStatusGuard />} />
          <Route path={EVALUATION_ROUTES.STATUS} element={<EvaluationStatusGuard />} />
          
          {/* ===== 기존 URL 호환성 리다이렉트 ===== */}
          <Route path={LEGACY_EVALUATION_ROUTES.RATING_MANAGEMENT} element={<Navigate to={EVALUATION_ROUTES.MANAGEMENT} replace />} />
          <Route path={LEGACY_EVALUATION_ROUTES.RATING_PROJECT} element={<Navigate to={EVALUATION_ROUTES.PROJECT} replace />} />
          <Route path={LEGACY_EVALUATION_ROUTES.EVALUATE_MEMBER} element={<Navigate to={EVALUATION_ROUTES.TEAM_MEMBER} replace />} />
          <Route path={LEGACY_EVALUATION_ROUTES.RATING_STATUS_GIVEN} element={<Navigate to={EVALUATION_ROUTES.STATUS_GIVEN} replace />} />
          <Route path={LEGACY_EVALUATION_ROUTES.RATING_STATUS_RECEIVED} element={<Navigate to={EVALUATION_ROUTES.STATUS_RECEIVED} replace />} />
          <Route path={LEGACY_EVALUATION_ROUTES.RATING_STATUS} element={<Navigate to={EVALUATION_ROUTES.STATUS} replace />} />

          {/* ===== 팀 매칭 및 기타 라우트 (로그인 제한 없음) ===== */}
          <Route path={OTHER_ROUTES.TEAM_MATCHING} element={<TeamMatchingPage />} />
          <Route path={OTHER_ROUTES.RECRUITMENT} element={<RecruitmentPage />} />
          <Route path={OTHER_ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={OTHER_ROUTES.TEAM} element={<Navigate to={OTHER_ROUTES.TEAM_MATCHING} replace />} />
          <Route path="/recruitment/:id" element={<RecruitmentViewPage />} />
          {/* ===== 데모 및 개발 도구 라우트 (개발용) ===== */}
          <Route path={DEMO_ROUTES.CATEGORY_SLIDER} element={<CategorySliderDemo />} />
          
          {/* ===== 기본 리다이렉트 ===== */}
          <Route path="/" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />
          <Route path="*" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />

          <Route path="/apply2" element={<ProjectApply />} />
          <Route path="/apply2/select" element={<ProjectApplySelect />} /> 
          <Route path="/apply2/complete" element={<ProjectApplyComplete />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/notifications/settings" element={<NotificationSettings />} />

        {/* 프로젝트 생성하기 */}
        <Route path="/recruit" element={<ProjectRecruit />} />
        <Route path="/recruit/detail" element={<ProjectRecruitDetail />} /> 
        <Route path="/recruit/image" element={<ProjectRecruitImage />} /> 
        <Route path="/recruit/drafts" element={<ProjectDrafts />} />
        <Route path="/recruit/preview" element={<ProjectRecruitPreview />} />
        <Route path="/recruit/publish" element={<ProjectRecruitPublish />} />
        <Route path="/recruit/publish/done" element={<ProjectRecruitPublishDone />} />


        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;