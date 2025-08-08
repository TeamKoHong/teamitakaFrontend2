import React, { useState } from 'react';
import './TeamMatchingPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import Header from "../../components/TeamMatching/Header/Header";
import { CiBookmark } from "react-icons/ci"; 
import { IoEyeOutline } from "react-icons/io5";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { recruitmentData as keywordMatchingData, filterOptions as recruitmentFilters } from '../RecruitmentPage/RecruitmentPage';

// --- 데이터 ---
const recommendedProjectsData = [ // '오늘의 프로젝트 추천'을 위한 데이터
    {
        id: 'rec1',
        title: '홍익대 DCS(2) 구해여 👍',
        description: '브랜딩 파트 오십니더! UCTP 우대합니다.',
        views: 172,
        comments: 80,
        current: 3,
        total: 4,
    },
    {
        id: 'rec2',
        title: 'AI 기반 작곡 프로젝트 팀원 모집',
        description: '딥러닝으로 음악을 만들어볼 프론트엔드, 백엔드 개발자를 찾습니다.',
        views: 250,
        comments: 95,
        current: 2,
        total: 4,
    },
];

const initialHotTopics = [
    {
        id: 'hot1',
        category: '마케팅',
        title: '김혜현 교수님] 비주얼 마케터 디자인',
        description: '마케팅 분야 지식 있으신 분 구하고 있습니다. 함께 열심히 하실 분 연락...',
        views: 302,
        comments: 79,
        isBookmarked: false,
    },
    {
        id: 'hot2',
        category: '브랜드',
        title: '정하람 교수님] 브랜드 디자인 철학',
        description: '소주를 컨셉으로 브랜딩 할 예정입니다. 같이 브랜딩 디자인에 대한...',
        views: 108,
        comments: 3,
        isBookmarked: true,
    },
];

// --- 컴포넌트 ---

// '오늘의 프로젝트 추천' 카드 컴포넌트
const RecommendCard = ({ item }) => (
    <div className="recommend-card">
        <h3 className="recommend-card-title">{item.title}</h3>
        <p className="recommend-card-desc">{item.description}</p>
        <div className="recommend-card-info">
            <div className="info-group">
            <span><IoEyeOutline /> {item.views}</span>
            <span><HiOutlineChatBubbleOvalLeft /> {item.comments}</span>            
            </div>
            <span>{item.current} / {item.total}</span>
        </div>
    </div>
);

const HotTopicCard = ({ item, onBookmarkToggle }) => (
    <div className="hot-topic-card">
        <div className="hot-topic-card-header">
            <span className={`tag ${item.category.toLowerCase()}`}>{item.category}</span>
            <CiBookmark 
                className={`bookmark-icon ${item.isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => onBookmarkToggle(item.id)}
            />
        </div>
        <div className="hot-topic-card-title">{item.title}</div>
        <div className="hot-topic-card-desc">{item.description}</div>
        <div className="hot-topic-card-info">
            <span><IoEyeOutline /> {item.views}</span>
            <span><HiOutlineChatBubbleOvalLeft /> {item.comments}</span>
        </div>
    </div>
);

const MatchingCard = ({ item }) => (
    <div className="matching-card">
        <div className="matching-card-thumbnail">
            <img src={item.imageUrl} alt={item.title} />
            {item.isBest && <span className="best-badge">Best</span>}
        </div>
        <div className="matching-card-content">
            <div className="matching-card-title">{item.title}</div>
            <div className="matching-card-author">{item.author}</div>
            <div className="matching-card-info">
                <span><IoEyeOutline /> {item.views}</span>
            <span><HiOutlineChatBubbleOvalLeft /> {item.comments}</span>
                <span>{item.date}</span>
            </div>
        </div>
    </div>
);

export default function TeamMatchingPage() {
  const [activeFilter, setActiveFilter] = useState(recruitmentFilters[1]);
  const [hotTopics, setHotTopics] = useState(initialHotTopics);

  const handleBookmarkToggle = (id) => {
    setHotTopics(prev =>
      prev.map(topic => topic.id === id ? { ...topic, isBookmarked: !topic.isBookmarked } : topic)
    );
  };
  const availableFilters = recruitmentFilters.filter(tag => tag !== '전체');

  // RecruitmentPage에서 가져온 데이터를 필터링
  const filteredMatching = keywordMatchingData.filter(item =>
    item.tags.includes(activeFilter)
  );


    return (
        <div className="team-matching-app">
            <Header/>

            <main className="app-content">
                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">오늘의 프로젝트 추천</h2>
                    </div>
                    {/* 수정된 부분: 가로 스크롤 배너로 변경 */}
                    <div className="horizontal-scroll-list">
                       {recommendedProjectsData.map(item => <RecommendCard key={item.id} item={item} />)}
                    </div>
                </section>

                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">홍익 HOT 교내 공고</h2>
                    </div>
                    <div className="horizontal-scroll-list">
                        {hotTopics.map(item => (
                            <HotTopicCard 
                                key={item.id} 
                                item={item} 
                                onBookmarkToggle={handleBookmarkToggle} 
                            />
                        ))}
                    </div>
                </section>

                 <section className="section">
          <div className="section-header">
            <h2 className="section-title">키워드 별 모집</h2>
            <Link
              to="/recruitment"
              state={{ filter: activeFilter }}
              className="section-more"
            >
              자세히보기 &gt;
            </Link>
          </div>
          <div className="horizontal-scroll-list filter-tags">
            {availableFilters.map(filter => (
              <div
                key={filter}
                className={`filter-tag ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </div>
            ))}
          </div>
          <div className="matching-list">
            {filteredMatching.map(item => (
              <MatchingCard key={item.id} item={item} />
            ))}
          </div>
        </section>

      </main>
      <BottomNav />
      <div className="fab-container">
        {/* fab menu unchanged */}
      </div>
    </div>
  );
}
