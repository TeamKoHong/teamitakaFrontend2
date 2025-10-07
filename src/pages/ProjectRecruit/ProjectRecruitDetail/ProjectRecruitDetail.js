import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProjectRecruitDetail.scss';
import {
  loadRecruitDraft,
  saveRecruitDraft,
  saveDraftToList,
  getCurrentDraftId,
} from '../../../api/recruit';

function TagInput({ value, onChange, placeholder, max = 5 }) {
  const [text, setText] = useState('');
  const isHash = (s) => /^#[^\s#]+$/.test(s);

  const addTag = (raw) => {
    const v = raw.trim();
    if (!v) return;
    if (value.includes(v) || value.length >= max) return;
    onChange([...value, v]);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag(text);
    }
  };

  const remove = (idx) => {
    const next = value.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className={`tag-input ${isHash(text) ? 'is-hash-input' : ''}`}>
      <div className="chips">
        {value.map((t, i) => (
          <span className={`chip ${isHash(t) ? 'chip-hash' : ''}`} key={t + i}>
            {t}
            <button className="x" onClick={() => remove(i)} aria-label="태그 삭제">×</button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={value.length ? '' : placeholder}
        />
      </div>
    </div>
  );
}

export default function ProjectRecruitDetail() {
  const nav = useNavigate();
  const location = useLocation();

  const [detail, setDetail] = useState('');
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    const d = loadRecruitDraft();
    if (d) {
      setDetail(d.detail || '');
      setKeywords(d.keywords || []);
    }
  }, []);

  useEffect(() => {
    const draft = location.state?.draft;
    if (draft?.data) {
      const d = draft.data;
      setDetail(d.detail || '');
      setKeywords(d.keywords || []);
    }
  }, [location.state]);

  const maxLen = 400;
  const canNext = detail.length > 0;

  const saveDraft = () => {
    const base = loadRecruitDraft() || {};
    const single = { ...base, detail, keywords };
    saveRecruitDraft(single);

    const all = { detail, keywords };
    saveDraftToList({
      id: getCurrentDraftId(),
      title: all.basic?.title || (detail.split('\n')[0] || '제목 없음'),
      type: all.basic?.type || '',
      data: all,
    });

    alert('임시 저장되었어요.');
  };

  const goNext = () => {
    if (!canNext) return;
    nav('/recruit/image');
  };

  // 임시 저장 불러오기
  const handleLoadDraft = () => nav('/recruit/drafts');

  return (
    <div className="page recruit-detail-page">
      <div className="topbar">
        <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <button className="save-text" onClick={saveDraft}>임시 저장</button>
      </div>

      <div className="container">
        <h2 className="h2">모집 내용을 상세하게{'\n'}작성해주세요</h2>

        <div className={`field ${detail ? 'field--active' : ''}`}>
          <textarea
            rows={10}
            maxLength={maxLen}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="글 작성하기 (400자 제한)"
          />
          <div className="counter">{`${detail.length}/${maxLen}`}</div>
        </div>

        <div className="label-row">
          <div className="label-bold">키워드 설정</div>
          <div className="label-desc">최대 5개 태그 설정</div>
        </div>
        <TagInput
          value={keywords}
          onChange={setKeywords}
          placeholder="해시태그 설정"
          max={5}
        />
      </div>

      {/* 푸터 안으로 이동: 불러오기 버튼 → 다음 버튼 바로 위 */}
      <div className="footer">
        <button type="button" className="link-btn link-in-footer" onClick={handleLoadDraft}>
          임시 저장 글 불러오기
        </button>

        <button
          className={`next-btn ${canNext ? 'on' : 'off'}`}
          disabled={!canNext}
          onClick={goNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}
