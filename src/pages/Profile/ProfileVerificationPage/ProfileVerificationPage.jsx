import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../services/user';
import { getVerificationInfo } from '../../../services/profile';
import styles from './ProfileVerificationPage.module.scss';

// 아이콘 컴포넌트
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="3">
    <polyline points="6 16 12 22 26 8" />
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
  const [error, setError] = useState(null);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // 사용자 정보 로드
        const userRes = await getMe();
        if (userRes?.success && userRes.user) {
          setUserData(userRes.user);
        }

        // 인증 정보 로드
        const verifyRes = await getVerificationInfo();
        if (verifyRes?.success) {
          setVerificationData(verifyRes.data);
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

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <BackIcon />
          </button>
          <span className={styles.headerTitle}>대학 인증 내역</span>
        </div>
        <div className={styles.loadingContainer}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <BackIcon />
          </button>
          <span className={styles.headerTitle}>대학 인증 내역</span>
        </div>
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 인증 여부 확인
  const isVerified = verificationData?.isVerified || !!userData?.university;

  // 표시 데이터
  const displayData = {
    university: verificationData?.university || userData?.university || '',
    department: verificationData?.department || userData?.department || '',
    username: verificationData?.username || userData?.username || '',
    verifiedAt: verificationData?.verifiedAt || '',
    status: verificationData?.status || (isVerified ? '인증 완료' : '미인증'),
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

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
            {/* 인증 상태 */}
            <div className={styles.verificationStatus}>
              <div className={styles.verificationBadge}>
                <CheckIcon />
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
                  {/* 대학 로고 - 추후 API에서 제공 */}
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

              {displayData.verifiedAt && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>인증 날짜</span>
                  <span className={styles.infoValue}>{formatDate(displayData.verifiedAt)}</span>
                </div>
              )}

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>인증 상태</span>
                <span className={`${styles.statusBadge} ${styles.verified}`}>
                  ✓ {displayData.status}
                </span>
              </div>
            </div>
          </>
        ) : (
          /* 미인증 상태 */
          <div className={styles.notVerified}>
            <ShieldIcon />
            <div className={styles.notVerifiedTitle}>대학 인증이 필요합니다</div>
            <div className={styles.notVerifiedDescription}>
              대학 이메일로 인증하면<br />
              다른 사용자들에게 신뢰성을 높일 수 있어요.
            </div>
            <button className={styles.verifyButton}>
              대학 인증하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
