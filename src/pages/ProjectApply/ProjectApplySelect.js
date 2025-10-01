// src/Pages/ProjectApply/ProjectApplySelect.js
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectApply.scss";

// ✅ 아이콘 추가
import selectIcon from "../../assets/select.png";

export default function ProjectApplySelect() {
  const nav = useNavigate();

  const projects = useMemo(() => ([
    { id: 1, title: "프로젝트 제목", thumb: null },
    { id: 2, title: "프로젝트 제목", thumb: null },
    { id: 3, title: "프로젝트 제목", thumb: null },
    { id: 4, title: "프로젝트 제목", thumb: null },
    { id: 5, title: "프로젝트 제목", thumb: null },
    { id: 6, title: "프로젝트 제목", thumb: null },
  ]), []);

  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    nav('/apply2/complete', { state: { selected: [...selected] } });
  };

  return (
    <div className="apply-page apply-select">
      <div className="topbar">
        <button className="link" onClick={() => nav(-1)}>취소</button>
        <div className="title">보여줄 프로젝트</div>
        <div className="spacer" />
      </div>

      <div className="container">
        <div className="section">
          <div className="eyebrow">보여줄 프로젝트</div>
          <h1 className="headline">
            나를 어필할 수 있는<br />프로젝트가 있다면 선택해주세요.
          </h1>
          <p className="sub">선택한 프로젝트는 팀장이 열람할 수 있어요.</p>

          <hr className="divider" />

          <div className="list-title">나의 프로젝트</div>

          <div className="grid">
            {projects.map(p => {
              const isOn = selected.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`card ${isOn ? "on" : ""}`}
                  onClick={() => toggle(p.id)}
                >
                  <div className="thumb">
                    <div className="thumb-placeholder">
                      <span className="img-icon" aria-hidden />
                    </div>
                  </div>
                  <div className="title">{p.title}</div>

                  {/* ✅ 중앙 아이콘 */}
                  {isOn && (
                    <div className="center-icon">
                      <img src={selectIcon} alt="선택됨" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer footer--gray">
        <button
          className={`cta ${selected.size > 0 ? "active" : "disabled"}`}
          disabled={selected.size === 0}
          onClick={handleSubmit}
        >
          지원서 보내기
        </button>
      </div>
    </div>
  );
}
