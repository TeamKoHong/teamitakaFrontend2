import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai'; // 뒤로가기 아이콘
import './TeamMatchingPage.scss';

// --- 컴포넌트 및 에셋 임포트 ---
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import Header from "../../components/TeamMatching/Header/Header";
import recruit_write from "../../assets/recruit_write.png";
import bookmark from "../../assets/bookmark.png";
import bookmarkActive from "../../assets/bookmark_active.png";
import view from "../../assets/view.png";
import apply from "../../assets/apply.png";
import { Link } from 'react-router-dom';
import defaultProjectImg from "../../assets/icons/Teamitaka.png"; 

import { getAllRecruitments } from '../../api/recruit';
import { toggleRecruitmentScrap } from '../../services/recruitment';
import { useAuth } from '../../contexts/AuthContext';

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
    const imageSource = item.imageUrl || defaultProjectImg;

    return (
        <div className="matching-card" onClick={handleCardClick}>
            <div className="matching-card-thumbnail">
                <img 
                    src={imageSource} 
                    alt={item.title} 
                    className="card-img" 
                    onError={(e) => { e.target.src = defaultProjectImg; }}
                />
                {item.isBest && <span className="best-badge">Best</span>}
            </div>
            <div className="matching-card-content">
                <div className="matching-card-title">{item.title}</div>
                <div className="matching-card-desc">
                    {item.description || "설명 없음"}
                </div>
                <div className="card-footer">
                <div className="twoicons">
                    <div className="view-icon"><img src={view} alt="조회수"/> {item.views}</div>
                    <div className="apply-icon"><img src={apply} alt="지원자"/> {item.applicantCount} </div>
                </div>
                <div className="date-icon">{item.date}</div>
            </div></div>
        </div>
    );
};

