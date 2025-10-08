// src/Pages/ProjectRecruit/ProjectRecruit.js
import { useEffect, useMemo, useState } from 'react';
import './ProjectRecruit.scss';
import { loadRecruitDraft, saveRecruitDraft } from '../../../api/recruit';

export default function ProjectRecruit() {
  const [title, setTitle] = useState('');
  const [desc, setDesc]   = useState('');
  const [type, setType]   = useState(null);  // 'course' | 'side'
  const [start, setStart] = useState('');
  const [end, setEnd]     = useState('');

  useEffect(() => {
    const draft = loadRecruitDraft();
    if (draft) {
      setTitle(draft.title || '');
      setDesc(draft.desc || '');
      setType(draft.type || null);
      setStart(draft.start || '');
      setEnd(draft.end || '');
    }
  }, []);

  const isValidRange = useMemo(() => {
    if (!start || !end) return false;
    return new Date(start) <= new Date(end);
  }, [start, end]);

  const isReady = Boolean(title.trim()) && Boolean(type) && isValidRange;

  const handleSaveDraft = () => {
    saveRecruitDraft({ title, desc, type, start, end });
    alert('임시 저장되었어요.');
  };

  const handleLoadDraft = () => {
    const d = loadRecruitDraft();
    if (!d) return alert('불러올 내용이 없어요.');
    setTitle(d.title || '');
    setDesc(d.desc || '');
    setType(d.type || null);
    setStart(d.start || '');
    setEnd(d.end || '');
  };

  return (
    <div className="page recruit-page">
      {/* 상단바 */}
      <div className="topbar">
        <button className="back" onClick={() => window.history.back()} aria-label="뒤로">
          <span className="chevron" aria-hidden="true"></span>
        </button>
        <button className="save-text" onClick={handleSaveDraft}>임시 저장</button>
      </div>

      {/* 본문 */}
      <div className="container">
        <h2 className="h2">어떤 모집글인가요?</h2>

        {/* 제목 */}
        <div className="label">제목</div>
        <div className={`field ${title ? 'field--active' : ''}`}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 15))}
            placeholder="제목을 입력해주세요."
            maxLength={15}
          />
        </div>
        {!title.trim() && <div className="error">제목을 입력해주세요.</div>}

        {/* 프로젝트 정보 */}
        <div className="label">프로젝트 정보</div>
        <div className={`field ${desc ? 'field--active' : ''}`}>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value.slice(0, 20))}
            placeholder="수업 프로젝트라면 강의 정보를 작성해주세요."
            rows={3}
          />
        </div>

        {/* 프로젝트 타입 */}
        <div className="radio-row">
          <label className={`radio ${type === 'course' ? 'on' : ''}`}>
            <input type="radio" name="ptype" checked={type === 'course'} onChange={() => setType('course')} />
            <span className="dot" /> 수업 프로젝트
          </label>
          <label className={`radio ${type === 'side' ? 'on' : ''}`}>
            <input type="radio" name="ptype" checked={type === 'side'} onChange={() => setType('side')} />
            <span className="dot" /> 사이드 프로젝트
          </label>
        </div>
        {!type && <div className="error">프로젝트 타입을 선택해주세요.</div>}

        {/* 모집 기간 */}
        <div className="label">모집 기간</div>
        <div className={`field ${start && end ? 'field--active' : ''}`}>
          <div className="date-row">
            <input type="date" value={start} onChange={(e)=>setStart(e.target.value)} />
            <span className="dash">-</span>
            <input type="date" value={end} onChange={(e)=>setEnd(e.target.value)} />
          </div>
        </div>
        {(!start || !end) && <div className="error">모집 기간을 선택해주세요.</div>}
        {(start && end && !isValidRange) && <div className="error">종료일이 시작일보다 빠를 수 없어요.</div>}
      </div>

      {/* 하단 */}
      <div className="footer">
        <button className="link" type="button" onClick={handleLoadDraft}>
          임시 저장 글 불러오기
        </button>
        <button
          className={`next-btn ${isReady ? 'on' : 'off'}`}
          disabled={!isReady}
          onClick={() => window.location.assign('/recruit/detail')}
        >
          다음
        </button>
      </div>
    </div>
  );
}
