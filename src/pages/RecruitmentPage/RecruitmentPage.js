import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import './RecruitmentPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import { getAllRecruitments } from '../../api/recruit';

export default function RecruitmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 메인 페이지에서 넘어온 필터 값 (없으면 '전체')
  const initialFilter = location.state?.filter || '전체';
  
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [recruitments, setRecruitments] = useState([]);
  const [filterOptions, setFilterOptions] = useState(['전체']); // 동적 필터 목록
  const [loading, setLoading] = useState(true);

  // Fetch recruitments from API
  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        setLoading(true);
        const data = await getAllRecruitments();

        // 1. 데이터 변환 (안전하게)
        const formatted = data.map(post => {
            const viewCount = Number(post.views || post.view_count || 0);
            const appCount = Number(post.applicationCount || post.applicant_count || post.applicantCount || 0);
            
            return {
              id: post.recruitment_id,
              title: post.title,
              imageUrl: post.photo_url, // DB에 이미지 URL이 있으면 사용
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

        // 가나다순 정렬
        const sortedTags = Array.from(allTags).sort();
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

  // 3. 필터링 로직 (여기는 '전체' 클릭 시 진짜 모든 글을 보여줌)
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

      {/* 동적으로 생성된 필터 태그 목록 */}
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
                {/* 이미지가 있으면 <img>, 없으면 <div> (No Image) */}
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="thumbnail-image" />
                ) : (
                  <div className="thumbnail-placeholder">No Image</div>
                )}
                {item.isBest && <span className="best-badge">Best</span>}
              </div>
              <div className="item-content">
                <h2 className="item-title">{item.title}</h2>

                {/* 해시태그 표시 */}
                {item.tags && item.tags.length > 0 && (
                  <div className="item-tags">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="tag-item">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="item-info">
                  <span><IoEyeOutline /> {item.views}</span>
                  <span><HiOutlineChatBubbleOvalLeft /> {item.apply}</span>
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