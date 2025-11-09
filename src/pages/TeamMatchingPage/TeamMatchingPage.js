import React, { useState, useEffect } from 'react';
import './TeamMatchingPage.scss';
import BottomNav from "../../components/Common/BottomNav/BottomNav";
import Header from "../../components/TeamMatching/Header/Header";
import recruit_write from "../../assets/recruit_write.png";
import bookmark from "../../assets/bookmark.png";
import bookmark_active from "../../assets/bookmark_active.png";
import { IoEyeOutline } from "react-icons/io5";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';

// recruit API만 임포트합니다.
import { loadDrafts, saveDraftToList } from '../../api/recruit';

// --- 컴포넌트들 (CreateProjectBanner, HotTopicCard, MatchingCard) ---
// 이 컴포넌트들은 수정 없이 그대로 사용합니다.
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
    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        onBookmarkToggle(item.id);
    };
    return (
        <div className="hot-topic-card" onClick={handleCardClick}>
            <div className="hot-topic-card-header">
                <span className={`tag ${item.category?.toLowerCase()}`}>{item.category}</span>
            <img src={bookmark} alt="북마크" className="bookmark-icon" />
            </div>
            <div className="hot-topic-card-title">{item.title}</div>
            <div className="hot-topic-card-desc">{item.description}</div>
            <div className="hot-topic-card-info">
                <span><IoEyeOutline /> {item.views}</span>
                <span><HiOutlineChatBubbleOvalLeft /> {item.comments}</span>
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
                <img src={item.imageUrl} alt={item.title} />
                {item.isBest && <span className="best-badge">Best</span>}
            </div>
            <div className="matching-card-content">
                <div className="matching-card-title">{item.title}</div>
                <div className="matching-card-info">
                    <span><IoEyeOutline /> {item.views}</span>
                    <span><HiOutlineChatBubbleOvalLeft /> {item.comments}</span>
                    <span>{item.date}</span>
                </div>
            </div>
        </div>
    );
};


export default function TeamMatchingPage() {
    // 필터 옵션도 이 파일 내에서 직접 관리합니다.
    const recruitmentFilters = ['전체', '마케팅', '디자인', '브랜딩', 'IT', '서비스 개발', '기획'];
    
    const [activeFilter, setActiveFilter] = useState(recruitmentFilters[1]);
    const [allPosts, setAllPosts] = useState([]);

    useEffect(() => {
        let drafts = loadDrafts();

        if (drafts.length === 0) {
            console.log('TeamMatchingPage: 로컬 스토리지가 비어있어 초기 데이터를 생성합니다...');
            
            // mockData.js 대신, 초기 데이터를 이 곳에 직접 정의합니다.
            const initialPosts = [
                {
                    id: 'hot1',
                    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
                    category: '마케팅',
                    title: '[김혜현 교수님] 비주얼 마케터 디자인',
                    description: '마케팅 분야 지식 있으신 분 구하고 있습니다. 함께 열심히 하실 분 연락...',
                    views: 302,
                    comments: 79,
                    date: '25.04.10',
                    tags: ['마케팅', '디자인'],
                    period: '2025.04.15 ~ 2025.05.01',
                    projectInfo: '시각디자인과 / 김혜현 교수님',
                    projectType: '교내 프로젝트 (수업 연계)',
                    weWant: ['열정 넘치는 분', '소통을 잘하는 분'],
                    weDo: ['브랜드 컨셉 기획', '상세 페이지 디자인'],
                    keywords: ['#마케팅', '#디자인', '#포트폴리오'],
                },
                {
                    id: 'best1',
                    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
                    isBest: true,
                    title: '[김혜현 교수님] 비주얼 마케터 디자인팀 프로젝트 인원 구합니다!',
                    views: 580,
                    comments: 79,
                    date: '25.03.24',
                    tags: ['마케팅', '디자인'],
                    period: '2025.09.01 ~ 2025.12.20',
                    projectInfo: '시각디자인과 / 김혜현 교수님',
                    projectType: '교내 프로젝트 (수업 연계)',
                    description: '비주얼 마케팅 디자인 강의를 함께 들으며 성장할 팀원을 찾습니다!',
                    keywords: ['#마케팅', '#디자인', '#포트폴리오', '#협업'],
                },
                // 필요하다면 여기에 다른 초기 게시물 데이터를 추가하세요.
            ];

            // 정의한 초기 데이터를 로컬 스토리지에 저장합니다.
            initialPosts.forEach(post => {
                saveDraftToList({
                    id: post.id,
                    title: post.title,
                    data: { ...post }
                });
            });

            drafts = loadDrafts();
        }

        const formattedPosts = drafts.map(p => ({
            ...p.data,
            id: p.id,
            title: p.title,
        }));
        setAllPosts(formattedPosts);

    }, []);

    
    const handleBookmarkToggle = (id) => {
        console.log(`Bookmark toggled for ${id}`);
    };

    const availableFilters = recruitmentFilters.filter(tag => tag !== '전체');
    
    const hotTopics = allPosts.filter(p => p.id === 'hot1' || p.id === 'hot2');
    const filteredMatching = allPosts.filter(item =>
        item.tags && item.tags.includes(activeFilter)
    );

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
                        {filteredMatching.map(item => (
                            <MatchingCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            </main>
            <BottomNav />
        </div>
    );
}