export default function TeamMatchingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 검색어 확인
    const passedSearchQuery = location.state?.searchQuery || '';

    const [activeFilter, setActiveFilter] = useState('전체');
    const [allPosts, setAllPosts] = useState([]);
    const [hotProjects, setHotProjects] = useState([]);
    const [filterTabs, setFilterTabs] = useState(['전체']);
    const [isLoading, setIsLoading] = useState(true);

    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllRecruitments();
                
                const formattedData = data.map(post => {
                    const viewCount = Number(post.views || 0);
                    const appCount = Number(post.applicationCount || 0);
                    const rawImage = post.photo_url || post.imageUrl || null;

                    return {
                        id: post.recruitment_id,
                        title: post.title,
                        description: post.description,
                        imageUrl: rawImage,
                        views: viewCount,
                        applicantCount: appCount,
                        date: post.created_at ? (typeof post.created_at === 'string' ? post.created_at.substring(0, 10) : '') : '',
                        category: post.project_type === 'course' ? '수업' : '사이드',
                        tags: (post.Hashtags || post.hashtags || []).map(h => h.name || h),
                        score: viewCount + (appCount * 10),
                        isBookmarked: !!post.is_scrapped,  // API에서 북마크 상태 로드
                        isBest: appCount >= 5
                    };
                });

                // Hot 공고 및 키워드 설정 로직
                const sortedByScore = [...formattedData].sort((a, b) => b.score - a.score);
                setHotProjects(sortedByScore.slice(0, 3));

                const tagCounts = {};
                formattedData.forEach(post => {
                    if (post.tags) post.tags.forEach(tag => { 
                        if(tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1; 
                    });
                });
                const sortedTags = Object.entries(tagCounts)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .map(([tag]) => tag)
                    .slice(0, 5);

                if (sortedTags.length > 0) {
                    setFilterTabs(sortedTags);
                    setActiveFilter(sortedTags[0]);
                } else {
                    setFilterTabs(['전체']);
                    setActiveFilter('전체');
                }

                setAllPosts(formattedData);
            } catch (error) {
                console.error("❌ 데이터 불러오기 실패:", error);
                setAllPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleBookmarkToggle = async (id) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        // 이전 상태 저장 (롤백용)
        const prevHot = [...hotProjects];
        const prevAll = [...allPosts];

        // 낙관적 업데이트
        setHotProjects(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
        setAllPosts(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));

        try {
            await toggleRecruitmentScrap(id);
        } catch (error) {
            console.error('북마크 변경 실패:', error);
            // 에러 시 롤백
            setHotProjects(prevHot);
            setAllPosts(prevAll);
            alert('북마크 변경에 실패했습니다.');
        }
    };

    const filteredMatching = allPosts.filter(item => {
        if (passedSearchQuery) {
            const query = passedSearchQuery.toLowerCase();
            const titleMatch = item.title.toLowerCase().includes(query);
            const descMatch = item.description ? item.description.toLowerCase().includes(query) : false;
            const tagMatch = item.tags ? item.tags.some(t => t.toLowerCase().includes(query)) : false;
            return titleMatch || descMatch || tagMatch;
        }
        if (activeFilter === '전체') return true; 
        return item.tags && item.tags.includes(activeFilter);
    });

    const handleBackToSearch = () => {
        navigate('/search'); 
    };

    return (
        <div className="team-matching-app">
            {!passedSearchQuery && <Header />}

            <main className="app-content">
                
                {/* 검색 중이 아닐 때만 배너 & Hot 공고 표시 */}
                {!passedSearchQuery && (
                    <>
                        <section className="section section-project-banner">
                            <div className="section-header"><h2 className="section-title">팀원 구하기</h2></div>
                            <CreateProjectBanner />
                        </section>

                        <section className="section section--panel">
                            <div className="section-header"><h2 className="section-title">홍익대 HOT 교내 공고</h2></div>
                            <div className="horizontal-scroll-list">
                                {isLoading ? <div style={{padding:'20px', color:'#999'}}>로딩 중...</div> : 
                                 hotProjects.length > 0 ? hotProjects.map(item => (
                                    <HotTopicCard key={item.id} item={item} onBookmarkToggle={handleBookmarkToggle} />
                                 )) : 
                                 <div style={{padding:'20px', color:'#999'}}>등록된 공고가 없습니다.</div>}
                            </div>
                        </section>
                    </>
                )}
                
                {/* 메인 리스트 섹션 */}
                <section className="section">
                    {passedSearchQuery ? (
                        <div style={{padding: '10px 20px', display:'flex', alignItems:'center'}}>
                            <button 
                                onClick={handleBackToSearch} 
                                style={{background:'none', border:'none', cursor:'pointer', marginRight:'8px', display:'flex', alignItems:'center', padding:'4px'}}
                            >
                                <AiOutlineArrowLeft size={24} color="#333" />
                            </button>
                            <h2 className="section-title" style={{margin: 0}}>"{passedSearchQuery}" 검색 결과</h2>
                        </div>
                    ) : (
                        <div className="section-top">
                            <div className="section-header">
                                <div className="banner-text">
                                    <h2 className="section-title">키워드 별 모집</h2>
                                    <p className="banner-description">가장 인기 있는 키워드를 모아봤어요!</p>
                                </div>
                            <Link to="/recruitment" state={{ filter: activeFilter }} className="section-more">
                                     자세히보기 &gt;
                                </Link>
                            </div>
                            <div className="horizontal-scroll-list filter-tags">
                                {filterTabs.map(filter => (
                                    <div key={filter} className={`filter-tag ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>{filter}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="matching-list">
                        {isLoading ? 
                            <div style={{textAlign:'center', padding:'20px'}}>로딩 중...</div> : 
                         filteredMatching.length > 0 ? 
                            filteredMatching.map(item => <MatchingCard key={item.id} item={item} />) : 
                            <div style={{padding:'40px 0', textAlign:'center', color:'#999'}}>
                                {passedSearchQuery 
                                    ? `'${passedSearchQuery}'에 대한 검색 결과가 없습니다.` 
                                    : '해당하는 모집글이 없습니다.'}
                            </div>
                        }
                    </div>
                </section>
            </main>
            <BottomNav />
        </div>
    );
}