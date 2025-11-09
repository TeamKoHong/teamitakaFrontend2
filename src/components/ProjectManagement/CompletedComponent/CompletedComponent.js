import React, { useEffect, useState } from "react";
import "./CompletedComponent.scss";
import SectionHeader from "../Common/SectionHeader";
import { FaStar } from "react-icons/fa"; // 즐겨찾기 아이콘
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../Common/AlertModal';
import { fetchEvaluationTargets, getNextPendingMemberId } from '../../../services/rating';
import { getMyProjects } from '../../../services/projects';

const CompletedComponent = () => {
  const navigate = useNavigate();

  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState({ total: 0, limit: 10, offset: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalProject, setModalProject] = React.useState(null);

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

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyProjects({ status: 'completed', limit: page.limit || 10, offset: nextOffset });
      if (res?.success) {
        setItems(nextOffset === 0 ? res.items : [...items, ...res.items]);
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

  useEffect(() => { load(0); /* 초기 로드 */ // eslint-disable-next-line
  }, []);

  const canLoadMore = items.length < (page.total || 0);

  // evaluation_status별로 프로젝트 분리
  const pendingProjects = items.filter(p => p.evaluation_status === 'PENDING');
  const completedProjects = items.filter(p => p.evaluation_status === 'COMPLETED' || p.evaluation_status === 'NOT_REQUIRED');

  return (
    <div className="completed-container">
      <div className="completed-top">
        <SectionHeader
          explainText={`완료된 프로젝트 내역을 확인해보세요`}
          highlightText="완료"
          filterOptions={[
            { value: "latest", label: "최신순" },
            { value: "date", label: "완료 날짜순" },
            { value: "rating", label: "평점순" },
          ]}
          onFilterChange={(e) => console.log(e.target.value)}
        />
      </div>

      <hr />

      {isLoading && items.length === 0 && <div style={{ padding: '20px', textAlign: 'center' }}>불러오는 중...</div>}
      {error && <div style={{ color: '#F76241', padding: '20px', textAlign: 'center' }}>{error} <button onClick={() => load(page.offset || 0)}>다시 시도</button></div>}

      {/* 평가 대기 프로젝트 섹션 */}
      {pendingProjects.length > 0 && (
        <div className="completed-section">
          <div className="completed-header">
            <h4 className="completed-section-title">⏳ 상호평가 대기 ({pendingProjects.length}개)</h4>
            <p style={{ fontSize: '14px', color: '#807C7C', marginTop: '4px' }}>
              팀원 평가를 완료하면 프로젝트 결과를 확인할 수 있어요
            </p>
          </div>

          <div className="completed-list">
            {pendingProjects.map((proj) => (
              <div
                key={proj.project_id}
                className="completed-item pending-evaluation"
                style={{ border: '2px solid #FFA500', backgroundColor: '#FFF8DC' }}
              >
                <div className="completed-item-left">
                  <h3>{proj.title}</h3>
                  <p className="description">
                    평가 현황: {proj.completed_reviews || 0}/{proj.required_reviews || 0} 완료
                  </p>
                  <p className="description" style={{ fontSize: '12px', marginTop: '4px' }}>
                    마지막 업데이트: {proj.updated_at}
                  </p>
                </div>
                <button
                  className="evaluate-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEvaluateClick(proj);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#F76241',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  평가하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 평가 완료 프로젝트 섹션 */}
      {completedProjects.length > 0 && (
        <div className="completed-section" style={{ marginTop: pendingProjects.length > 0 ? '32px' : '0' }}>
          <div className="completed-header">
            <h4 className="completed-section-title">✅ 상호평가 완료 ({completedProjects.length}개)</h4>
          </div>

          <div className="completed-list">
            {completedProjects.map((proj) => (
              <div
                key={proj.project_id}
                role="button"
                tabIndex={0}
                className="completed-item"
                onClick={() => handleCompletedItemClick(proj)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCompletedItemClick(proj);
                  }
                }}
              >
                <div className="completed-item-left">
                  <h3>{proj.title}</h3>
                  <p className="description">마지막 업데이트: {proj.updated_at}</p>
                  {proj.evaluation_status === 'NOT_REQUIRED' && (
                    <p className="description" style={{ fontSize: '12px', color: '#807C7C' }}>
                      (1인 프로젝트 - 평가 불필요)
                    </p>
                  )}
                </div>
                <FaStar className="favorite-icon" />
              </div>
            ))}
          </div>
        </div>
      )}

      {canLoadMore && !isLoading && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <button onClick={() => load((page.offset || 0) + (page.limit || 10))}>더 보기</button>
        </div>
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
