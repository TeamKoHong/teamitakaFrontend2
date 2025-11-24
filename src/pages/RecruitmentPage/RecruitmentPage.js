// src/pages/RecruitmentPage/RecruitmentPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import './RecruitmentPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import { getAllRecruitments } from '../../api/recruit';

// --- 데이터 예시 ---
export const filterOptions = ['전체', '마케팅', '디자인', '브랜딩', 'IT', '서비스'];
export const recruitmentData = [
  {
    id: 'r1',
    category: '디자인',
    isBest: true,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    title: '김혜현 교수님] 비주얼 마케터 디자인 팀 프로젝트 인원 구합니다!',
    views: 302,
    apply: 79,
    date: '25.03.24',
    tags: ['마케팅', '디자인'],
  },
  {
    id: 'r2',
    category: '디자인',
    isBest: true,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    title: '김건상 교수님] 기초 디자인 테크닉 (2) 함께 스케치 디벨로퍼 구합니다. 스터디 작업..',
    views: 214,
    apply: 93,
    date: '25.03.27',
    tags: ['디자인', 'IT'],
  },
  {
    id: 'r3',
    category: '서비스',
    isBest: false,
    imageUrl: '', // 빈값이면 placeholder 사용
    title: '하면서 교수님] 지도하에 공모전 함께 할 팀플러 구합니다!!',
    views: 182,
    apply: 19,
    date: '25.03.12',
    tags: ['기획', '서비스'],
  },
];

export default function RecruitmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilter = location.state?.filter || '전체';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recruitments from API
  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        setLoading(true);
        const data = await getAllRecruitments();

        // Transform API response to component format
        const formatted = data.map(post => ({
          id: post.recruitment_id,
          title: post.title,
          imageUrl: post.photo_url,
          views: post.views || 0,
          apply: post.applicant_count || 0,
          date: post.created_at?.substring(0, 10).replace(/-/g, '.').substring(2), // "2025-03-24" -> "25.03.24"
          category: post.project_type === 'course' ? '수업' : '사이드',
          tags: post.Hashtags?.map(h => h.name) || [], // ← Hashtags mapping
          isBest: (post.views || 0) > 100,
        }));

        setRecruitments(formatted);
      } catch (error) {
        console.error('Failed to fetch recruitments:', error);
        // Fallback to empty array on error
        setRecruitments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitments();
  }, []);

  const filtered = recruitments.filter(item =>
    activeFilter === '전체' ? true : item.category === activeFilter
  );

  return (
    <div className="recruitment-page">
      <header className="recruitment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft />
        </button>
        <h1 className="header-title">모집글</h1>
      </header>

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
          <div className="empty-message">모집글이 없습니다.</div>
        ) : (
          filtered.map(item => (
            <li key={item.id} className="recruit-item" onClick={() => navigate(`/recruitment/${item.id}`)}>
              <div className="thumbnail-wrapper">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="thumbnail-image" />
                ) : (
                  <div className="thumbnail-placeholder" />
                )}
                {item.isBest && <span className="best-badge">Best</span>}
              </div>
              <div className="item-content">
                <h2 className="item-title">{item.title}</h2>

                {/* Hashtags Display */}
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
)}
