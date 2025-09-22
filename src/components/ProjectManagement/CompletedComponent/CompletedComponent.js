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
    // 완료된 프로젝트는 evaluation/project/:projectId로 이동
    navigate(`/evaluation/project/${project.project_id}`, {
      state: { projectSummary: project, from: { path: '/project-management', tab: 'completed' } },
    });
  };

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyProjects({ status: 'COMPLETED', limit: page.limit || 10, offset: nextOffset });
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

      <div className="completed-section">
        <div className="completed-header">
          <h4 className="completed-section-title">완료 프로젝트</h4>
        </div>

        <div className="completed-list">
          {isLoading && items.length === 0 && <div>불러오는 중...</div>}
          {error && <div style={{ color: '#F76241' }}>{error} <button onClick={() => load(page.offset || 0)}>다시 시도</button></div>}
          {items.map((proj) => (
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
              </div>
              <FaStar className="favorite-icon" />
            </div>
          ))}
        </div>

        {canLoadMore && !isLoading && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <button onClick={() => load((page.offset || 0) + (page.limit || 10))}>더 보기</button>
          </div>
        )}
      </div>

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
