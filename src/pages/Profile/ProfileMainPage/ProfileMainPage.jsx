import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../services/user';
import { getProfileDetail } from '../../../services/profile';
import BottomNav from '../../../components/Common/BottomNav/BottomNav';
import PentagonChart from '../../../components/Common/UI/PentagonChart';
import styles from './ProfileMainPage.module.scss';
import defaultProfileImage from '../../../images/profileImage.png';
import verificationBadge from '../../../assets/대학_인증_완료.svg';

// 캐릭터 배너 이미지 import
import 활동티미 from '../../../assets/character_banner/활동티미.png';
import 긍정티미 from '../../../assets/character_banner/긍정티미.png';
import 분석티미 from '../../../assets/character_banner/분석티미.png';
import 감각티미 from '../../../assets/character_banner/감각티미.png';
import 실험티미 from '../../../assets/character_banner/실험티미.png';
import 안정티미 from '../../../assets/character_banner/안정티미.png';
import 완벽티미 from '../../../assets/character_banner/완벽티미.png';
import 융합티미 from '../../../assets/character_banner/융합티미.png';
import 적응티미 from '../../../assets/character_banner/적응티미.png';
import 조율티미 from '../../../assets/character_banner/조율티미.png';
import 창의티미 from '../../../assets/character_banner/창의티미.png';
import 통찰티미 from '../../../assets/character_banner/통찰티미.png';
import 비회원배너 from '../../../assets/character_banner/비회원 캐릭터 배너_테스트유도용.png';

// 빈 상태 일러스트
import projectEmpty from '../../../assets/icons/project_empty.png';

// 티미 타입별 이미지 매핑
const CHARACTER_IMAGES = {
  '활동티미': 활동티미,
  '긍정티미': 긍정티미,
  '분석티미': 분석티미,
  '감각티미': 감각티미,
  '실험티미': 실험티미,
  '안정티미': 안정티미,
  '완벽티미': 완벽티미,
  '융합티미': 융합티미,
  '적응티미': 적응티미,
  '조율티미': 조율티미,
  '창의티미': 창의티미,
  '통찰티미': 통찰티미,
};

// 아이콘 (임시 - 실제로는 이미지나 SVG 컴포넌트 사용)
const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4 6 8 10 12 6" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L1 7L10 12L19 7L10 2Z" stroke="#807C7C" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 9V14C4 14 6 17 10 17C14 17 16 14 16 14V9" stroke="#807C7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 피드백 카드 컴포넌트 (Figma 스펙: 182x72px)
const FeedbackCard = ({ type, title, items = [] }) => {
  const isPositive = type === 'positive';
  // 빈 배열인 경우 기본 메시지 표시
  const displayItems = items.length > 0 ? items : ['피드백이 없습니다'];

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      minHeight: '72px',
      padding: '12px',
      borderRadius: '10px',
      backgroundColor: isPositive ? '#FFFDFC' : '#F76241',
      boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: 'Pretendard',
        fontSize: '13px',
        fontWeight: 600,
        color: isPositive ? '#000' : '#fff',
        marginBottom: '6px',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </div>
      <div style={{
        color: isPositive ? '#444' : '#efefef',
        fontSize: '10px',
        lineHeight: '165.04%',
        letterSpacing: '-0.01em',
      }}>
        {displayItems.map((item, index) => (
          <div key={index} style={{ marginBottom: '2px' }}>• {item}</div>
        ))}
      </div>
    </div>
  );
};

// 버블 차트 컴포넌트 (Figma 디자인 - Overlap 레이아웃)
// 크기 내림차순 정렬된 버블 스타일 (값이 높은 스킬 → 큰 버블, 큰 버블 → 앞 레이어)
const BUBBLE_STYLES = [
  { size: 123, bg: '#F76241', textColor: '#FFFDFC', top: 0, left: 114, zIndex: 5 },   // 1위 (가장 큰 버블, 가장 앞)
  { size: 107, bg: '#FF9780', textColor: '#FFFDFC', top: 18, left: 0, zIndex: 4 },    // 2위
  { size: 94, bg: '#FFC5B8', textColor: '#FFFDFC', top: 84, left: 60, zIndex: 3 },    // 3위
  { size: 65, bg: '#D1CCCB', textColor: '#FFFDFC', top: 54, left: 232, zIndex: 2 },   // 4위
  { size: 54, bg: '#ECECEC', textColor: '#D1CCCB', top: 104, left: 210, zIndex: 1 },  // 5위 (가장 작은 버블, 가장 뒤)
];

