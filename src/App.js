import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useLocation } from "react-router-dom";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import "./App.css";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import "react-spring-bottom-sheet/dist/style.css";
import ProjectMemberPage from "./pages/ProjectMemberPage/ProjectMemberPage";
import ProceedingsPage from "./pages/ProceedingsPage/ProceedingsPage";
import CreateMeetingPage from "./pages/CreateMeetingPage/CreateMeetingPage";
import ProjectCalender from "./pages/ProjectCalendar/ProjectCalendar";

import RatingManagementPage from './pages/RatingManagementPage/RatingManagementPage';
import RatingProjectPage from './pages/RatingProjectPage/RatingProjectPage';
import RatingProjectStatusPage from './pages/RatingProjectStatusPage/RatingProjectStatusPage';
import TeamMemberEvaluationPage from './pages/TeamMemberEvaluationPage/TeamMemberEvaluationPage';
import ReceivedFeedbackDetailPage from './pages/ReceivedFeedbackDetailPage/ReceivedFeedbackDetailPage';
// CategorySliderDemo 임포트 제거 (Line 17 에러 해결)
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import FindIdPage from './pages/FindIdPage/FindIdPage';
import FindPasswordPage from './pages/FindPasswordPage/FindPasswordPage';
import TeamMatchingPage from './pages/TeamMatchingPage/TeamMatchingPage';
import RecruitmentPage from './pages/RecruitmentPage/RecruitmentPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ProfileMainPage from './pages/Profile/ProfileMainPage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import BookmarkPage from './pages/BookmarkPage/BookmarkPage';
import RecruitmentViewPage from './pages/RecruitmentViewPage/RecruitmentViewPage';
import TeamSelectPage from './pages/TeamSelectPage/TeamSelectPage';

// Type Test Pages
import QuizPage from './features/type-test/pages/QuizPage';
import AnalysisCompletePage from './features/type-test/pages/AnalysisCompletePage';
import ResultPage from './features/type-test/pages/ResultPage';

// 메인 페이지
import MainPage from './components/Home/MainPage';

// 프로젝트 지원하기
import ProjectApply from "./pages/ProjectApply/ProjectApply";
import ProjectApplySelect from "./pages/ProjectApply/ProjectApplySelect";
import ProjectApplyComplete from "./pages/ProjectApply/ProjectApplyComplete";

// 알림 페이지
import NotificationSettings from './pages/NotificationsPage/NotificationSettings';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';

// 프로젝트 생성하기
import ProjectRecruit from './pages/ProjectRecruit/ProjectRecruit/ProjectRecruit';
import ProjectRecruitDetail from './pages/ProjectRecruit/ProjectRecruitDetail/ProjectRecruitDetail';
import ProjectRecruitImage from './pages/ProjectRecruit/ProjectRecruitImage/ProjectRecruitImage';
import ProjectDrafts from './pages/ProjectRecruit/ProjectDrafts/ProjectDrafts';
import ProjectRecruitPreview from './pages/ProjectRecruit/ProjectRecruitPreview/ProjectRecruitPreview';
import ProjectRecruitPublish from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublish";
import ProjectRecruitPublishDone from "./pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublishDone";

// PhoneAuthTestPage 임포트 제거 (Line 53 에러 해결)

// 휴대폰 본인인증
import PhoneVerifyPage from './pages/PhoneVerifyPage/PhoneVerifyPage';
import VerificationCodePage from './pages/VerificationCodePage/VerificationCodePage';
import ProfileSetupPage from './pages/ProfileSetupPage/ProfileSetupPage';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import RegisterCompletePage from './pages/RegisterCompletePage/RegisterCompletePage';

// 인증 관련
import { AuthProvider } from './contexts/AuthContext';
import { UniversityFilterProvider } from './contexts/UniversityFilterContext';
import GlobalToastSystem from './components/Common/GlobalToastSystem';
import AuthEventBridge from './components/Common/AuthEventBridge';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import ProfileVerificationPage from './pages/Profile/ProfileVerificationPage';

// 라우팅 상수 (미사용 변수 제거: LEGACY_EVALUATION_ROUTES, DEMO_ROUTES)
import {
  MAIN_ROUTES,
  PROJECT_ROUTES,
  EVALUATION_ROUTES,
  OTHER_ROUTES,
  PROFILE_ROUTES,
  isEvaluationRoute
} from './constants/routes';

// ===== 네비게이션 가드 =====
const EvaluationGuard = ({ children }) => {
  const location = useLocation();
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEvaluationRoute(location.pathname)) {
        e.preventDefault();
        e.returnValue = '평가 작성 중입니다. 페이지를 나가시겠습니까?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location]);
  return children;
};

const ProjectPermissionGuard = ({ children, projectId }) => {
  const [hasPermission] = React.useState(true); // 임시 권한 허용
  return hasPermission ? children : <Navigate to={PROJECT_ROUTES.MANAGEMENT} replace />;
};

const ProjectEvaluationGuard = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage mode="received" />
    </ProjectPermissionGuard>
  );
};

const ProjectEvaluationGivenGuard = () => {
  const { projectId } = useParams();
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectPage mode="given" />
    </ProjectPermissionGuard>
  );
};

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

