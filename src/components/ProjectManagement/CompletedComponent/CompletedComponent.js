import React, { useEffect } from "react";
import "./CompletedComponent.scss";
import EvaluationAlert from "./EvaluationAlert";
import CompletedProjectCard from "./CompletedProjectCard";
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../Common/AlertModal';
import DebugBadge from '../../Common/DebugBadge/DebugBadge';
import { fetchEvaluationTargets } from '../../../services/rating';
import { useAuth } from '../../../contexts/AuthContext';
import { getMyProjects } from '../../../services/projects';
import { compareProjectLists } from '../../../utils/compareProjects';
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
  const [sortBy, setSortBy] = React.useState('latest');

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalProject] = React.useState(null);

  // Comparison report for debugging
  const [comparisonReport, setComparisonReport] = React.useState(null);

  // SINGLE PIPELINE: Derive UI list from server data
  const completedProjects = deriveCompletedProjects(serverProjects, { sortOrder: sortBy });

  console.log('🔍 [DEBUG] serverProjects:', serverProjects);
  console.log('🔍 [DEBUG] completedProjects after derive:', completedProjects);

  // Split for display sections
  const { pending: pendingProjects, completed: completedProjectsDisplay } = splitByEvaluationStatus(completedProjects);

  console.log('🔍 [DEBUG] pendingProjects:', pendingProjects);
  console.log('🔍 [DEBUG] completedProjectsDisplay:', completedProjectsDisplay);


  // Verify consistency in development mode only
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!serverProjects || serverProjects.length === 0) return;

    const derived = deriveCompletedProjects(serverProjects, { sortOrder: sortBy });
    const report = compareProjectLists(serverProjects, derived, {
      key: "project_id",
      fields: ["title", "status", "start_date", "end_date", "description"]
    });

    setComparisonReport(report);
  }, [serverProjects, sortBy]);

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
        return;
      }

      const evalData = await fetchEvaluationTargets(project.project_id, user.userId);

      if (evalData.nextPendingMember) {
        navigate(getTeamMemberEvaluationUrl(project.project_id, evalData.nextPendingMember.id), {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else if (evalData.allCompleted) {
        // 모든 평가 완료 - 프로젝트 평가 결과 페이지로
        navigate(`/evaluation/project/${project.project_id}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else {
        // 평가할 팀원이 없으면 프로젝트 평가 페이지로
        const url = `/evaluation/project/${project.project_id}`;
        console.log('🔀 Navigating to:', url);
        navigate(url, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      }
    } catch (error) {
      console.error('❌ 평가 대상 조회 실패:', error);
      // 에러 발생 시에도 프로젝트 평가 페이지로 이동
      const url = `/evaluation/project/${project.project_id}`;
      console.log('🔀 Navigating to (fallback):', url);
      navigate(url, {
        state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
      });
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
  }, [sortBy]); // Re-load when sort changes

  const canLoadMore = serverProjects.length < (page.total || 0);

  return (
    <div className="completed-container">
      {/* EvaluationAlert - 평가 대기 프로젝트가 있을 때만 표시 */}
      <EvaluationAlert
        pendingCount={pendingProjects.length}
        sortBy={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
      />

      {/* 로딩 및 에러 상태 */}
      {isLoading && serverProjects.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center' }}>불러오는 중...</div>
      )}
      {error && (
        <div style={{ color: '#F76241', padding: '20px', textAlign: 'center' }}>
          {error} <button onClick={() => load(page.offset || 0)}>다시 시도</button>
        </div>
      )}

      {/* 평가 대기 프로젝트 섹션 */}
      {pendingProjects.length > 0 && (
        <div className="pending-projects-section">
          <h4 className="section-header-title">평가 대기 프로젝트</h4>

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

      {/* Debug Badge - Development only */}
      <DebugBadge report={comparisonReport} />

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