// 기본 스킬 데이터 (API 응답이 없을 때 사용) - PentagonChart와 동일한 순서
const DEFAULT_SKILLS = { 노력: 80, 업무능력: 75, 소통: 85, 성장: 90, 의지: 70 };

const SkillBubbleChart = ({ skills }) => {
  // skills가 없거나 비어있으면 기본값 사용
  const skillData = skills && Object.keys(skills).length > 0 ? skills : DEFAULT_SKILLS;

  // 값 기준 내림차순 정렬 → 높은 값이 큰 버블에 배치됨 (이름과 값 모두 유지)
  const sortedSkills = Object.entries(skillData)
    .sort(([, a], [, b]) => b - a);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '296px',
      height: '177px',
      margin: '0 auto',
    }}>
      {sortedSkills.map(([skillName, skillValue], index) => {
        const style = BUBBLE_STYLES[index];
        if (!style) return null; // 5개 초과 스킬 방어

        // 버블 크기에 따른 폰트 크기 조정
        const nameFontSize = style.size >= 100 ? '16.79px' : style.size >= 80 ? '14px' : '12px';

        return (
          <div
            key={skillName}
            style={{
              position: 'absolute',
              top: style.top,
              left: style.left,
              width: style.size,
              height: style.size,
              borderRadius: '50%',
              backgroundColor: style.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: style.zIndex,
            }}
          >
            <span style={{
              fontSize: nameFontSize,
              fontWeight: 800,
              color: style.textColor,
              fontFamily: 'Pretendard',
              letterSpacing: '-0.01em',
            }}>
              {skillName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function ProfileMainPage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSkillExpanded, setIsSkillExpanded] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // 기본 사용자 정보 로드
        const userRes = await getMe();
        if (userRes?.success && userRes.user) {
          setUserData(userRes.user);
        }

        // 프로필 상세 정보 로드
        const profileRes = await getProfileDetail();
        if (profileRes?.success) {
          setProfileData(profileRes.data);
        }
      } catch (err) {
        if (err?.code === 'UNAUTHORIZED') {
          navigate('/login', { replace: true });
          return;
        }
        setError(err.message || '데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // 설정 버튼 클릭
  const handleSettingsClick = () => {
    navigate('/profile/edit');
  };

  // 인증 뱃지 클릭
  const handleVerificationClick = () => {
    navigate('/profile/verification');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>로딩 중...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Mock 데이터 (API 연동 전)
  const displayData = {
    profileImage: userData?.profileImage || defaultProfileImage,
    username: userData?.username || '사용자',
    university: userData?.university || '대학교 미인증',
    department: userData?.major || userData?.department || '',
    enrollmentStatus: userData?.enrollmentStatus || '재학 중',
    currentProjects: profileData?.totalProjects || profileData?.currentProjects || 0,
    totalTeamExperience: userData?.teamExperience || profileData?.totalTeamExperience || 0,
    tags: userData?.keywords || profileData?.tags || [],
    isVerified: !!userData?.university,
    activityType: profileData?.activityType || null,
    skills: profileData?.skills || null,
    feedback: {
      positive: profileData?.feedback?.positive || [],
      negative: profileData?.feedback?.negative || [],
    },
    projects: profileData?.projects || [],
    totalProjects: profileData?.totalProjects || 0,
  };

  // Empty State 조건 변수
  const isProfileEmpty = !userData?.university && !userData?.major && (!userData?.keywords || userData.keywords.length === 0);
  const hasNoTeamiType = !profileData?.activityType?.type;
  const hasNoProjects = displayData.totalProjects === 0 && (!displayData.projects || displayData.projects.length === 0);
  const hasNoEvaluations = displayData.totalProjects === 0;

  // 캐릭터 배너 핸들러
  const handleBannerClick = () => {
    if (hasNoTeamiType) {
      navigate('/teami-type');
    }
  };

  // 프로젝트 등록 핸들러
  const handleAddProject = () => {
    navigate('/project/create');
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>프로필</span>
        <button className={styles.settingsButton} onClick={handleSettingsClick}>
          <SettingsIcon />
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className={styles.content}>
        {/* 1. 프로필 카드 (컴팩트 가로 배치) */}
        <div className={styles.profileCard}>
          <div className={styles.profileImageWrapper}>
            <img
              src={displayData.profileImage}
              alt="프로필"
              className={styles.profileImage}
            />
            {displayData.isVerified && (
              <img
                src={verificationBadge}
                alt="대학 인증 완료"
                className={styles.verificationBadge}
                onClick={handleVerificationClick}
              />
            )}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>
              {isProfileEmpty ? '프로필을 입력하세요.' : `${displayData.username} 티미님`}
            </div>
            <div className={styles.profileUniversity}>
              <GraduationCapIcon />
              <span>
                {isProfileEmpty
                  ? '대학교명 재학 중'
                  : `${displayData.university} ${displayData.department} ${displayData.enrollmentStatus}`
                }
              </span>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.statHighlight}>
                {isProfileEmpty
                  ? '현재 진행중인 프로젝트가 없어요.'
                  : <>현재 진행중인 프로젝트 <span className={styles.statOrange}>총 {displayData.currentProjects}건</span></>
                }
              </div>
              <div className={styles.statNormal}>
                {isProfileEmpty
                  ? '팀플 경험이 없어요.'
                  : `전체 팀플 경험 ${displayData.totalTeamExperience}회`
                }
              </div>
            </div>
            {!isProfileEmpty && displayData.tags.length > 0 && (
              <div className={styles.profileTags}>
                {displayData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. 활동 타입 카드 (배너 이미지만 표시) */}
        <div
          className={`${styles.activityCard} ${hasNoTeamiType ? styles.clickable : ''}`}
          onClick={handleBannerClick}
          style={{ cursor: hasNoTeamiType ? 'pointer' : 'default' }}
        >
          <img
            src={hasNoTeamiType ? 비회원배너 : (CHARACTER_IMAGES[displayData.activityType?.type] || 활동티미)}
            alt={hasNoTeamiType ? '지금 캐릭터 확인하기' : displayData.activityType?.type}
            className={styles.activityBanner}
          />
        </div>

        {/* 3. 프로필 소개 문구 */}
        <div className={styles.profileIntro}>
          {isProfileEmpty ? (
            <>
              프로필을 작성하고 <br/>
              <span className={styles.profileIntroHighlight}>내 팀플 분석</span>을 완성해보세요!
            </>
          ) : (
            <>
              지난 활동을 돌아보고, <br/>
              <span className={styles.profileIntroHighlight}>더 나은 팀원</span>이 되어가요.
            </>
          )}
        </div>

        {/* 능력치 분석 섹션 */}
        <div className={styles.skillSection}>
          <div className={styles.skillHeader}>
            <span className={styles.skillTitle}>팀플 능력치 분석</span>
            <span className={styles.skillProjectCount}>
              {hasNoEvaluations
                ? '프로젝트 종합 결과가 없어요.'
                : `${displayData.totalProjects}회 프로젝트 종합결과`
              }
            </span>
          </div>

          {hasNoEvaluations ? (
            <div className={styles.emptySkillContainer}>
              <img
                src={projectEmpty}
                alt="데이터 없음"
                className={styles.emptyIllustration}
              />
              <p className={styles.emptyText}>
                프로젝트 정보가 없어요.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.bubbleChartContainer}>
                <SkillBubbleChart skills={displayData.skills} />
              </div>

              <button
                className={styles.expandButton}
                onClick={() => setIsSkillExpanded(!isSkillExpanded)}
              >
                나의 능력치 분석 자세히보기
                <span className={`${styles.expandIcon} ${isSkillExpanded ? styles.expandIconRotated : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>

              {isSkillExpanded && (
                <div className={styles.expandedContent}>
                  <div className={styles.radarChartContainer}>
                    <PentagonChart
                      skills={displayData.skills}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    maxWidth: '364px',
                    gap: '0',
                    position: 'relative',
                    margin: '32px auto 0',
                  }}>
                    <FeedbackCard
                      type="positive"
                      title="이런 점이 좋아요👍"
                      items={displayData.feedback.positive}
                    />

                    {/* 가운데 점선 구분선 */}
                    <div style={{
                      position: 'absolute',
                      top: '11px',
                      left: '50%',
                      width: '1px',
                      height: '52px',
                      borderLeft: '1px dashed #D1CCCB',
                      zIndex: 10,
                    }} />

                    <FeedbackCard
                      type="negative"
                      title="이런 점은 개선이 필요해요🚨"
                      items={displayData.feedback.negative}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 나의 프로젝트 */}
        <div className={styles.projectSection}>
          <div className={styles.sectionTitle}>나의 프로젝트</div>
          {hasNoProjects ? (
            <div
              className={styles.emptyProjectCard}
              onClick={handleAddProject}
            >
              <span className={styles.emptyProjectIcon}>+</span>
              <span className={styles.emptyProjectText}>프로젝트 등록하기</span>
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {displayData.projects.map((project, index) => (
                <div
                  key={project.id || `project-${index}`}
                  className={styles.projectCard}
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <img
                    src={project.thumbnail || defaultProfileImage}
                    alt={project.title}
                    className={styles.projectThumbnail}
                  />
                  <div className={styles.projectTitle}>{project.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
