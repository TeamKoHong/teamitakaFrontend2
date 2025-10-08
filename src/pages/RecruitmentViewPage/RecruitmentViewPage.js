import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecruitmentViewPage.scss';

// 아이콘 임포트
import { IoChevronBack } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark, FaEye } from "react-icons/fa";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";

import { getDraftById } from '../../api/recruit';

export default function RecruitmentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [post, setPost] = useState(null);
    const [isScrapped, setIsScrapped] = useState(false);
    const [showScrapToast, setShowScrapToast] = useState(false);

    useEffect(() => {
        const draft = getDraftById(id);
        if (draft) {
            const formattedPost = { ...draft.data, id: draft.id, title: draft.title };
            setPost(formattedPost);
        }
    }, [id]);
    
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
    
    if (!post) {
        return <div>게시물을 불러오는 중입니다...</div>;
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
                            <span><HiOutlineChatBubbleOvalLeft /> {post.comments}</span>
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
                    
                    <div className="detail-section">
                        <h3>🙋‍♀️ 우리가 원하는 사람</h3>
                        <ul>
                            {(post.weWant || []).map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h3>🙌 함께 할 내용</h3>
                        <ul>
                            {(post.weDo || []).map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    
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
                    {isScrapped ? <FaBookmark size={22} color="#FF6442"/> : <CiBookmark size={22} />}
                </button>
                <button onClick={handleApply} className="apply-button">
                    지원하기
                </button>
                </div>
            </footer>
        </div>
    );
}