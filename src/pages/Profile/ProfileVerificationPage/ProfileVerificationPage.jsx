import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../services/user';
import { getVerificationInfo } from '../../../services/profile';
import { PROFILE_ROUTES } from '../../../constants/routes';
import styles from './ProfileVerificationPage.module.scss';

// Assets
import verificationBadgeImg from '../../../assets/대학_인증_완료.svg';

// 아이콘 컴포넌트
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M32 8L8 18v12c0 16 24 26 24 26s24-10 24-26V18L32 8z" />
  </svg>
);

export default function ProfileVerificationPage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // API 호출: 사용자 정보와 인증 상세 정보를 동시에 가져옵니다.
        const [userRes, verifyRes] = await Promise.all([
          getMe(),
          getVerificationInfo().catch(() => ({ success: false })) 
        ]);

        if (userRes?.success) setUserData(userRes.user);
        if (verifyRes?.success) setVerificationData(verifyRes.data);
      } catch (err) {
        if (err?.code === 'UNAUTHORIZED') {
          navigate('/login', { replace: true });
          return;
        }
        setError('인증 정보를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleBack = () => navigate(-1);

  // 💡 데이터 연동 로직 강화: 여러 필드 후보군을 체크합니다.
  const university = userData?.university || verificationData?.university || userData?.schoolName || '';
  const department = userData?.major || userData?.department || verificationData?.department || '';
  const isVerified = !!university; // 학교 정보가 있으면 인증된 것으로 간주

  const displayData = {
    university,
    department,
    username: userData?.username || userData?.nickname || '사용자',
    verifiedAt: verificationData?.verifiedAt || userData?.createdAt || '',
    status: isVerified ? '인증 완료' : '미인증',
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  if (isLoading) return <div className={styles.container}><div className={styles.loading}>로딩 중...</div></div>;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <BackIcon />
        </button>
        <span className={styles.headerTitle}>대학 인증 내역</span>
      </div>

      <div className={styles.content}>
        {isVerified ? (
          <>
            {/* 인증 상태 - 💡 체크 아이콘을 뱃지 이미지로 변경 */}
            <div className={styles.verificationStatus}>
              <div className={styles.verificationBadgeImage}>
                <img src={verificationBadgeImg} alt="인증 뱃지" style={{ width: '80px', height: '80px' }} />
              </div>
              <div className={styles.verificationTitle}>대학교 인증 완료</div>
              {displayData.verifiedAt && (
                <div className={styles.verificationDate}>
                  {formatDate(displayData.verifiedAt)} 인증
                </div>
              )}
            </div>

            {/* 인증 정보 카드 */}
            <div className={styles.verificationCard}>
              <div className={styles.universityRow}>
                <div className={styles.universityLogo}>
                  <span style={{ fontSize: '24px' }}>🎓</span>
                </div>
                <div className={styles.universityInfo}>
                  <div className={styles.universityName}>{displayData.university}</div>
                  {displayData.department && (
                    <div className={styles.universityDepartment}>{displayData.department}</div>
                  )}
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>사용자명</span>
                <span className={styles.infoValue}>{displayData.username}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>인증 상태</span>
                <span className={`${styles.statusBadge} ${styles.verified}`}>
                  ✓ {displayData.status}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.notVerified}>
            <ShieldIcon />
            <div className={styles.notVerifiedTitle}>대학 인증이 필요합니다</div>
            <div className={styles.notVerifiedDescription}>
              대학 이메일로 인증하면<br />
              다른 사용자들에게 신뢰성을 높일 수 있어요.
            </div>
            <button 
              className={styles.verifyButton} 
              onClick={() => navigate(PROFILE_ROUTES.EDIT)}
            >
              대학 인증하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}