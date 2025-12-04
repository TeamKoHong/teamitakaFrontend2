import React, { useEffect, useState } from "react";
import "./RecruitingComponent.scss";
import SectionHeader from "../Common/SectionHeader";
import RecruitingProjectCard from "./RecruitingProjectCard";
import { useNavigate } from "react-router-dom";
import { getMyRecruitments } from "../../../services/recruitment";

const RecruitingComponent = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState({ total: 0, limit: 10, offset: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async (nextOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyRecruitments({ limit: page.limit || 10, offset: nextOffset });

      console.log('🔍 [Debug] Recruitment API 응답:', res);
      console.log('🔍 [Debug] Recruitments 배열:', res.items);
      console.log('🔍 [Debug] 모집글 개수:', res.items?.length);

      if (res?.success) {
        setItems(nextOffset === 0 ? res.items : [...items, ...res.items]);
        setPage(res.page || { total: 0, limit: 10, offset: nextOffset });
      } else {
        throw new Error('SERVER_ERROR');
      }
    } catch (e) {
      console.error('❌ [Error] Recruitment 로딩 실패:', e);
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
    load(0);
    // eslint-disable-next-line
  }, []);

  const canLoadMore = items.length < (page.total || 0);

  return (
    <div className="recruiting-container">
      {!isLoading && !error && items.length > 0 && (
        <>
          <div className="recruiting-top">
            <div className="recruiting-top-info">
              <SectionHeader
                explainText={`프로젝트 팀원을 모집하고\n함께 시작해보세요!`}
                highlightText="모집 중"
              />
            </div>
          </div>
          <div className="recruiting-list">
        {isLoading && items.length === 0 && <div className="loading-state">불러오는 중...</div>}
        {error && (
          <div className="error-state">
            <p style={{ color: '#F76241', marginBottom: '12px' }}>{error}</p>
            <button onClick={() => load(page.offset || 0)}>다시 시도</button>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="empty-state">
            <h3 className="empty-title">모집중인 프로젝트가 없어요</h3>
            <p className="empty-description">
              모집글을 작성하고 프로젝트를 시작해보세요.
            </p>
            <button className="create-project-btn" onClick={() => navigate('/recruit')}>
              프로젝트 모집하기
            </button>
          </div>
        )}

        <div className="recruiting-cards-wrapper">
          {items.map((recruitment) => (
            <RecruitingProjectCard key={recruitment.recruitment_id} recruitment={recruitment} />
          ))}
        </div>
      </div>

      {canLoadMore && !isLoading && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <button onClick={() => load((page.offset || 0) + (page.limit || 10))}>더 보기</button>
        </div>
      )}
          <hr />

        <div className="recruiting-deadline-container">
          <div className="recruiting-deadline-title">
            <p>모집 인원이 아쉽게 다 모이지 않았어요</p>
            <p>다시 한번 모집해보세요</p>
          </div>
          <div className="recruiting-deadline-card">
            <p className="recruiting-deadline-card-description">목표 모집 인원에 도달하지 못했어요.</p>
            <p className="recruiting-deadline-card-title">프로젝트명</p>
            <div className="recruiting-deadline-card-buttons">
              <button className="recruiting-deadline-card-delete-btn">삭제하기</button>
              <button className="recruiting-deadline-card-rerecruit-btn">다시 모집하기</button>
            </div>
          </div>
        </div>

        </>
      )}
    </div>
  );
};

export default RecruitingComponent;
