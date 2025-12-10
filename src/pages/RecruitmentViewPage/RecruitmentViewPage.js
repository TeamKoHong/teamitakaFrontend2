import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecruitmentViewPage.scss';

// 아이콘 및 이미지 임포트
import { IoChevronBack } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

// ★ [수정 1] view.png, apply.png 이미지 임포트
import viewIcon from "../../assets/view.png"; 
import applyIcon from "../../assets/apply.png"; 

import bookmarkIcon from "../../assets/bookmark.png";           
import bookmarkActiveIcon from "../../assets/bookmark_active.png"; 

import { getRecruitment, deleteRecruitment } from '../../services/recruitment';
import { getCurrentUser } from '../../services/auth';
import { formatKoreanDateRange, formatRelativeTime } from '../../utils/dateUtils';
import ApplicantListSlide from '../../components/ApplicantListSlide';

export default function RecruitmentViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showApplicantList, setShowApplicantList] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [error, setError] = useState(null);

    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const userData = getCurrentUser();
        if (userData && userData.user) {
            setCurrentUser(userData.user);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMoreMenu && !event.target.closest('.more-menu-container')) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMoreMenu]);

    useEffect(() => {
        const fetchRecruitment = async () => {
            try {
                const response = await getRecruitment(id);
                console.log("📝 API 원본 응답:", response);

                // [중요 수정 1] 백엔드 응답이 { data: {...} } 형태인지, 바로 객체 {...} 인지 확인하여 처리
                // response.data가 있으면 그것을 쓰고, 없으면 response 자체를 씁니다.
                const data = response.data || response;

                // [중요 수정 2] 필수 데이터가 없을 경우를 대비한 안전 장치 (Nullish Coalescing)
                const hashtags = data.Hashtags || data.hashtags || [];
                const keywordList = hashtags.map(h => (typeof h === 'string' ? h : h.name));

                const formattedPost = {
                    id: data.recruitment_id,
                    title: data.title,
                    description: data.description || '',
                    // [중요 수정 3] 날짜 데이터가 null일 경우 format 함수가 에러나지 않도록 방어 코드 추가
                    period: (data.recruitment_start && data.recruitment_end)
                        ? formatKoreanDateRange(data.recruitment_start, data.recruitment_end)
                        : '모집 기간 미정',
                    projectInfo: data.description || '', // 필요한 경우 다른 필드로 매핑
                    projectType: data.project_type === 'course'
                        ? '수업 프로젝트'
                        : data.project_type === 'side'
                        ? '사이드 프로젝트'
                        : '프로젝트',
                    imageUrl: data.photo_url || data.photo, // 필드명 불일치 대비
                    views: data.views || 0,
                    applicantCount: data.applicant_count || 0,
                    bookmarkCount: data.scrap_count || data.bookmark_count || 0,
                    date: data.created_at ? formatRelativeTime(data.created_at) : '',
                    keywords: keywordList,
                    createdBy: data.user_id, // Owner 체크용 ID
                    recruitmentInfo: { count: data.recruit_count || '-', activity: '-' },
                    activityMethod: data.activity_method || '-'
                };

                setPost(formattedPost);
            } catch (err) {
                console.error('Failed to fetch recruitment:', err);
                setError(err.message);
            }
        };

        fetchRecruitment();
    }, [id]);

    useEffect(() => {
        if (post && currentUser) {
            setIsOwner(currentUser.userId === post.createdBy);
        }
    }, [post, currentUser]);

    const handleApply = () => {
        if (!post) return;
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }
        navigate('/apply2', {
            state: { projectId: id, projectTitle: post.title }
        });
    };

    const handleViewApplicants = () => setShowApplicantList(true);

    const handleBookmarkToggle = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleCloseApplicantList = () => {
        setShowApplicantList(false);
    };

    const handleEdit = () => {
        setShowMoreMenu(false);
        alert('게시글 수정 페이지는 아직 준비 중입니다.\n\n수정 페이지 라우트: /recruit/edit/' + id);
    };

    const handleDelete = async () => {
        setShowMoreMenu(false);

        if (!window.confirm('정말 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.')) {
            return;
        }

        try {
            await deleteRecruitment(id);
            alert('게시글이 성공적으로 삭제되었습니다.');
            navigate('/team-matching');
        } catch (err) {
            console.error('❌ Delete recruitment failed:', err);
            let errorMessage = '게시글 삭제에 실패했습니다.';
            if (err.code === 'UNAUTHORIZED') {
                errorMessage = '로그인이 필요하거나 권한이 없습니다.';
            } else if (err.code === 'NOT_FOUND') {
                errorMessage = '게시글을 찾을 수 없습니다.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        }
    };

    if (error) {
        return <div className="view-page" style={{padding:'20px', textAlign:'center'}}>{error} <br/><button onClick={()=>navigate(-1)}>뒤로가기</button></div>;
    }

    if (!post) {
        return <div className="view-page" style={{padding:'20px', textAlign:'center'}}>로딩 중...</div>;
    }

    return (
        <div className="view-page">
            <header className="topbar">
                <button onClick={() => navigate(-1)} className="back-button" aria-label="뒤로가기">
                    <IoChevronBack size={24} />
                </button>
                <h1 className="title">모집글</h1>
                {isOwner && (
                    <div className="more-menu-container">
                        <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="more-button">
                            <BsThreeDotsVertical size={20} />
                        </button>
                        {showMoreMenu && (
                            <div className="more-menu">
                                <button onClick={handleEdit} className="menu-item">게시글 수정하기</button>
                                <button onClick={handleDelete} className="menu-item">게시글 삭제하기</button>
                            </div>
                        )}
                    </div>
                )}
            </header>
                <hr className="divider" />

            <main className="content">
                <div className="image-container">
                    {post.imageUrl ? (
                        <img src={post.imageUrl} alt="대표 이미지" className="cover-image" />
                    ) : (
                        <div className="no-image-placeholder">
                            <span>No Image</span>
                        </div>
                    )}
                </div>
                
                <section className="post-header">
                    <h2 className="post-title">{post.title}</h2>
                    <div className="meta-info">
                        {/* ★ [수정 2] SCSS 클래스(.twoicons)에 맞춰 구조 변경 및 이미지 적용 */}
                        <div className="twoicons">
                            <div className="view-icon">
                                <img src={viewIcon} alt="조회수" /> {post.views}
                            </div>
                            <div className="apply-icon"
                                onClick={handleViewApplicants}
                                style={{cursor: 'pointer'}}
                            >
                                <img src={applyIcon} alt="지원자" /> {post.applicantCount}
                            </div>
                        </div>
                        <span className="date">{post.date}</span>
                    </div>
                </section>
                                
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
                </section>
                <hr className="divider" />

                <section className="keywords-section">
                    <h3 className="keywords-label">키워드</h3>
                    <div className="keywords-tags">
                        {post.keywords.length > 0 ? (
                            post.keywords.map((tag, index) => (
                                <span key={index} className="keyword-tag">#{tag}</span>
                            ))
                        ) : (
                            <span style={{color:'#999', fontSize:'13px'}}>등록된 키워드가 없습니다.</span>
                        )}
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="footer-buttons-new">
                    <button 
                        onClick={handleBookmarkToggle} 
                        className="bookmark-btn"
                        aria-label="북마크"
                    >
                        <img 
                            src={isBookmarked ? bookmarkActiveIcon : bookmarkIcon} 
                            alt="bookmark" 
                            style={{width: '24px', height: '24px'}}
                        />
                        <span className="bookmark-count">
                            {post ? post.bookmarkCount : 0}
                        </span>
                    </button>

                    
                        <button onClick={handleApply} className="apply-btn-expanded">
                            지원하기
                        </button>
                    
                </div>
            </footer>

            {showApplicantList && (
                <ApplicantListSlide
                    open={showApplicantList}
                    onClose={handleCloseApplicantList}
                    recruitmentId={id}
                />
            )}
        </div>
    );
}