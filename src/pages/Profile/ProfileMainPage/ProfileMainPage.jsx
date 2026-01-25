import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../services/user';
import { getProfileDetail } from '../../../services/profile';
import BottomNav from '../../../components/Common/BottomNav/BottomNav';
import PentagonChart from '../../../components/Common/UI/PentagonChart';
import ProfileImageEdit from '../../../components/ProfileImage';
import styles from './ProfileMainPage.module.scss';

// Assets
import backIcon from '../../../assets/back.png';
import settingIcon from '../../../assets/setting.png'; 
import profileDefault from '../../../assets/profile_default.png';
import defaultProfileImage from '../../../images/profileImage.png';
import verificationBadge from '../../../assets/대학_인증_완료.svg';
import projectEmpty from '../../../assets/icons/project_empty.png';
import 비회원배너 from '../../../assets/character_banner/비회원 캐릭터 배너_테스트유도용.png';

// Character Banners
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

const CHARACTER_IMAGES = {
  '활동티미': 활동티미, '긍정티미': 긍정티미, '분석티미': 분석티미, '감각티미': 감각티미,
  '실험티미': 실험티미, '안정티미': 안정티미, '완벽티미': 완벽티미, '융합티미': 융합티미,
  '적응티미': 적응티미, '조율티미': 조율티미, '창의티미': 창의티미, '통찰티미': 통찰티미,
};

const SettingsIcon = () => (
  <img src={settingIcon} alt="설정" style={{ width: '24px', height: '24px', objectFit: 'contain', display: 'block' }} />
);

const GraduationCapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L1 7L10 12L19 7L10 2Z" stroke="#807C7C" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 9V14C4 14 6 17 10 17C14 17 16 14 16 14V9" stroke="#807C7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FeedbackCard = ({ type, title, items = [] }) => {
  const isPositive = type === 'positive';
  const displayItems = items.length > 0 ? items : ['피드백이 없습니다'];
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: '72px', padding: '12px', borderRadius: '10px', backgroundColor: isPositive ? '#FFFDFC' : '#F76241', boxSizing: 'border-box' }}>
      <div style={{ fontFamily: 'Pretendard', fontSize: '11px', fontWeight: 600, color: isPositive ? '#000' : '#fff', marginBottom: '6px' }}>{title}</div>
      <div style={{ color: isPositive ? '#444' : '#efefef', fontSize: '10px', lineHeight: '165.04%' }}>
        {displayItems.map((item, index) => <div key={index} style={{ marginBottom: '2px' }}>• {item}</div>)}
      </div>
    </div>
  );
};

const BUBBLE_STYLES = [
  { size: 123, bg: '#F76241', textColor: '#FFFDFC', top: 0, left: 114, zIndex: 5 },
  { size: 107, bg: '#FF9780', textColor: '#FFFDFC', top: 18, left: 0, zIndex: 4 },
  { size: 94, bg: '#FFC5B8', textColor: '#FFFDFC', top: 84, left: 60, zIndex: 3 },
  { size: 65, bg: '#D1CCCB', textColor: '#FFFDFC', top: 54, left: 232, zIndex: 2 },
  { size: 54, bg: '#ECECEC', textColor: '#D1CCCB', top: 104, left: 210, zIndex: 1 },
];

const DEFAULT_SKILLS = { 노력: 80, 업무능력: 75, 소통: 85, 성장: 90, 의지: 70 };

