import React, { useEffect } from "react";
import "./CompletedComponent.scss";
import EvaluationAlert from "./EvaluationAlert";
import CompletedProjectCard from "./CompletedProjectCard";
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../Common/AlertModal';
// import DebugBadge from '../../Common/DebugBadge/DebugBadge';
import { fetchEvaluationTargets } from '../../../services/rating';
import { useAuth } from '../../../contexts/AuthContext';
import { getMyProjects } from '../../../services/projects';
// import { compareProjectLists } from '../../../utils/compareProjects';
import { deriveCompletedProjects, splitByEvaluationStatus } from '../../../utils/projectFilters';
import { getTeamMemberEvaluationUrl } from '../../../constants/routes';
import { transformProjectForEvaluation } from '../../../utils/projectTransform';

const CompletedComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Single source of truth: server response
  const [serverProjects, setServerProjects] = React.useState([]);

  const [page, setPage] = React.useState({ total: 0, limit: 10, offset: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalProject] = React.useState(null);

  // // Comparison report for debugging
  // const [comparisonReport, setComparisonReport] = React.useState(null);

  // SINGLE PIPELINE: Derive UI list from server data
  const completedProjects = deriveCompletedProjects(serverProjects, { sortOrder: 'latest' });

  console.log('🔍 [DEBUG] serverProjects:', serverProjects);
  console.log('🔍 [DEBUG] completedProjects after derive:', completedProjects);

  // Split for display sections
  const { pending: pendingProjects, completed: completedProjectsDisplay } = splitByEvaluationStatus(completedProjects);

  console.log('🔍 [DEBUG] pendingProjects:', pendingProjects);
  console.log('🔍 [DEBUG] completedProjectsDisplay:', completedProjectsDisplay);


  // // Verify consistency in development mode only
  // useEffect(() => {
  //   if (process.env.NODE_ENV !== 'development') return;
  //   if (!serverProjects || serverProjects.length === 0) return;

  //   const derived = deriveCompletedProjects(serverProjects, { sortOrder: 'latest' });
  //   const report = compareProjectLists(serverProjects, derived, {
  //     key: "project_id",
  //     fields: ["title", "status", "start_date", "end_date", "description"]
  //   });

  //   // setComparisonReport(report);
  // }, [serverProjects]);

  const handleCompletedItemClick = (project) => {
    // 평가 완료 프로젝트는 평가 결과 조회 페이지로 이동
    // API 데이터를 UI 형식으로 변환
    const transformedProject = transformProjectForEvaluation(project);

    navigate(`/evaluation/project/${project.project_id}`, {
      state: { projectSummary: transformedProject, from: { path: '/project-management', tab: 'completed' } },
    });
  };

  const handleEvaluateClick = async (project) => {
    // 평가 대기 프로젝트는 팀원 평가 페이지로 이동
    console.log('🔍 Click event - project object:', project);
    console.log('🔍 Click event - project.project_id:', project.project_id);

    try {
      if (!user || !user.userId) {
        console.error('사용자 정보 없음');
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const evalData = await fetchEvaluationTargets(project.project_id, user.userId);
      console.log('🔍 Evaluation targets:', evalData);

      if (evalData.nextPendingMember) {
        // 평가할 팀원이 있음 → 평가 폼으로 이동
        console.log('🔀 Navigating to evaluation form for:', evalData.nextPendingMember);
        navigate(getTeamMemberEvaluationUrl(project.project_id, evalData.nextPendingMember.id), {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else if (evalData.allCompleted) {
        // 모든 평가 완료 → 프로젝트 평가 결과 페이지로
        console.log('🔀 All evaluations completed, navigating to results');
        navigate(`/evaluation/project/${project.project_id}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else if (evalData.targets && evalData.targets.length === 0) {
        // 평가할 팀원이 없음 (1인 프로젝트) → 결과 페이지로
        console.log('🔀 No team members to evaluate (solo project)');
        navigate(`/evaluation/project/${project.project_id}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else {
        // 예상치 못한 상태 - 평가 상태 페이지로 이동
        console.warn('⚠️ Unexpected evaluation state:', evalData);
        navigate(`/evaluation/status/${project.project_id}/received`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      }
    } catch (error) {
      console.error('❌ 평가 대상 조회 실패:', error);
      // 에러 발생 시 사용자에게 알림
      alert('평가 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 [DEBUG] Fetching completed projects...', { status: 'completed', limit: page.limit || 10, offset: nextOffset });

      const res = await getMyProjects({
        status: 'completed',
        limit: page.limit || 10,
        offset: nextOffset
      });

      console.log('🔍 [DEBUG] API Response:', res);
      console.log('🔍 [DEBUG] Response items:', res?.items);
      console.log('🔍 [DEBUG] Items length:', res?.items?.length);

      if (res?.success) {
        const newItems = res.items || [];

        console.log('🔍 [DEBUG] New items to add:', newItems);

        // Update server projects (single source of truth)
        if (nextOffset === 0) {
          setServerProjects(newItems);
        } else {
          setServerProjects(prev => [...prev, ...newItems]);
        }

        setPage(res.page || { total: 0, limit: 10, offset: nextOffset });
        console.log('🔍 [DEBUG] Updated serverProjects, length:', newItems.length);
      } else {
        console.error('❌ [DEBUG] API response missing success flag:', res);
        throw new Error('SERVER_ERROR');
      }
    } catch (e) {
      if (e?.code === 'UNAUTHORIZED') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }
      setError('일시적인 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(0); // eslint-disable-next-line
  }, []);

  const canLoadMore = serverProjects.length < (page.total || 0);

  const hasNoProjects = !isLoading && !error && serverProjects.length === 0;
  const hasProjects = pendingProjects.length > 0 || completedProjectsDisplay.length > 0;

  return (
    <div className="completed-container">
      {/* EvaluationAlert - 프로젝트가 있을 때만 표시 */}
      {hasProjects && (
        <EvaluationAlert
          pendingCount={pendingProjects.length}
        />
      )}

      {/* 로딩 상태 */}
      {isLoading && serverProjects.length === 0 && (
        <div className="loading-state">불러오는 중...</div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="error-state">
          <p style={{ color: '#F76241', marginBottom: '12px' }}>{error}</p>
          <button onClick={() => load(page.offset || 0)}>다시 시도</button>
        </div>
      )}

      {/* 빈 상태 */}
      {hasNoProjects && (
        <div className="empty-state">
          <h3 className="empty-title">완료된 프로젝트가 없어요</h3>
          <p className="empty-description">
            프로젝트를 완료하면 여기에 표시됩니다.
          </p>
          <button className="create-project-btn" onClick={() => navigate('/recruit')}>
            프로젝트 모집하기
          </button>
        </div>
      )}

      {/* 평가 대기 프로젝트 섹션 */}
      {pendingProjects.length > 0 && (
        <div className="pending-projects-section">
          
          <div className="project-list-new">
            {pendingProjects.map((project) => (
              <CompletedProjectCard
                key={project.project_id}
                project={project}
                onClick={() => handleEvaluateClick(project)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 완료 프로젝트 섹션 */}
      {completedProjectsDisplay.length > 0 && (
        <div className="completed-projects-section">
          <h4 className="section-header-title">완료 프로젝트</h4>

          <div className="project-list-new">
            {completedProjectsDisplay.map((project) => (
              <CompletedProjectCard
                key={project.project_id}
                project={project}
                onClick={() => handleCompletedItemClick(project)}
              />
            ))}
          </div>
        </div>
      )}

      {canLoadMore && !isLoading && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <button onClick={() => load((page.offset || 0) + (page.limit || 10))}>
            더 보기
          </button>
        </div>
      )}

      {/* Debug Badge - Development only
      <DebugBadge report={comparisonReport} /> */}

      <AlertModal
        isOpen={isModalOpen}
        title="상호평가 완료 후 열람 가능해요"
        description="지금 상호 평가를 작성하시겠어요?"
        primaryLabel="작성하기"
        secondaryLabel="나중에 하기"
        onPrimary={async () => {
          if (!modalProject || !user || !user.userId) return;
          try {
            const evalData = await fetchEvaluationTargets(modalProject.id, user.userId);
            if (evalData.nextPendingMember) {
              navigate(getTeamMemberEvaluationUrl(modalProject.id, evalData.nextPendingMember.id), {
                state: { projectSummary: modalProject, from: { path: '/project-management', tab: 'completed' } },
              });
            } else {
              navigate(`/evaluation/project/${modalProject.id}`, {
                state: { projectSummary: modalProject, from: { path: '/project-management', tab: 'completed' } },
              });
            }
          } finally {
            setModalOpen(false);
          }
        }}
        onSecondary={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CompletedComponent;
