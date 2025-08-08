// src/pages/RecruitmentPage/RecruitmentPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import './RecruitmentPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";

// --- 데이터 예시 ---
export const filterOptions = ['전체', '마케팅', '디자인', '브랜딩', 'IT', '서비스'];
export const recruitmentData = [
  {
    id: 'r1',
    category: '디자인',
    isBest: true,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    title: '김혜현 교수님] 비주얼 마케터 디자인 팀 프로젝트 인원 구합니다!',
    author: '얼리버드',
    views: 302,
    comments: 79,
    date: '25.03.24',
    tags: ['마케팅', '디자인'],
  },
  {
    id: 'r2',
    category: '디자인',
    isBest: true,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    title: '김건상 교수님] 기초 디자인 테크닉 (2) 함께 스케치 디벨로퍼 구합니다. 스터디 작업..',
    author: '시라소니',
    views: 214,
    comments: 93,
    date: '25.03.27',
    tags: ['디자인', 'IT'],
  },
  {
    id: 'r3',
    category: '서비스',
    isBest: false,
    imageUrl: '', // 빈값이면 placeholder 사용
    title: '하면서 교수님] 지도하에 공모전 함께 할 팀플러 구합니다!!',
    author: '뱁새',
    views: 182,
    comments: 19,
    date: '25.03.12',
    tags: ['기획', '서비스'],
  },
  // ... 기타 항목들
];

export default function RecruitmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilter = location.state?.filter || '전체';
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const filtered = recruitmentData.filter(item =>
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
        {filtered.map(item => (
          <li key={item.id} className="recruit-item">
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
              <p className="item-author">{item.author}</p>

              <div className="item-info">
                <span><IoEyeOutline /> {item.views}</span>
                <span><HiOutlineChatBubbleOvalLeft /> {item.comments}</span>
                <span className="item-date">{item.date}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <BottomNav />
    </div>
)}
