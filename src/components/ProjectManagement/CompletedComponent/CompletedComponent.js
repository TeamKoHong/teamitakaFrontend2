import React, { useEffect, useRef } from "react";
import "./CompletedComponent.scss";
import EvaluationAlert from "./EvaluationAlert";
import CompletedProjectCard from "./CompletedProjectCard";
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../Common/AlertModal';
import DebugBadge from '../../Common/DebugBadge/DebugBadge';
import { fetchEvaluationTargets, getNextPendingMemberId } from '../../../services/rating';
import { getMyProjects } from '../../../services/projects';
import { compareProjectLists, logComparisonReport } from '../../../utils/compareProjects';
import { deriveCompletedProjects, splitByEvaluationStatus } from '../../../utils/projectFilters';

const CompletedComponent = () => {
  const navigate = useNavigate();

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

  // Use ref to track if we've logged initial load
  const hasLoggedRef = useRef(false);

  // SINGLE PIPELINE: Derive UI list from server data
  const completedProjects = deriveCompletedProjects(serverProjects, { sortOrder: sortBy });

  // Split for display sections
  const { pending: pendingProjects, completed: completedProjectsDisplay } = splitByEvaluationStatus(completedProjects);

  // Debug: Log filtered results
  React.useEffect(() => {
    if (serverProjects.length > 0) {
      console.group('🎯 Filtering Debug');
      console.log('Server projects:', serverProjects.length);
      console.log('After deriveCompletedProjects:', completedProjects.length);
      console.log('Pending (평가 대기):', pendingProjects.length);
      console.log('Completed (완료):', completedProjectsDisplay.length);
      if (pendingProjects.length > 0) {
        console.log('First pending project:', {
          id: pendingProjects[0].project_id,
          title: pendingProjects[0].title,
          evaluation_status: pendingProjects[0].evaluation_status
        });
      }
      console.groupEnd();
    }
  }, [serverProjects, completedProjects, pendingProjects, completedProjectsDisplay]);

  // Verify consistency whenever server data or UI list changes
  useEffect(() => {
    if (!serverProjects || serverProjects.length === 0) return;

    const report = compareProjectLists(serverProjects, completedProjects, {
      key: "project_id",
      fields: ["title", "status", "start_date", "end_date", "description"]
    });

    // Log report
    const label = hasLoggedRef.current ? "Data Update" : "Initial Load";
    logComparisonReport(report, label);
    hasLoggedRef.current = true;

    // Update debug badge
    setComparisonReport(report);
  }, [serverProjects, completedProjects]);

  const handleCompletedItemClick = (project) => {
    // 평가 완료 프로젝트는 평가 결과 조회 페이지로 이동
    navigate(`/evaluation/project/${project.project_id}`, {
      state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
    });
  };

  const handleEvaluateClick = async (project) => {
    console.log('🎯 handleEvaluateClick called:', {
      project_id: project.project_id,
      title: project.title,
      evaluation_status: project.evaluation_status
    });

    // 평가 대기 프로젝트는 팀원 평가 페이지로 이동
    try {
      const { targets } = await fetchEvaluationTargets(project.project_id);
      console.log('📋 Evaluation targets:', targets);

      const nextId = getNextPendingMemberId(targets);
      console.log('➡️ Next pending member ID:', nextId);

      if (nextId) {
        console.log('🔀 Navigating to team-member evaluation:', `/evaluation/team-member/${project.project_id}/${nextId}`);
        navigate(`/evaluation/team-member/${project.project_id}/${nextId}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      } else {
        // 평가할 팀원이 없으면 프로젝트 평가 페이지로
        console.log('🔀 Navigating to project evaluation:', `/evaluation/project/${project.project_id}`);
        navigate(`/evaluation/project/${project.project_id}`, {
          state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
        });
      }
    } catch (error) {
      console.error('❌ 평가 대상 조회 실패:', error);
      // 에러 발생 시에도 프로젝트 평가 페이지로 이동
      console.log('🔀 Navigating to project evaluation (error fallback):', `/evaluation/project/${project.project_id}`);
      navigate(`/evaluation/project/${project.project_id}`, {
        state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
      });
    }
  };

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await getMyProjects({
        status: 'completed',
        limit: page.limit || 10,
        offset: nextOffset
      });

      if (res?.success) {
        const newItems = res.items || [];

        // Debug: Log server response
        console.group('🔍 Server Response Debug');
        console.log('Raw items:', newItems);
        console.log('Item count:', newItems.length);
        if (newItems.length > 0) {
          console.log('First item sample:', {
            project_id: newItems[0].project_id,
            title: newItems[0].title,
            status: newItems[0].status,
            evaluation_status: newItems[0].evaluation_status
          });
        }
        console.groupEnd();

        // Update server projects (single source of truth)
        if (nextOffset === 0) {
          setServerProjects(newItems);
        } else {
          setServerProjects(prev => [...prev, ...newItems]);
        }

        setPage(res.page || { total: 0, limit: 10, offset: nextOffset });
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
