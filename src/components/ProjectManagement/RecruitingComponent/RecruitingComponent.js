import React, { useEffect, useState } from "react";
import "./RecruitingComponent.scss";
import SectionHeader from "../Common/SectionHeader";
import ProjectCard from "../Common/ProjectCard";
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
      <div className="recruiting-top">
        <div className="recruiting-top-info">
          <SectionHeader
            explainText={`프로젝트 팀원을 모집하고\n함께 시작해보세요!`}
            highlightText="모집 중"
            filterOptions={[
              { value: "latest", label: "최신순" },
              { value: "date", label: "날짜순" },
              { value: "meeting", label: "회의 빠른 순" },
            ]}
            onFilterChange={(e) => console.log(e.target.value)}
          />
        </div>
      </div>

      <hr />

      <div className="recruiting-list">
        {isLoading && items.length === 0 && <div>불러오는 중...</div>}
        {error && (
          <div style={{ color: '#F76241' }}>
            {error} <button onClick={() => load(page.offset || 0)}>다시 시도</button>
          </div>
        )}
        {items.map((recruitment) => (
          <ProjectCard key={recruitment.recruitment_id} project={recruitment} />
        ))}
      </div>

      {canLoadMore && !isLoading && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <button onClick={() => load((page.offset || 0) + (page.limit || 10))}>더 보기</button>
        </div>
      )}
    </div>
  );
};

export default RecruitingComponent;
