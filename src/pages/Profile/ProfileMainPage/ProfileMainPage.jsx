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
import verificationBadge from '../../../assets/대학_인증_완료.svg';
import 비회원배너 from '../../../assets/character_banner/비회원 캐릭터 배너_테스트유도용.png';
import skillDefaultImg from '../../../assets/skill_default.png';

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
  <img src={settingIcon} alt="설정" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
);

const GraduationCapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L1 7L10 12L19 7L10 2Z" stroke="#807C7C" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 9V14C4 14 6 17 10 17C14 16 16 14 16 14V9" stroke="#807C7C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FeedbackCard = ({ type, title, items = [] }) => {
  const isPositive = type === 'positive';
  const displayItems = items && items.length > 0 ? items : ['피드백이 없습니다'];
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: '72px', padding: '12px', borderRadius: '10px', backgroundColor: isPositive ? '#FFFDFC' : '#F76241' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: isPositive ? '#000' : '#fff', marginBottom: '6px' }}>{title}</div>
      <div style={{ color: isPositive ? '#444' : '#efefef', fontSize: '11px', lineHeight: '1.6' }}>
        {displayItems.map((item, index) => <div key={index}>• {item}</div>)}
      </div>
    </div>
  );
};

const SkillBubbleChart = ({ skills }) => {
  if (!skills) return null;
  const sortedSkills = Object.entries(skills).sort(([, a], [, b]) => b - a);
  const BUBBLE_STYLES = [
    { size: 123, bg: '#F76241', textColor: '#FFFDFC', top: 0, left: 114, zIndex: 5 },
    { size: 107, bg: '#FF9780', textColor: '#FFFDFC', top: 18, left: 0, zIndex: 4 },
    { size: 94, bg: '#FFC5B8', textColor: '#FFFDFC', top: 84, left: 60, zIndex: 3 },
    { size: 65, bg: '#D1CCCB', textColor: '#FFFDFC', top: 54, left: 232, zIndex: 2 },
    { size: 54, bg: '#ECECEC', textColor: '#D1CCCB', top: 104, left: 210, zIndex: 1 },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '296px', height: '177px', margin: '0 auto' }}>
      {sortedSkills.map(([name, val], i) => {
        const style = BUBBLE_STYLES[i];
        if (!style) return null;
        return (
          <div key={name} style={{ position: 'absolute', top: style.top, left: style.left, width: style.size, height: style.size, borderRadius: '50%', backgroundColor: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: style.zIndex }}>
            <span style={{ fontSize: style.size >= 100 ? '16px' : '12px', fontWeight: 800, color: style.textColor }}>{name}</span>
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
  const [summaryData, setSummaryData] = useState({ strengths: [], improvements: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSkillExpanded, setIsSkillExpanded] = useState(false);
  const [registeredProjectIds, setRegisteredProjectIds] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [userRes, profileRes] = await Promise.all([getMe(), getProfileDetail()]);
        
        if (userRes?.success) setUserData(userRes.user);
        if (profileRes?.success) setProfileData(profileRes.data);

        const cached = localStorage.getItem('cached_evaluation_summary');
        if (cached) {
          const parsed = JSON.parse(cached);
          setSummaryData({
            strengths: parsed.summary?.strengths || [],
            improvements: parsed.summary?.improvements || []
          });
        }

        const savedIds = JSON.parse(localStorage.getItem('registered_project_ids') || '[]');
        setRegisteredProjectIds(savedIds);

      } catch (err) {
        console.error('데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const ongoingCount = profileData?.currentProjects || 0;
  const allProjects = profileData?.projects || [];
  
  // 등록된 ID에 해당하는 프로젝트만 필터링
  const displayProjects = allProjects.filter(p => {
    const pId = p.projectId || p.id || p._id || p.project_id;
    return registeredProjectIds.includes(pId);
  });

  const skills = profileData?.skills || {};
  const hasValidSkills = skills && 
                         Object.keys(skills).length > 0 && 
                         Object.values(skills).some(value => value > 0);

  const feedbackStrengths = summaryData.strengths.length > 0 ? summaryData.strengths : (profileData?.feedback?.positive || []);
  const feedbackImprovements = summaryData.improvements.length > 0 ? summaryData.improvements : (profileData?.feedback?.negative || []);

  const mbtiType = profileData?.activityType?.type || userData?.mbti_type;

  if (isLoading) return <div className={styles.container}>데이터를 불러오는 중입니다...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>프로필</span>
        <button className={styles.settingsButton} onClick={() => navigate('/profile/edit')}><SettingsIcon /></button>
      </div>

      <div className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.profileImageWrapper}>
            <ProfileImageEdit src={userData?.profileImage || userData?.avatar || profileDefault} isEditable={false} />
            {userData?.university && (
              <img src={verificationBadge} alt="인증" className={styles.verificationBadge} onClick={() => navigate('/profile/verification')} />
            )}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>
              <span className={styles.nameBold}>{userData?.username || '사용자'}</span>
              <span className={styles.nameRegular}>&nbsp;티미님</span>
            </div>      
            <div className={styles.profileUniversity}>
              <GraduationCapIcon />
              <span>{userData?.university ? `${userData.university} ${userData.major || ''}` : '정보를 입력해주세요'}</span>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.statHighlight}>
                현재 진행중인 프로젝트 <span className={styles.statOrange}>총 {ongoingCount}건</span>
              </div>
              <div className={styles.statNormal}>{`전체 팀플 경험 ${profileData?.totalTeamExperience || 0}회`}</div>
            </div>
          </div>
        </div>

        <div className={styles.activityCard} onClick={() => navigate('/type-test', { state: { from: '/profile' } })}>
          <img src={CHARACTER_IMAGES[mbtiType] || 비회원배너} alt="배너" />
        </div>

        <div className={styles.skillSection}>
          <div className={styles.skillHeader}>
            <span className={styles.skillTitle}>팀플 능력치 분석</span>
            <span className={styles.skillProjectCount}>{allProjects.length}회 프로젝트 종합결과</span>
          </div>

          {!hasValidSkills ? (
            <div className={styles.defaultSkillWrapper}>
              <img src={skillDefaultImg} alt="아직 받은 평가가 없습니다" style={{ width: '100%' }} />
            </div>
          ) : (
            <>
              <div className={styles.bubbleChartContainer}><SkillBubbleChart skills={skills} /></div>
              <button className={styles.expandButton} onClick={() => setIsSkillExpanded(!isSkillExpanded)}>
                나의 능력치 분석 자세히보기
                <span className={`${styles.expandIcon} ${isSkillExpanded ? styles.expandIconRotated : ''}`}><img src={backIcon} alt="V" /></span>
              </button>
              {isSkillExpanded && (
                <div className={styles.expandedContent}>
                  <div className={styles.radarChartContainer}><PentagonChart skills={skills} /></div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <FeedbackCard type="positive" title="이런 점이 좋아요👍" items={feedbackStrengths} />
                    <FeedbackCard type="negative" title="개선이 필요해요🚨" items={feedbackImprovements} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.projectSection}>
          <div className={styles.sectionTitle}>나의 프로젝트</div>
          {displayProjects.length === 0 ? (
            <div className={styles.emptyProjectCard} onClick={() => navigate('/profile/register-project')}>
              <span className={styles.plusIcon}>+</span>
              <span className={styles.emptyProjectText}>프로젝트 등록하기</span>
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {displayProjects.map((p, i) => {
                const targetId = p.projectId || p.id || p._id || p.project_id;
                const cleanTitle = (p.title || "").replace("[상호평가 완료]", "").trim();

                return (
                    <div 
                      key={targetId || i} 
                      className={styles.projectCard} 
                      onClick={() => {
                        if (targetId) {
                          // 🔥 대시보드가 아닌 '프로필용 별점 페이지'로 이동하도록 경로 수정 완료!
                          navigate(`/profile/project/${targetId}`);
                        } else {
                          console.warn("프로젝트 ID가 없습니다.");
                        }
                      }}
                    >
                      <img src={p.thumbnail || p.photo_url || profileDefault} alt="썸네일" className={styles.projectThumbnail} />
                      <div className={styles.projectTitle}>{cleanTitle}</div>
                    </div>
                );
              })}
              
               <div 
                 className={styles.emptyProjectCard} 
                 style={{height: 'auto', minHeight: '100px'}} 
                 onClick={() => navigate('/profile/register-project')}
               >
                  <span className={styles.plusIcon}>+</span>
                  <span 
                    className={styles.emptyProjectText} 
                    style={{ fontSize: '12px' }}
                  >
                    프로젝트 등록하기
                  </span>
               </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}