const SkillBubbleChart = ({ skills }) => {
  const skillData = skills && Object.keys(skills).length > 0 ? skills : DEFAULT_SKILLS;
  const sortedSkills = Object.entries(skillData).sort(([, a], [, b]) => b - a);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '296px', height: '177px', margin: '0 auto' }}>
      {sortedSkills.map(([skillName, skillValue], index) => {
        const style = BUBBLE_STYLES[index];
        if (!style) return null;
        const nameFontSize = style.size >= 100 ? '16.79px' : style.size >= 80 ? '14px' : '12px';
        return (
          <div key={skillName} style={{ position: 'absolute', top: style.top, left: style.left, width: style.size, height: style.size, borderRadius: '50%', backgroundColor: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: style.zIndex }}>
            <span style={{ fontSize: nameFontSize, fontWeight: 800, color: style.textColor, fontFamily: 'Pretendard' }}>{skillName}</span>
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
  const [currentImg, setCurrentImg] = useState(profileDefault);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const userRes = await getMe();
        if (userRes?.success && userRes.user) {
          setUserData(userRes.user);
          setCurrentImg(userRes.user.profileImage || profileDefault);
        }
        const profileRes = await getProfileDetail();
        if (profileRes?.success) setProfileData(profileRes.data);
      } catch (err) {
        if (err?.code === 'UNAUTHORIZED') navigate('/login', { replace: true });
        else setError(err.message || '데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleImageChange = (file) => {
    if (!file) { setCurrentImg(profileDefault); return; }
    const reader = new FileReader();
    reader.onload = () => setCurrentImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSettingsClick = () => navigate('/profile/edit');
  const handleVerificationClick = () => navigate('/profile/verification');
  const handleAddProject = () => navigate('/project/create');

  const localMbtiType = localStorage.getItem('user_mbti_type');
  const displayData = {
    profileImage: currentImg,
    username: userData?.username || '사용자',
    university: userData?.university || '대학교 미인증',
    department: userData?.major || userData?.department || '',
    enrollmentStatus: userData?.enrollmentStatus || '재학 중',
    currentProjects: profileData?.totalProjects || profileData?.currentProjects || 0,
    totalTeamExperience: userData?.teamExperience || profileData?.totalTeamExperience || 0,
    tags: userData?.keywords || profileData?.tags || [],
    isVerified: !!userData?.university,
    activityType: { type: userData?.mbti_type || localMbtiType || profileData?.activityType?.type || null },
    skills: profileData?.skills || null,
    feedback: { positive: profileData?.feedback?.positive || [], negative: profileData?.feedback?.negative || [] },
    projects: profileData?.projects || [],
    totalProjects: profileData?.totalProjects || 0,
  };

  const isProfileEmpty = !userData?.university && !userData?.major && (!userData?.keywords || userData.keywords.length === 0);
  const hasNoTeamiType = !displayData.activityType?.type;
  const hasNoProjects = displayData.totalProjects === 0 && (!displayData.projects || displayData.projects.length === 0);
  const hasNoEvaluations = displayData.totalProjects === 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>프로필</span>
        <button className={styles.settingsButton} onClick={handleSettingsClick}><SettingsIcon /></button>
      </div>

      <div className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.profileImageWrapper}>
            <ProfileImageEdit src={displayData.profileImage} onChange={handleImageChange} />
            {displayData.isVerified && <img src={verificationBadge} alt="인증" className={styles.verificationBadge} onClick={handleVerificationClick} />}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>
              {isProfileEmpty ? (
                '프로필을 입력하세요.'

              ) : (
                <>
                  <span className={styles.nameBold}>{displayData.username}</span>
                  <span className={styles.nameRegular}>&nbsp;티미님</span>
                </>
              )}
            </div>            
            <div className={styles.profileUniversity}>
              <GraduationCapIcon />
              <span>{isProfileEmpty ? '대학교명 재학 중' : `${displayData.university} ${displayData.department} ${displayData.enrollmentStatus}`}</span>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.statHighlight}>
                {isProfileEmpty ? '현재 진행중인 프로젝트가 없어요.' : <>현재 진행중인 프로젝트 <span className={styles.statOrange}>총 {displayData.currentProjects}건</span></>}
              </div>
              <div className={styles.statNormal}>{isProfileEmpty ? '팀플 경험이 없어요.' : `전체 팀플 경험 ${displayData.totalTeamExperience}회`}</div>
            </div>
            {!isProfileEmpty && displayData.tags.length > 0 && (
              <div className={styles.profileTags}>{displayData.tags.map((tag, i) => <span key={i} className={styles.tag}>{tag}</span>)}</div>
            )}
          </div>
        </div>

        <div 
          className={styles.activityCard} 
          onClick={() => navigate(hasNoTeamiType ? '/type-test' : `/type-test/result/${displayData.activityType.type}`)} 
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={(!hasNoTeamiType && CHARACTER_IMAGES[displayData.activityType.type]) || 비회원배너} 
            alt="활동타입" 
          />
        </div>

        <div className={styles.profileIntro}>
          {isProfileEmpty ? (
            <>프로필을 작성하고 <br/>
            <span className={styles.profileIntroHighlight}>
              내 팀플 분석</span>을 완성해보세요!</>
          ) : (
            <>지난 활동을 돌아보고, <br/>
            <span className={styles.profileIntroHighlight}>
              더 나은 팀원</span>이 되어가요.</>
          )}
        </div>

        <div className={styles.skillSection}>
          <div className={styles.skillHeader}>
            <span className={styles.skillTitle}>
              팀플 능력치 분석 
              </span>
            <span className={styles.skillProjectCount}>
              {hasNoEvaluations ? '프로젝트 종합 결과가 없어요.' 
              : `${displayData.totalProjects}회 프로젝트 종합결과`}
              </span>
          </div>
          {hasNoEvaluations ? (
            <div className={styles.emptySkillContainer}>
              <img src={projectEmpty} alt="데이터 없음" className={styles.emptyIllustration} />
              <p className={styles.emptyText}>프로젝트 정보가 없어요.</p>
            </div>
          ) : (
            <>
              <div className={styles.bubbleChartContainer}><SkillBubbleChart skills={displayData.skills} /></div>
              <button className={styles.expandButton} onClick={() => setIsSkillExpanded(!isSkillExpanded)}>
                나의 능력치 분석 자세히보기
                <span className={`${styles.expandIcon} ${isSkillExpanded ? styles.expandIconRotated : ''}`}><img src={backIcon} alt="arrow" style={{ width: '16px' }} /></span>
              </button>
              {isSkillExpanded && (
                <div className={styles.expandedContent}>
                  <div className={styles.radarChartContainer}><PentagonChart skills={displayData.skills} /></div>
                  <div style={{ 
                    display: 'flex', 
                    width: '100%', 
                    maxWidth: '364px', 
                    position: 'relative', 
                    margin: '32px auto 0' }}>
                    <FeedbackCard type="positive" title="이런 점이 좋아요👍" items={displayData.feedback.positive} />
                    <div style={{ 
                      position: 'absolute', 
                      top: '11px', 
                      left: '50%', 
                      width: '1px', 
                      height: '52px', 
                      borderLeft: '1px dashed #D1CCCB' }} />
                    <FeedbackCard 
                    type="negative" 
                    title="이런 점은 개선이 필요해요🚨" 
                    items={displayData.feedback.negative} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.projectSection}>
          <div className={styles.sectionTitle}>나의 프로젝트</div>
          {hasNoProjects ? (
            <div className={styles.emptyProjectCard} onClick={handleAddProject}>
              <span className={styles.emptyProjectIcon}>+</span>
              <span className={styles.emptyProjectText}>프로젝트 등록하기</span>
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {displayData.projects.map((p, i) => (
                <div key={p.id || i} className={styles.projectCard} onClick={() => navigate(`/project/${p.id}`)}>
                  <img src={p.thumbnail || defaultProfileImage} alt={p.title} className={styles.projectThumbnail} />
                  <div className={styles.projectTitle}>{p.title}</div>
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