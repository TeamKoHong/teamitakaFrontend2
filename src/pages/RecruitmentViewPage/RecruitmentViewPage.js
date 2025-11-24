import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecruitmentViewPage.scss';

// 아이콘 및 이미지 임포트
import { IoChevronBack } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import applyIcon from "../../assets/apply.png"; // 변수명 충돌 방지 위해 이름 변경
import bookmarkIcon from "../../assets/bookmark.png";          // 북마크 OFF 이미지
import bookmarkActiveIcon from "../../assets/bookmark_active.png"; // 북마크 ON 이미지

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

    // ★ 북마크 상태 관리 (API 연동 전엔 로컬 상태로만 구현)
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const userData = getCurrentUser();
        if (userData && userData.user) {
            setCurrentUser(userData.user);
        }
    }, []);

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMoreMenu && !event.target.closest('.more-menu-container')) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMoreMenu]);

    // 게시글 데이터 불러오기
    useEffect(() => {
        const fetchRecruitment = async () => {
            try {
                const data = await getRecruitment(id);
                console.log("📝 상세 데이터 확인:", data); // 디버깅용 로그

                // 키워드 데이터 안전하게 가져오기 (대소문자 이슈 방지)
                const hashtags = data.Hashtags || data.hashtags || [];
                const keywordList = hashtags.map(h => (typeof h === 'string' ? h : h.name));

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
                    applicantCount: data.applicant_count || 0, // 백엔드에서 보내주는 필드명 확인
                    date: data.created_at ? formatRelativeTime(data.created_at) : '',
                    keywords: keywordList, // 위에서 처리한 키워드 리스트
                    createdBy: data.user_id,
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
    const handleCloseApplicantList = () => setShowApplicantList(false);
    
    // ★ 북마크 토글 함수
    const handleBookmarkToggle = () => {
        setIsBookmarked(!isBookmarked);
        // 추후 여기에 API 호출 추가 (북마크 저장/해제)
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
                {/* ★ 이미지 섹션 수정: 이미지가 없으면 No Image 표시 */}
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
                        <div className="meta-items">
                            <span><FaEye size={18} /> {post.views}</span>
                            <span><img src={applyIcon} alt="지원자" style={{width: '18px', height: '18px', marginRight: '4px', verticalAlign: 'middle'}} />{post.applicantCount}</span>
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
                    {/* 추가 정보 섹션들 생략 가능 */}
                </section>

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

            {/* ★ 하단 버튼 섹션 전면 수정 */}
            <footer className="footer">
                <div className="footer-buttons-new">
                    {/* 왼쪽: 북마크 버튼 */}
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
                    </button>

                    {/* 오른쪽: 지원하기 / 지원자보기 버튼 (꽉 채우기) */}
                    {isOwner ? (
                        <button onClick={handleViewApplicants} className="apply-btn-expanded">
                            지원자 보기
                        </button>
                    ) : (
                        <button onClick={handleApply} className="apply-btn-expanded">
                            지원하기
                        </button>
                    )}
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