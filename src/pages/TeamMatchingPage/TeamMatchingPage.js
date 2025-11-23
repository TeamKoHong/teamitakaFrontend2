import React, { useState, useEffect } from 'react';
import './TeamMatchingPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import Header from "../../components/TeamMatching/Header/Header";
import recruit_write from "../../assets/recruit_write.png";
import bookmark from "../../assets/bookmark.png";
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
    
    return (
        <div className="hot-topic-card" onClick={handleCardClick}>
            <div className="hot-topic-card-header">
                {/* 카테고리나 태그가 없으면 기본값 표시 */}
                <span className={`tag ${item.category ? 'marketing' : ''}`}>
                    {item.category || '프로젝트'}
                </span>
                <img 
                    src={bookmark} 
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
                {/* 이미지가 없으면 회색 박스 처리 혹은 기본 이미지 */}
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} />
                ) : (
                    <div style={{width:'100%', height:'100%', backgroundColor:'#eee', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa'}}>No Image</div>
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
    const recruitmentFilters = ['전체', '마케팅', '디자인', '브랜딩', 'IT', '서비스 개발', '기획'];
    const [activeFilter, setActiveFilter] = useState(recruitmentFilters[1]);
    const [allPosts, setAllPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ★ [핵심] 실제 서버 데이터를 불러오는 useEffect
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                // 1. 서버에서 데이터 가져오기
                const data = await getAllRecruitments();
                console.log("📡 서버에서 받은 모집글 목록:", data);

                // 2. 서버 데이터 형식을 프론트엔드 컴포넌트에 맞게 변환 (Mapping)
                // 백엔드는 snake_case (recruitment_id, photo_url 등)를 줄 가능성이 높음
                const formattedData = data.map(post => ({
                    id: post.recruitment_id,        // UUID
                    title: post.title,
                    description: post.description,
                    imageUrl: post.photo_url,       // DB 컬럼명 확인 필요 (보통 photo_url)
                    views: post.views || post.view_count || 0,
                    applicantCount: post.applicant_count || post.applicantCount || 0,
                    
                    date: post.created_at ? (post.created_at.substring(0, 10)) : '', 
                    category: post.project_type === 'course' ? '수업' : '사이드',
                    
                    // ★ 키워드도 여기서 안전하게 처리
                    tags: (post.Hashtags || post.hashtags || []).map(h => h.name || h),
                    
                    isBest: (post.views > 100),
                }));

                setAllPosts(formattedData);
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
                // 에러 시 빈 배열 유지
                setAllPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleBookmarkToggle = (id) => {
        console.log(`Bookmark toggled for ${id}`);
    };

    const availableFilters = recruitmentFilters.filter(tag => tag !== '전체');
    
    // 필터링 로직 (실제 데이터 기반)
    // 태그가 없거나 일치하면 보여줌. (데이터가 적을 땐 필터 로직을 느슨하게 잡음)
    const filteredMatching = allPosts.filter(item => {
        if (activeFilter === '전체') return true;
        // 태그가 아예 없으면 일단 보여주거나 숨김 (정책 결정)
        if (!item.tags || item.tags.length === 0) return true; 
        return item.tags.includes(activeFilter);
    });

    return (
        <div className="team-matching-app">
            <Header />
            <main className="app-content">
                <section className="section section-project-banner">
                    <div className="section-header">
                        <h2 className="section-title">팀원 구하기</h2>
                    </div>
                    <CreateProjectBanner />
                </section>
                
                <section className="section section--panel">
                    <div className="section-header">
                        <h2 className="section-title">홍익 HOT 교내 공고</h2>
                    </div>
                    <div className="horizontal-scroll-list">
                        {isLoading ? (
                            <div style={{padding:'20px', color:'#999'}}>로딩 중...</div>
                        ) : allPosts.length > 0 ? (
                            allPosts.map(item => (
                                <HotTopicCard
                                    key={item.id}
                                    item={item}
                                    onBookmarkToggle={handleBookmarkToggle}
                                />
                            ))
                        ) : (
                            <div style={{padding:'20px', color:'#999'}}>등록된 공고가 없습니다.</div>
                        )}
                    </div>
                </section>
                
                <section className="section">
                    <div className="section-top">
                        <div className="section-header">
                            <h2 className="section-title">키워드 별 모집</h2>
                            <Link to="/recruitment" state={{ filter: activeFilter }} className="section-more">
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
                    </div>
                    <div className="matching-list">
                        {isLoading ? (
                            <div>로딩 중...</div>
                        ) : filteredMatching.length > 0 ? (
                            filteredMatching.map(item => (
                                <MatchingCard key={item.id} item={item} />
                            ))
                        ) : (
                            <div style={{padding:'40px 0', textAlign:'center', color:'#999'}}>
                                해당 카테고리의 모집글이 없습니다.<br/>
                                <small>(필터를 변경하거나 전체를 확인해보세요)</small>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <BottomNav />
        </div>
    );
}