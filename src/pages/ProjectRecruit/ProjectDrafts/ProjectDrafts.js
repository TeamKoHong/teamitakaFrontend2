import { useEffect, useState } from 'react';
import './ProjectDrafts.scss';
import { loadDrafts, deleteDrafts, getDraftById } from '../../../api/recruit';

import iconInactive from '../../../assets/draft_inactive.png';
import iconActive   from '../../../assets/draft_active.png';
import iconChecked  from '../../../assets/checkbox_checked.png';

export default function RecruitDrafts() {
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setList(loadDrafts());
  }, []);

  const onSelect = (id) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const canAct = !!selectedId;

  const onLoad = () => {
    if (!canAct) return;
    // TODO: 선택된 초안 로드 동작(상세 페이지로 이동 등)
    const draft = getDraftById(selectedId);
    console.log('LOAD:', draft);
  };

  const onDelete = () => {
    if (!canAct) return;
    deleteDrafts([selectedId]);
    setList(loadDrafts());
    setSelectedId(null);
  };

  return (
    <div className="page recruit-drafts-page">
      <div className="topbar">
        <button className="back" onClick={() => window.history.back()} aria-label="뒤로">
          <span className="chevron" aria-hidden="true" />
        </button>
        <div className="title">임시저장 글 불러오기</div>
      </div>

      <div className="list-wrap">
        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-title">임시저장한 글이 없어요</div>
            <div className="empty-sub">모집할 프로젝트가 있다면 생성해서{'\n'}팀원을 구할 수 있어요</div>
          </div>
        ) : (
          list.map(item => {
            const selected = item.id === selectedId;
            return (
              <button
                type="button"
                key={item.id}
                className={`draft-card${selected ? ' selected' : ''}`}
                onClick={() => onSelect(item.id)}
              >
                {/* ✅ 왼쪽 아이콘 교체 */}
                <img
                  className="doc-icon"
                  src={selected ? iconActive : iconInactive}
                  alt=""
                  aria-hidden="true"
                />

                {/* ✅ 텍스트는 항상 왼쪽 정렬 & 같은 위치 */}
                <div className="content">
                  <div className="type">{item.type === 'course' ? '수업 프로젝트' : '사이드 프로젝트'}</div>
                  <div className="title">{item.title || '제목 없음'}</div>
                </div>

                {/* ✅ 선택 시 체크 아이콘 */}
                {selected && <img className="check-icon" src={iconChecked} alt="" aria-hidden="true" />}
              </button>
            );
          })
        )}
      </div>

      <div className="footer">
        {/* ✅ 두 버튼 모두 선택 전에는 동일한 회색 비활성 스타일 */}
        <button
          type="button"
          className="btn load"
          disabled={!canAct}
          onClick={onLoad}
        >
          불러오기
        </button>
        <button
          type="button"
          className="btn delete"
          disabled={!canAct}
          onClick={onDelete}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}
