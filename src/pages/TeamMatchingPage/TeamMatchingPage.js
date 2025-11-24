import React, { useState, useEffect } from 'react';
import './TeamMatchingPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import Header from "../../components/TeamMatching/Header/Header";
import recruit_write from "../../assets/recruit_write.png";
import bookmark from "../../assets/bookmark.png";
import bookmarkActive from "../../assets/bookmark_active.png";
import view from "../../assets/view.png";
import apply from "../../assets/apply.png";
import { Link, useNavigate } from 'react-router-dom';

import { getAllRecruitments } from '../../api/recruit';

// --- 컴포넌트들 ---
const CreateProjectBanner = () => {
    const navigate = useNavigate();
    return (
        <div className="create-project-banner" onClick={() => navigate('/recruit')}>
            <img src={recruit_write} alt="생성" className="banner-icon" />
            <div className="banner-text">
                <div className="banner-title">프로젝트 생성하기</div>
                <p className="banner-description">잘 맞는 팀을 구하고 싶다면 직접 생성해보세요!</p>
            </div>
        </div>
    );
};

const HotTopicCard = ({ item, onBookmarkToggle }) => {
    const navigate = useNavigate();
    const handleCardClick = () => navigate(`/recruitment/${item.id}`);
    
    // 태그가 있으면 첫번째 태그, 없으면 카테고리 표시
    const displayTag = (item.tags && item.tags.length > 0) ? `#${item.tags[0]}` : (item.category || '프로젝트');

    return (
        <div className="hot-topic-card" onClick={handleCardClick}>
            <div className="hot-topic-card-header">
                <span className="tag marketing">{displayTag}</span>
                <img 
                    src={item.isBookmarked ? bookmarkActive : bookmark} 
                    alt="북마크" 
                    className="bookmark-icon" 
                    onClick={(e) => { e.stopPropagation(); onBookmarkToggle(item.id); }} 
                />
            </div>
            <div className="hot-topic-card-title">{item.title}</div>
            <div className="hot-topic-card-desc">{item.description}</div>
            <div className="hot-topic-card-info">
                <div className="twoicons">
                    <div className="view-icon"><img src={view} alt="조회수"/> {item.views}</div>
                    <div className="apply-icon"><img src={apply} alt="지원자"/> {item.applicantCount} </div>
                </div>
            </div>
        </div>
    );
};

const MatchingCard = ({ item }) => {
    const navigate = useNavigate();
    const handleCardClick = () => navigate(`/recruitment/${item.id}`);
    
    return (
        <div className="matching-card" onClick={handleCardClick}>
            <div className="matching-card-thumbnail">
                {/* ★ [수정] 상세 페이지와 동일한 로직 적용 */}
                {/* 진짜 이미지가 있을 때만 보여주고, 없으면 No Image 박스 표시 */}
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="card-img" />
                ) : (
                    <div className="no-image">No Image</div>
                )}
                {item.isBest && <span className="best-badge">Best</span>}
            </div>
            <div className="matching-card-content">
                <div className="matching-card-title">{item.title}</div>
                <div className="twoicons">
                    <div className="view-icon"><img src={view} alt="조회수"/> {item.views}</div>
                    <div className="apply-icon"><img src={apply} alt="지원자"/> {item.applicantCount} </div>
                </div>
                <div className="date-icon">{item.date}</div>
            </div>
        </div>
    );
};

export default function TeamMatchingPage() {
    const [activeFilter, setActiveFilter] = useState('전체');
    const [allPosts, setAllPosts] = useState([]);
    
    const [hotProjects, setHotProjects] = useState([]); 
    const [filterTabs, setFilterTabs] = useState(['전체']); 
    const [topKeywords, setTopKeywords] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllRecruitments();
                
                const formattedData = data.map(post => {
                    const viewCount = Number(post.views || post.view_count || 0);
                    const appCount = Number(post.applicationCount || post.applicant_count || post.applicantCount || 0);
                    
                    return {
                        id: post.recruitment_id,
                        title: post.title,
                        description: post.description,
                        
                        // ★ [핵심] 백엔드에서 오는 photo_url 그대로 사용
                        imageUrl: post.photo_url, 
                        
                        views: viewCount,
                        applicantCount: appCount,
                        date: post.created_at ? (post.created_at.substring(0, 10)) : '', 
                        category: post.project_type === 'course' ? '수업' : '사이드',
                        tags: (post.Hashtags || post.hashtags || []).map(h => h.name || h),
                        score: viewCount + (appCount * 10),
                        isBookmarked: false
                    };
                });

                // 1. Hot 공고 (Top 10)
                const sortedByScore = [...formattedData].sort((a, b) => b.score - a.score);
                setHotProjects(sortedByScore.slice(0, 10));

                // 2. 인기 키워드 (Top 5)
                const tagCounts = {};
                formattedData.forEach(post => {
                    if (post.tags) post.tags.forEach(tag => { if(tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
                });
                const sortedTags = Object.entries(tagCounts)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .map(([tag]) => tag)
                    .slice(0, 5);

                setTopKeywords(sortedTags);
                setFilterTabs(['전체', ...sortedTags]); 
                setAllPosts(formattedData);

            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
                setAllPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleBookmarkToggle = (id) => {
        setHotProjects(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
        setAllPosts(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
    };

    const filteredMatching = allPosts.filter(item => {
        if (!item.tags || item.tags.length === 0) return false;
        if (activeFilter === '전체') return item.tags.some(tag => topKeywords.includes(tag));
        return item.tags.includes(activeFilter);
    });

    return (
        <div className="team-matching-app">
            <Header />
            <main className="app-content">
                <section className="section section-project-banner">
                    <div className="section-header"><h2 className="section-title">팀원 구하기</h2></div>
                    <CreateProjectBanner />
                </section>
                
                <section className="section section--panel">
                    <div className="section-header"><h2 className="section-title">홍익 HOT 공고 (Top 10)</h2></div>
                    <div className="horizontal-scroll-list">
                        {isLoading ? <div style={{padding:'20px', color:'#999'}}>로딩 중...</div> : 
                         hotProjects.length > 0 ? hotProjects.map(item => (
                            <HotTopicCard key={item.id} item={item} onBookmarkToggle={handleBookmarkToggle} />
                         )) : 
                         <div style={{padding:'20px', color:'#999'}}>등록된 공고가 없습니다.</div>}
                    </div>
                </section>
                
                <section className="section">
                    <div className="section-top">
                        <div className="section-header">
                            <h2 className="section-title">키워드 별 모집 (인기 Top 5)</h2>
                            <Link to="/recruitment" state={{ filter: activeFilter }} className="section-more">자세히보기 &gt;</Link>
                        </div>
                        <div className="horizontal-scroll-list filter-tags">
                            {filterTabs.map(filter => (
                                <div key={filter} className={`filter-tag ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>{filter}</div>
                            ))}
                        </div>
                    </div>
                    <div className="matching-list">
                        {isLoading ? <div>로딩 중...</div> : 
                         filteredMatching.length > 0 ? filteredMatching.map(item => <MatchingCard key={item.id} item={item} />) : 
                         <div style={{padding:'40px 0', textAlign:'center', color:'#999'}}>해당 키워드의 모집글이 없습니다.</div>}
                    </div>
                </section>
            </main>
            <BottomNav />
        </div>
    );
}