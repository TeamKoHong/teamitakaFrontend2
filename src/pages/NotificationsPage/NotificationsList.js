// 알람이 있을 때 뜨는 페이지
import { useNavigate } from 'react-router-dom';

export default function NotificationsList({ items }) {
  const nav = useNavigate();

  // 간단한 날짜 레이블 (오늘/어제/이전)
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);

  const sections = [
    { label: '오늘',     filter: d => d >= +today },
    { label: '어제',     filter: d => d >= +yesterday && d < +today },
    { label: '이전',     filter: d => d < +yesterday },
  ];

  return (
    <div className="page notifications-page">
      <div className="topbar">
        <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <div className="title">알림</div>
        <div className="settings-text" onClick={() => nav('/notifications/settings')}>설정</div>
      </div>

      <div style={{ padding: '8px 20px' }}>
        {sections.map(sec => {
          const rows = items.filter(it => sec.filter(+new Date(it.createdAt)));
          if (rows.length === 0) return null;
          return (
            <div key={sec.label} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight:600, color:'#111', margin:'12px 0' }}>{sec.label}</div>
              {rows.map(it => (
                <div key={it.id} style={{ padding:'12px 0', borderBottom:'1px solid #eee' }}>
                  <div style={{ fontSize:12, color:'#999', marginBottom:4 }}>알림 종류</div>
                  <div style={{ fontSize:14, color:'#111' }}>{it.title}</div>
                  {it.body && <div style={{ fontSize:13, color:'#555', marginTop:4 }}>{it.body}</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
