
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import './main.scss';
import BottomNav from '../Common/BottomNav/BottomNav';

import bellIcon from '../../assets/icons/bell.png';
import schoolIcon from '../../assets/icons/school.png';
import mascotImg from '../../assets/icons/project_empty.png';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../services/user';
import { getSummary } from '../../services/dashboard';

const MainPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [meRes, sumRes] = await Promise.all([getMe().catch(e => { throw e; }), getSummary().catch(e => { throw e; })]);
        if (!mounted) return;
        if (meRes && meRes.success && meRes.user) setUser(meRes.user);
        if (sumRes && sumRes.success) setSummary(sumRes.data || sumRes.summary || null);
      } catch (e) {
        // 401/403은 전역 AuthEventBridge/ToastHost에서 처리하므로 여기서는 중복 네비게이션을 하지 않음
        setError('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [navigate]);

  const ongoingCount = summary?.projects?.ongoing ?? 'N';
  const unreadCount = summary?.notifications?.unread ?? '0';

  return (
    <div className="main-page">
      <div className="top-card">
        <header className="header">
          <h1 className="logo">Teamitaka</h1>
          <button
            className="icon-btn"
            aria-label="알림"
            onClick={() => navigate('/notifications')}
          >
            <img src={bellIcon} alt="알림" className="alarm-icon" />
            {unreadCount !== '0' && (
              <span className="badge" aria-label={`안 읽은 알림 ${unreadCount}건`}>{unreadCount}</span>
            )}
          </button>
        </header>


        {/* 프로필 카드 */}
        <section className="profile-card" aria-label="프로필 요약">
          <div className="profile-left">
            <div className="profile-img" aria-hidden>🧍</div>
          </div>

          {/* 왼쪽: 텍스트 정보 */}
          <div className="profile-middle">
            <div className="name">
              {isLoading && <span>불러오는 중...</span>}
              {!isLoading && user && (
                <>사용자명 <span className="emph">{user.username || user.email}</span>님</>
              )}
              {!isLoading && !user && !error && <span>사용자 정보를 불러올 수 없습니다.</span>}
            </div>

            <div className="school">
              <img src={schoolIcon} alt="" className="school-icon" />
              {user?.university && user?.major
                ? `${user.university} ${user.major} 재학 중`
                : '학과 정보가 없습니다'}
            </div>

            <div className="stats">
<span className="stats-strong">현재 진행중인 프로젝트</span>{' '}
<span className="count">총 {ongoingCount}건</span>
<span className="divider" aria-hidden="true"></span>
              <br />
              협업 경험 <span className="muted">00회</span>
            </div>

            <div className="tags">
              <span className="tag pill">키워드1</span>
              <span className="tag pill">키워드2</span>
            </div>

            {error && (
              <div style={{ marginTop: '8px', color: '#F76241', fontSize: '12px' }}>
                {error} <button onClick={() => window.location.reload()}>다시 시도</button>
              </div>
            )}
          </div>
        </section>
      </div>

      <h2 className="section-title">내가 참여 중인 프로젝트</h2>
      <section className="my-projects">
        <div className="empty-card" role="status" aria-live="polite">
          <img src={mascotImg} alt="" className="empty-img" />
          <p className="empty-text">
            진행 중인 프로젝트가 없어요.
            <br />
            지금 바로 프로젝트를 시작해보세요!
          </p>
          <button className="primary-btn" type="button">
            팀 프로젝트 시작하기
          </button>
        </div>
      </section>

      {/* ===== 프로젝트 지원하기 버튼 ===== */}
      <div className="support-btn-wrap">
        <button
          className="support-btn"
          type="button"
          onClick={() => navigate("/apply2")}
        >
          프로젝트 지원하기
        </button>
      </div>

      <div className="bottom-spacer" />
      <BottomNav />
    </div>
  );
};

export default MainPage;
