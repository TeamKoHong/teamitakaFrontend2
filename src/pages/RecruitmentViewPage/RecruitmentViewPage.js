import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecruitmentViewPage.scss';

// 아이콘 임포트
import bookmark_active from "../../assets/bookmark_active.png";
import { IoChevronBack } from "react-icons/io5";
import { FaBookmark, FaEye } from "react-icons/fa";
import apply from "../../assets/apply.png";
import { getDraftById } from '../../api/recruit';
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";

import { getRecruitment } from '../../services/recruitment';

export default function RecruitmentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isScrapped, setIsScrapped] = useState(false);
    const [showScrapToast, setShowScrapToast] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecruitment = async () => {
            try {
                const data = await getRecruitment(id);

                // Transform backend response to component format
                const formattedPost = {
                    id: data.recruitment_id,
                    title: data.title,
                    description: data.description || '',
                    period: data.recruitment_start && data.recruitment_end
                        ? `${data.recruitment_start} ~ ${data.recruitment_end}`
                        : '모집 기간 미정',
                    projectInfo: data.description || '',
                    projectType: data.project_type === 'course'
                        ? '수업 프로젝트'
                        : data.project_type === 'side'
                        ? '사이드 프로젝트'
                        : '프로젝트',
                    imageUrl: data.photo_url,
                    views: data.views || 0,
                    comments: 0, // Backend doesn't provide comments yet
                    date: data.created_at ? new Date(data.created_at).toLocaleDateString('ko-KR') : '',
                    keywords: data.Hashtags?.map(h => h.name) || []
                };

                setPost(formattedPost);
            } catch (err) {
                console.error('Failed to fetch recruitment:', err);
                setError(err.message);

                if (err.code === 'NOT_FOUND') {
                    setTimeout(() => navigate(-1), 2000);
                }
            }
        };

        fetchRecruitment();
    }, [id, navigate]);
    
    const handleScrapToggle = () => {
        const newState = !isScrapped;
        setIsScrapped(newState);
        if (newState) {
            setShowScrapToast(true);
            setTimeout(() => setShowScrapToast(false), 2000);
        }
    };
    
    /**
     * '지원하기' 버튼 클릭 시 호출되는 함수
     * /apply2 경로로 이동하면서, 어떤 프로젝트에 지원하는지 ID와 제목 정보를 함께 전달합니다.
     */
    const handleApply = () => {
        if (!post) return; // 게시물 정보가 없으면 실행하지 않음

        navigate('/apply2', {
            state: { 
                projectId: id,
                projectTitle: post.title 
            }
        });
    };
    
    if (error) {
        return (
            <div className="view-page">
                <header className="topbar">
                    <button onClick={() => navigate(-1)} className="back-button" aria-label="뒤로가기">
                        <IoChevronBack size={24} />
                    </button>
                    <h1 className="title">모집글</h1>
                </header>
                <main className="content" style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#666' }}>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            background: '#FF6442',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        뒤로 가기
                    </button>
                </main>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="view-page">
                <header className="topbar">
                    <h1 className="title">모집글</h1>
                </header>
                <main className="content" style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <p>게시물을 불러오는 중입니다...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="view-page">
            {showScrapToast && <div className="scrap-toast">현재 게시글을 스크랩 했습니다. ✔</div>}

            <header className="topbar">
                <button onClick={() => navigate(-1)} className="back-button" aria-label="뒤로가기">
                    <IoChevronBack size={24} />
                </button>
                <h1 className="title">모집글</h1>
            </header>

            <main className="content">
                {post.imageUrl && <img src={post.imageUrl} alt="프로젝트 대표 이미지" className="cover-image" />}
                
                <section className="post-header">
                    <h2 className="post-title">{post.title}</h2>
                    <div className="meta-info">
                        <div className="meta-items">
                            <span><FaEye /> {post.views}</span>
            <img src={apply} alt="지원자수"/>
                        </div>
                        <span className="date">{post.date}</span>
                    </div>
                </section>
                
                <hr className="divider" />
                
                <section className="project-details">
                    <div className="detail-item">
                        <span className="label">모집 기간</span>
                        <span className="value">{post.period}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">프로젝트 정보</span>
                        <span className="value">{post.projectInfo}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">프로젝트 유형</span>
                        <span className="value">{post.projectType}</span>
                    </div>
                </section>

                <hr className="divider" />

                <section className="post-body">
                    <p>{post.description}</p>

                    {post.recruitmentInfo?.count &&
                        <div className="detail-section">
                            <h3>📝 모집 인원: {post.recruitmentInfo.count}</h3>
                        </div>
                    }
                    {post.recruitmentInfo?.activity &&
                        <div className="detail-section">
                            <h3>🏃 활동 기간: {post.recruitmentInfo.activity}</h3>
                        </div>
                    }
                    {post.activityMethod &&
                        <div className="detail-section">
                            <h3>💻 활동 방식: {post.activityMethod}</h3>
                        </div>
                    }
                </section>

                <section className="keywords-section">
                    {(post.keywords || []).map((tag, index) => (
                        <span key={index} className="keyword-tag">{tag}</span>
                    ))}
                </section>
            </main>

            <footer className="footer">
                <div className="footer-section">
                <button onClick={handleScrapToggle} className="scrap-button-footer" aria-label="스크랩">
            <img src={bookmark_active} alt="북마크" className="bookmark-icon" />
                </button>
                <button onClick={handleApply} className="apply-button">
                    지원하기
                </button>
                </div>
            </footer>
        </div>
    );
}