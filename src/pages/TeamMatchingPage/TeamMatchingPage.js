import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './TeamMatchingPage.scss';

// --- 컴포넌트 및 에셋 임포트 ---
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import Header from "../../components/TeamMatching/Header/Header";
import recruit_write from "../../assets/recruit_write.png";
import bookmark from "../../assets/bookmark.png";
import bookmarkActive from "../../assets/bookmark_active.png";
import view from "../../assets/view.png";
import apply from "../../assets/apply.png";

// ★ 기본 이미지 임포트 (이미지가 없을 때 보여줄 로고 등)
import defaultProjectImg from "../../assets/icons/Teamitaka.png"; 

import { getAllRecruitments } from '../../api/recruit';

// ---------------------------------------------
// [1] 배너 컴포넌트
// ---------------------------------------------
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

// ---------------------------------------------
// [2] 가로 스크롤 카드 (Hot Topic)
// ---------------------------------------------
const HotTopicCard = ({ item, onBookmarkToggle }) => {
    const navigate = useNavigate();
    
    // 카드 클릭 시 상세 페이지로 이동
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

// ---------------------------------------------
// [3] 세로 리스트 카드 (Matching Card)
// ---------------------------------------------
const MatchingCard = ({ item }) => {
    const navigate = useNavigate();
    const handleCardClick = () => navigate(`/recruitment/${item.id}`);
    
    // 이미지 소스 결정: 서버 이미지 -> 없으면 기본 이미지
    const imageSource = item.imageUrl || defaultProjectImg;

    return (
        <div className="matching-card" onClick={handleCardClick}>
            <div className="matching-card-thumbnail">
                {/* ★ 이미지 렌더링 수정: object-fit 적용 및 에러 처리 */}
                <img 
                    src={imageSource} 
                    alt={item.title} 
                    className="card-img" 
                    onError={(e) => { e.target.src = defaultProjectImg; }} // 이미지 로드 실패 시 기본 이미지로 대체
                />
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

// ---------------------------------------------
// [Main] 전체 페이지 컴포넌트
// ---------------------------------------------
export default function TeamMatchingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // SearchPage에서 전달된 검색어 가져오기
    const passedSearchQuery = location.state?.searchQuery || '';

    const [activeFilter, setActiveFilter] = useState('전체');
    const [allPosts, setAllPosts] = useState([]);
    
    const [hotProjects, setHotProjects] = useState([]); 
    const [filterTabs, setFilterTabs] = useState(['전체']); 
    const [topKeywords, setTopKeywords] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    // 1. 데이터 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const data = await getAllRecruitments();
                
                console.log("📝 전체 모집글 데이터:", data); // 디버깅용

                // 백엔드 데이터를 프론트엔드 포맷으로 변환
                const formattedData = data.map(post => {
                    const viewCount = Number(post.views || 0);
                    const appCount = Number(post.applicationCount || 0);
                    
                    // ★ 핵심: 백엔드에서 photo_url을 받아옵니다.
                    // (만약 photo_url이 null이면 위 MatchingCard에서 defaultProjectImg 처리함)
                    const rawImage = post.photo_url || post.imageUrl || null;

                    return {
                        id: post.recruitment_id,
                        title: post.title,
                        description: post.description,
                        imageUrl: rawImage, 
                        views: viewCount,
                        applicantCount: appCount,
                        // 날짜 포맷팅 (YYYY-MM-DD)
                        date: post.created_at ? (typeof post.created_at === 'string' ? post.created_at.substring(0, 10) : '') : '', 
                        category: post.project_type === 'course' ? '수업' : '사이드',
                        // 태그 매핑 (객체 배열 or 문자열 배열 대응)
                        tags: (post.Hashtags || post.hashtags || []).map(h => h.name || h),
                        score: viewCount + (appCount * 10), // 인기순 정렬 점수
                        isBookmarked: false,
                        isBest: appCount >= 5 // 예: 지원자가 5명 이상이면 Best 뱃지
                    };
                });

                // (1) Hot 공고 설정 (Top 10)
                const sortedByScore = [...formattedData].sort((a, b) => b.score - a.score);
                setHotProjects(sortedByScore.slice(0, 10));

                // (2) 인기 키워드 추출 (Top 5)
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

                setTopKeywords(sortedTags);
                setFilterTabs(['전체', ...sortedTags]); 
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

    // 2. 북마크 핸들러 (UI 업데이트용)
    const handleBookmarkToggle = (id) => {
        setHotProjects(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
        setAllPosts(prev => prev.map(item => item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item));
    };

    // 3. 필터링 로직 (검색어 + 태그 탭)
    const filteredMatching = allPosts.filter(item => {
        // (A) 검색어가 있을 경우: 제목, 설명, 태그 중 하나라도 일치하면 표시
        if (passedSearchQuery) {
            const query = passedSearchQuery.toLowerCase();
            const titleMatch = item.title.toLowerCase().includes(query);
            const descMatch = item.description ? item.description.toLowerCase().includes(query) : false;
            const tagMatch = item.tags ? item.tags.some(t => t.toLowerCase().includes(query)) : false;
            
            return titleMatch || descMatch || tagMatch;
        }

        // (B) 검색어가 없을 경우: 탭 필터 적용
        if (activeFilter === '전체') {
            // 전체 탭: 인기 키워드에 속한 태그가 하나라도 있거나, 데이터가 적으면 다 보여주기
            // 여기서는 '전체' 탭 클릭 시 모든 게시글을 보여주는 것으로 설정 (사용성 고려)
            return true; 
            // 만약 '키워드 Top5 연관 글만' 보여주고 싶다면 아래 주석 해제
            // if (!item.tags || item.tags.length === 0) return false;
            // return item.tags.some(tag => topKeywords.includes(tag));
        } else {
            // 특정 태그 탭
            return item.tags && item.tags.includes(activeFilter);
        }
    });

    // 검색 초기화 핸들러
    const handleClearSearch = () => {
        navigate(location.pathname, { state: {} }); // state 비우기
    };

    return (
        <div className="team-matching-app">
            <Header />
            <main className="app-content">
                
                {/* [섹션 1] 배너 영역 (검색 중이 아닐 때만 표시) */}
                {!passedSearchQuery && (
                    <section className="section section-project-banner">
                        <div className="section-header"><h2 className="section-title">팀원 구하기</h2></div>
                        <CreateProjectBanner />
                    </section>
                )}

                {/* [섹션 2] Hot 공고 (검색 중이 아닐 때만 표시) */}
                {!passedSearchQuery && (
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
                )}
                
                {/* [섹션 3] 메인 리스트 (검색 결과 or 필터 결과) */}
                <section className="section">
                    
                    {/* (A) 검색 결과 헤더 */}
                    {passedSearchQuery ? (
                        <div style={{padding: '10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                            <h2 className="section-title">"{passedSearchQuery}" 검색 결과</h2>
                            <button onClick={handleClearSearch} style={{fontSize:'12px', padding:'6px 10px', borderRadius:'15px', border:'1px solid #ccc', background:'#fff', cursor:'pointer'}}>
                                초기화
                            </button>
                        </div>
                    ) : (
                    /* (B) 일반 필터 탭 헤더 */
                        <div className="section-top">
                            <div className="section-header">
                                <h2 className="section-title">키워드 별 모집</h2>
                            </div>
                            <div className="horizontal-scroll-list filter-tags">
                                {filterTabs.map(filter => (
                                    <div key={filter} className={`filter-tag ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>{filter}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 리스트 출력 */}
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