const EvaluationStatusGuard = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const mode = location.pathname.includes('/given') ? 'given' : 'received';
  return (
    <ProjectPermissionGuard projectId={projectId}>
      <RatingProjectStatusPage mode={mode} />
    </ProjectPermissionGuard>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <UniversityFilterProvider>
          <GlobalToastSystem />
          <AuthEventBridge />

          <Routes>
            {/* 공개 페이지 */}
            <Route path={MAIN_ROUTES.HOME} element={<PublicRoute><OnboardingPage /></PublicRoute>} />
            <Route path={MAIN_ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path={MAIN_ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/find-id" element={<PublicRoute><FindIdPage /></PublicRoute>} />
            <Route path="/find-password" element={<PublicRoute><FindPasswordPage /></PublicRoute>} />
            <Route path="/register-complete" element={<RegisterCompletePage />} />

            {/* 메인/프로필 */}
            <Route path="/main" element={<MainPage />} />
            <Route path={MAIN_ROUTES.MAIN} element={<MainPage />} />
            <Route path={PROFILE_ROUTES.MAIN} element={<ProfileMainPage />} />
            <Route path={PROFILE_ROUTES.EDIT} element={<ProfileEditPage />} />
            <Route path={PROFILE_ROUTES.VERIFICATION || "/profile/verification"} element={<ProfileVerificationPage />} />

            {/* 프로젝트 관리 */}
            <Route path={PROJECT_ROUTES.MANAGEMENT} element={<ProjectManagement />} />
            <Route path={PROJECT_ROUTES.DETAIL} element={<ProjectDetailPage />} />
            <Route path={PROJECT_ROUTES.MEMBER} element={<ProjectMemberPage />} />
            <Route path={PROJECT_ROUTES.PROCEEDINGS} element={<ProceedingsPage />} />
            <Route path={PROJECT_ROUTES.CREATE_MEETING} element={<CreateMeetingPage />} />
            <Route path={PROJECT_ROUTES.CALENDAR} element={<ProjectCalender />} />

            {/* 평가 시스템 */}
            <Route path={EVALUATION_ROUTES.MANAGEMENT} element={<ProtectedRoute><RatingManagementPage /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.PROJECT} element={<ProtectedRoute><ProjectEvaluationGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.PROJECT_GIVEN} element={<ProtectedRoute><ProjectEvaluationGivenGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.FEEDBACK_DETAIL} element={<ProtectedRoute><ReceivedFeedbackDetailPage /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.TEAM_MEMBER} element={<ProtectedRoute><TeamMemberEvaluationGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS_GIVEN} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS_RECEIVED} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />
            <Route path={EVALUATION_ROUTES.STATUS} element={<ProtectedRoute><EvaluationStatusGuard /></ProtectedRoute>} />

            {/* 팀 매칭 및 기타 */}
            <Route path={OTHER_ROUTES.TEAM_MATCHING} element={<TeamMatchingPage />} />
            <Route path={OTHER_ROUTES.RECRUITMENT} element={<RecruitmentPage />} />
            <Route path={OTHER_ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={OTHER_ROUTES.BOOKMARK} element={<BookmarkPage />} />
            <Route path="/recruitment/:id" element={<RecruitmentViewPage />} />
            <Route path="/recruitment/:id/team-select" element={<TeamSelectPage />} />

            {/* 휴대폰 인증 및 온보딩 */}
            <Route path="/phone-verify" element={<PublicRoute><PhoneVerifyPage /></PublicRoute>} />
            <Route path="/phone-verify/code" element={<PublicRoute><VerificationCodePage /></PublicRoute>} />
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
            <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />

            {/* 타입 테스트 */}
            <Route path="/type-test" element={<QuizPage />} />
            <Route path="/type-test/complete" element={<AnalysisCompletePage />} />
            <Route path="/type-test/result/:type" element={<ResultPage />} />

            {/* 프로젝트 지원 */}
            <Route path="/apply2" element={<ProjectApply />} />
            <Route path="/apply2/select" element={<ProjectApplySelect />} />
            <Route path="/apply2/complete" element={<ProjectApplyComplete />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/settings" element={<NotificationSettings />} />

            {/* 프로젝트 생성 */}
            <Route path="/recruit" element={<ProtectedRoute><ProjectRecruit /></ProtectedRoute>} />
            <Route path="/recruit/detail" element={<ProtectedRoute><ProjectRecruitDetail /></ProtectedRoute>} />
            <Route path="/recruit/image" element={<ProtectedRoute><ProjectRecruitImage /></ProtectedRoute>} />
            <Route path="/recruit/drafts" element={<ProtectedRoute><ProjectDrafts /></ProtectedRoute>} />
            <Route path="/recruit/preview" element={<ProtectedRoute><ProjectRecruitPreview /></ProtectedRoute>} />
            <Route path="/recruit/publish" element={<ProtectedRoute><ProjectRecruitPublish /></ProtectedRoute>} />
            <Route path="/recruit/publish/done" element={<ProtectedRoute><ProjectRecruitPublishDone /></ProtectedRoute>} />

            {/* 기본 리다이렉트 */}
            <Route path="/" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />
            <Route path="*" element={<Navigate to={MAIN_ROUTES.HOME} replace />} />
          </Routes>
        </UniversityFilterProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;