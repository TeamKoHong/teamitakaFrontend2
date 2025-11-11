import React, { useEffect } from "react";
import "./CompletedComponent.scss";
import EvaluationAlert from "./EvaluationAlert";
import CompletedProjectCard from "./CompletedProjectCard";
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../Common/AlertModal';
import DebugBadge from '../../Common/DebugBadge/DebugBadge';
import { fetchEvaluationTargets, getNextPendingMemberId } from '../../../services/rating';
import { getMyProjects } from '../../../services/projects';
import { compareProjectLists, logComparisonReport } from '../../../utils/compareProjects';
import { processCompletedProjects, getFilterRuleDescription } from '../../../utils/projectFilters';

const CompletedComponent = () => {
  const navigate = useNavigate();

  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState({ total: 0, limit: 10, offset: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [sortBy, setSortBy] = React.useState('latest');

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalProject] = React.useState(null);

  // Debug state for tracking server/UI consistency
  const [debugReport, setDebugReport] = React.useState(null);

  const handleCompletedItemClick = (project) => {
    // 평가 완료 프로젝트는 평가 결과 조회 페이지로 이동
    navigate(`/evaluation/project/${project.project_id}`, {
      state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
    });
  };

  const handleEvaluateClick = async (project) => {
    // 평가 대기 프로젝트는 팀원 평가 페이지로 이동
    try {
      const { targets } = await fetchEvaluationTargets(project.project_id);
      const nextId = getNextPendingMemberId(targets);
      if (nextId) {
        navigate(`/evaluation/team-member/${project.project_id}/${nextId}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else {
        // 평가할 팀원이 없으면 프로젝트 평가 페이지로
        navigate(`/evaluation/project/${project.project_id}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      }
    } catch (error) {
      console.error('평가 대상 조회 실패:', error);
      // 에러 발생 시에도 프로젝트 평가 페이지로 이동
      navigate(`/evaluation/project/${project.project_id}`, {
        state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
      });
    }
  };

  /**
   * Verify data consistency between server and UI
   */
  const verifyDataConsistency = (serverProjects, uiProjects, label = 'Initial Load') => {
    const report = compareProjectLists(serverProjects, uiProjects, {
      filterRule: getFilterRuleDescription('completed')
    });

    // Log to console
    logComparisonReport(report, label);

    // Update debug state
    setDebugReport(report);

    return report;
  };

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyProjects({ status: 'completed', limit: page.limit || 10, offset: nextOffset });
      if (res?.success) {
        const serverProjects = res.items || [];

        // Apply standardized filtering and sorting
        const processed = processCompletedProjects(serverProjects, {
          sortOrder: sortBy === 'latest' ? 'desc' : 'asc'
        });

        // Update state with processed data
        const newItems = nextOffset === 0 ? processed.all : [...items, ...processed.all];
        setItems(newItems);
        setPage(res.page || { total: 0, limit: 10, offset: nextOffset });

        // Verify consistency after load
        verifyDataConsistency(serverProjects, newItems, `Load (offset: ${nextOffset})`);
      } else {
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

  useEffect(() => { load(0); /* 초기 로드 */ // eslint-disable-next-line
  }, [sortBy]); // Re-load when sort changes

  const canLoadMore = items.length < (page.total || 0);

  // Use standardized filter functions instead of inline filters
  const processed = processCompletedProjects(items, {
    sortOrder: sortBy === 'latest' ? 'desc' : 'asc'
  });

  const pendingProjects = processed.pending;
  const completedProjects = processed.completed;

  // Handle debug badge click
  const handleDebugClick = () => {
    if (debugReport) {
      console.group('📊 Detailed Debug Report');
      console.log('Full Report:', debugReport);
      console.table({
        'Server Count': debugReport.serverCount,
        'UI Count': debugReport.uiCount,
        'Consistent': debugReport.isConsistent ? 'Yes' : 'No',
        'Duplicates': debugReport.mismatches.duplicateIds.length,
        'Missing': debugReport.mismatches.missingFromUI.length,
        'Extra': debugReport.mismatches.extraInUI.length,
        'Mismatches': debugReport.mismatches.fieldMismatches.length
      });
      console.groupEnd();
    }
  };

  return (
    <div className="completed-container">
      {/* EvaluationAlert - 평가 대기 프로젝트가 있을 때만 표시 */}
      <EvaluationAlert
        pendingCount={pendingProjects.length}
        sortBy={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
      />

      {/* 로딩 및 에러 상태 */}
      {isLoading && items.length === 0 && <div style={{ padding: '20px', textAlign: 'center' }}>불러오는 중...</div>}
      {error && <div style={{ color: '#F76241', padding: '20px', textAlign: 'center' }}>{error} <button onClick={() => load(page.offset || 0)}>다시 시도</button></div>}

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
      {completedProjects.length > 0 && (
        <div className="completed-projects-section">
          <h4 className="section-header-title">완료 프로젝트</h4>

          <div className="project-list-new">
            {completedProjects.map((project) => (
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
          <button onClick={() => load((page.offset || 0) + (page.limit || 10))}>더 보기</button>
        </div>
      )}

      {/* Debug Badge - Development only */}
      {debugReport && (
        <DebugBadge
          serverCount={debugReport.serverCount}
          uiCount={debugReport.uiCount}
          isConsistent={debugReport.isConsistent}
          onClick={handleDebugClick}
        />
      )}

      <AlertModal
        isOpen={isModalOpen}
        title="상호평가 완료 후 열람 가능해요"
        description="지금 상호 평가를 작성하시겠어요?"
        primaryLabel="작성하기"
        secondaryLabel="나중에 하기"
        onPrimary={async () => {
          if (!modalProject) return;
          try {
            const { targets } = await fetchEvaluationTargets(modalProject.id);
            const nextId = getNextPendingMemberId(targets);
            if (nextId) {
              navigate(`/evaluation/team-member/${modalProject.id}/${nextId}`, {
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
