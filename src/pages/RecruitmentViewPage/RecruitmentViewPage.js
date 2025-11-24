import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecruitmentViewPage.scss';

// 아이콘 임포트
import bookmark_active from "../../assets/bookmark_active.png";
import { IoChevronBack } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import apply from "../../assets/apply.png";

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
    const [isScrapped, setIsScrapped] = useState(false);
    const [showScrapToast, setShowScrapToast] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [error, setError] = useState(null);

    // Get current user on component mount
    useEffect(() => {
        const userData = getCurrentUser();
        console.log('🔍 [Auth Debug] getCurrentUser() result:', userData);
        if (userData && userData.user) {
            console.log('✅ [Auth Debug] Setting currentUser:', userData.user);
            console.log('🆔 [Auth Debug] Current userId:', userData.user.userId, 'Type:', typeof userData.user.userId);
            setCurrentUser(userData.user);
        } else {
            console.log('❌ [Auth Debug] No user data found');
        }
    }, []);

    // Close more menu when clicking outside
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
                const data = await getRecruitment(id);
                console.log('📡 [API Debug] Recruitment API response:', data);
                console.log('🆔 [API Debug] Post user_id:', data.user_id, 'Type:', typeof data.user_id);

                // Transform backend response to component format
                const formattedPost = {
                    id: data.recruitment_id,
                    title: data.title,
                    description: data.description || '',
                    period: data.recruitment_start && data.recruitment_end
                        ? formatKoreanDateRange(data.recruitment_start, data.recruitment_end)
                        : '모집 기간 미정',
                    projectInfo: data.description || '',
                    projectType: data.project_type === 'course'
                        ? '수업 프로젝트'
                        : data.project_type === 'side'
                        ? '사이드 프로젝트'
                        : '프로젝트',
                    imageUrl: data.photo_url,
                    views: data.views || 0,
                    applicantCount: data.applicant_count || 0,
                    comments: 0, // Backend doesn't provide comments yet
                    date: data.created_at ? formatRelativeTime(data.created_at) : '',
                    keywords: data.Hashtags?.map(h => h.name) || [],
                    createdBy: data.user_id // Store creator ID for ownership check
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

    // Separate effect to check ownership when both post and currentUser are ready
    useEffect(() => {
        console.log('🔐 [Owner Check] Separate useEffect triggered');
        console.log('👤 [Owner Check] currentUser:', currentUser);
        console.log('📝 [Owner Check] post?.createdBy:', post?.createdBy);

        if (post && currentUser) {
            const isPostOwner = currentUser.userId === post.createdBy;
            console.log('🆔 [Owner Check] currentUser.userId:', currentUser.userId, 'Type:', typeof currentUser.userId);
            console.log('📝 [Owner Check] post.createdBy:', post.createdBy, 'Type:', typeof post.createdBy);
            console.log('❓ [Owner Check] Are they equal?', isPostOwner);
            console.log(isPostOwner ? '✅ [Owner Check] User IS the owner' : '❌ [Owner Check] User is NOT the owner');
            setIsOwner(isPostOwner);
        } else {
            console.log('⏳ [Owner Check] Waiting for data...', { hasPost: !!post, hasCurrentUser: !!currentUser });
            setIsOwner(false);
        }
    }, [post, currentUser]);

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
        if (!post) return;

        // 로그인 체크
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        navigate('/apply2', {
            state: {
                projectId: id,
                projectTitle: post.title
            }
        });
    };

    /**
     * '지원자 보기' 버튼 클릭 시 호출되는 함수 (작성자 전용)
     * ApplicantListSlide 컴포넌트를 열어 지원자 목록을 표시합니다.
     */
    const handleViewApplicants = () => {
        setShowApplicantList(true);
    };

    /**
     * ApplicantListSlide 닫기 핸들러
     */
    const handleCloseApplicantList = () => {
        setShowApplicantList(false);
    };

    /**
     * 게시글 수정 핸들러
     */
    const handleEdit = () => {
        setShowMoreMenu(false);
        // TODO: 수정 페이지로 이동 (예: /recruit/edit/:id)
        // 현재는 수정 페이지가 구현되지 않았으므로 안내 메시지 표시
        alert('게시글 수정 페이지는 아직 준비 중입니다.\n\n수정 페이지 라우트: /recruit/edit/' + id);
        // navigate(`/recruit/edit/${id}`, { state: { recruitment: post } });
    };

    /**
     * 게시글 삭제 핸들러
     */
    const handleDelete = async () => {
        setShowMoreMenu(false);

        if (!window.confirm('정말 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.')) {
            return;
        }

        try {
            await deleteRecruitment(id);
            alert('게시글이 성공적으로 삭제되었습니다.');
            navigate('/team-matching'); // 목록 페이지로 이동
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
                {isOwner && (
                    <div className="more-menu-container">
                        <button
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                            className="more-button"
                            aria-label="더보기"
                        >
                            <BsThreeDotsVertical size={20} />
                        </button>
                        {showMoreMenu && (
                            <div className="more-menu">
                                <button
                                    onClick={handleEdit}
                                    className="menu-item"
                                >
                                    게시글 수정하기
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="menu-item"
                                >
                                    게시글 삭제하기
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <main className="content">
                {post.imageUrl && <img src={post.imageUrl} alt="프로젝트 대표 이미지" className="cover-image" />}
                
                <section className="post-header">
                    <h2 className="post-title">{post.title}</h2>
                    <div className="meta-info">
                        <div className="meta-items">
                            <span><FaEye size={18} /> {post.views}</span>
                            <span><img src={apply} alt="지원자" style={{width: '18px', height: '18px', marginRight: '4px', verticalAlign: 'middle'}} />{post.applicantCount}</span>
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
                    <h3 className="keywords-label">키워드</h3>
                    <div className="keywords-tags">
                        {(post.keywords || []).map((tag, index) => (
                            <span key={index} className="keyword-tag">#{tag}</span>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="footer-buttons">
                    {console.log('🎨 [Render Debug] isOwner state at render time:', isOwner)}
                    {isOwner ? (
                        // 작성자: 지원자 보기 버튼 표시
                        <button onClick={handleViewApplicants} className="apply-button-full">
                            지원자 보기
                        </button>
                    ) : (
                        // 일반 사용자: 지원하기 버튼 표시
                        <button onClick={handleApply} className="apply-button-full">
                            지원하기
                        </button>
                    )}
                    <button onClick={() => navigate(-1)} className="close-button">
                        닫기
                    </button>
                </div>
            </footer>

            {/* 지원자 목록 슬라이드 (작성자 전용) */}
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