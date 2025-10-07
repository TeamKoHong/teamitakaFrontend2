import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectRecruitPreview.scss';
import { loadRecruitDraft } from '../../../api/recruit';

// 아이콘
import viewIcon from '../../../assets/view.png';
import applyIcon from '../../../assets/apply.png';

export default function ProjectRecruitPreview() {
  const nav = useNavigate();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(loadRecruitDraft() || {});
  }, []);

  // 안전한 값(없으면 디폴트)
  const title   = draft?.basic?.title || '팀프로젝트 제목';
  const period  = draft?.basic?.periodText || '연결 예정';
  const info    = draft?.basic?.info || '연결 예정';
  const type    = draft?.basic?.typeText || draft?.basic?.type || '연결 예정';
  const detail  = draft?.detail || '';

  // 메타(조회/지원/시간)
  const views       = draft?.metrics?.views ?? 0;
  const applicants  = draft?.metrics?.applicants ?? 0;
  const timeText    = draft?.basic?.timeText || '방금 전';

  const tags = Array.isArray(draft?.keywords) && draft.keywords.length > 0
    ? draft.keywords
    : ['#연결예정'];

  return (
    <div className="page preview-page">
      {/* 상단바 유지 */}
      <div className="topbar">
        <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <div className="title">미리보기</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="container">
        {/* 대표 이미지(있을 때만 노출) */}
        {draft?.coverImage?.dataUrl && (
          <div className="cover">
            <img src={draft.coverImage.dataUrl} alt="대표 이미지" />
          </div>
        )}

        {/* 제목 */}
        <h1 className="post-title">{title}</h1>

        {/* 조회/지원 + 시간 (좌/우 정렬) */}
        <div className="meta">
          <div className="left">
            <span className="meta-item">
              <img src={viewIcon} alt="조회수" />
              <span className="num">{views}</span>
            </span>
            <span className="meta-item">
              <img src={applyIcon} alt="지원자 수" />
              <span className="num">{applicants}</span>
            </span>
          </div>
          <div className="right">{timeText}</div>
        </div>

        {/* 라벨/값 (박스 제거, 좌라벨/우값) */}
        <div className="kv">
          <div className="row">
            <span className="k">모집 기간</span>
            <span className="v">{period}</span>
          </div>
          <div className="row">
            <span className="k">프로젝트 정보</span>
            <span className="v">{info}</span>
          </div>
          <div className="row">
            <span className="k">프로젝트 유형</span>
            <span className="v">{type}</span>
          </div>
        </div>

        {/* 회색 라인 */}
        <hr className="divider" />

        {/* 상세 설명 */}
        <div className="detail">
          <div className="detail-label">(400자 예시입니다.)</div>
          <pre className="detail-body">
{(detail && String(detail)) || `상세 내용이 아직 없습니다.
입력한 내용이 이 영역에 그대로 표시됩니다.`}
          </pre>
        </div>

        {/* 키워드 */}
        <div className="keywords">
          <div className="label">키워드</div>
          <div className="chips">
            {tags.map((t, i) => (
              <span className="chip chip-orange" key={t + i}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 CTA → 업로드 진행 페이지로 이동 */}
      <div className="footer">
        <button
          className="submit-btn"
          type="button"
          onClick={() =>
            nav("/recruit/publish", { state: { redirectTo: "/recruit" } })
          }
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
