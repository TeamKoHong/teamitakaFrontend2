import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useLocation 제거 (혹은 안 씀)
import view from "../../assets/view.png";
import apply from "../../assets/apply.png";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import './RecruitmentPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import { getAllRecruitments } from '../../api/recruit';

export default function RecruitmentPage() {
  const navigate = useNavigate();
  
  // [수정 포인트 1] location.state 로직을 제거하고, 초기값을 무조건 '전체'로 설정
  // 이렇게 하면 페이지 진입/새로고침 시 항상 '전체'가 Active 상태가 됩니다.
  const [activeFilter, setActiveFilter] = useState('전체');

  const [recruitments, setRecruitments] = useState([]);
  const [filterOptions, setFilterOptions] = useState(['전체']); 
  const [loading, setLoading] = useState(true);

  // Fetch recruitments from API
  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        setLoading(true);
        const data = await getAllRecruitments();

        // 1. 데이터 변환
        const formatted = data.map(post => {
            const viewCount = Number(post.views || post.view_count || 0);
            const appCount = Number(post.applicationCount || post.applicant_count || post.applicantCount || 0);
            
            return {
              id: post.recruitment_id,
              title: post.title,
              description: post.description || post.content || '설명 없음',
              imageUrl: post.photo_url, 
              views: viewCount,
              apply: appCount,
              date: post.created_at?.substring(0, 10).replace(/-/g, '.').substring(2),
              category: post.project_type === 'course' ? '수업' : '사이드',
              tags: (post.Hashtags || post.hashtags || []).map(h => h.name || h),
              isBest: viewCount > 100,
            };
        });

        setRecruitments(formatted);

        // 2. 모든 키워드 추출 및 필터 옵션 생성
        const allTags = new Set();
        formatted.forEach(item => {
          if (item.tags) {
            item.tags.forEach(tag => {
              if (tag) allTags.add(tag);
            });
          }
        });

        const sortedTags = Array.from(allTags).sort();
        // [수정 포인트 2] 필터 옵션이 로드되어도 activeFilter는 이미 '전체'이므로 그대로 유지됨
        setFilterOptions(['전체', ...sortedTags]);

      } catch (error) {
        console.error('Failed to fetch recruitments:', error);
        setRecruitments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitments();
  }, []);

  // 3. 필터링 로직
  const filtered = recruitments.filter(item => {
    if (activeFilter === '전체') return true;
    return item.tags && item.tags.includes(activeFilter);
  });

  return (
    <div className="recruitment-page">
      <header className="recruitment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft />
        </button>
        <h1 className="header-title">모집글</h1>
      </header>

      {/* 필터 태그 목록 */}
      <div className="filter-tags horizontal-scroll">
        {filterOptions.map(tag => (
          <div
            key={tag}
            className={`filter-tag ${activeFilter === tag ? 'active' : ''}`}
            onClick={() => setActiveFilter(tag)}
          >
            {tag}
          </div>
        ))}
      </div>

      <ul className="recruitment-list">
        {loading ? (
          <div className="loading-message">로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-message">해당하는 모집글이 없습니다.</div>
        ) : (
          filtered.map(item => (
            <li key={item.id} className="recruit-item" onClick={() => navigate(`/recruitment/${item.id}`)}>
              <div className="thumbnail-wrapper">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="thumbnail-image" />
                ) : (
                  <div className="thumbnail-placeholder">No Image</div>
                )}
                {item.isBest && <span className="best-badge">Best</span>}
              </div>
              <div className="item-content">
                <h2 className="item-title">{item.title}</h2>


<p className="item-desc">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="item-tags">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="tag-item">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="item-info">
                  <div className="twoicons">
                    <div className="view-icon"><img src={view} alt="조회수"/> {item.views}</div>
                    <div className="apply-icon"><img src={apply} alt="지원자"/> {item.applicantCount} </div>
                </div>
                  <span className="item-date">{item.date}</span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      <BottomNav />
    </div>
  );
}