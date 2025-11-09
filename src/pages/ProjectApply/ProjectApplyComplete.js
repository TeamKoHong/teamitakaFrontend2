import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProjectApply.scss";

// 아이콘
import doneIcon from "../../assets/done.png";
import closeIcon from "../../assets/close.png";
// import warningIcon from "../../assets/warning.png"; // 사용 안 함 (SCSS로 원형 배지 생성)

export default function ProjectApplyComplete() {
  const nav = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 1500);
    return () => clearTimeout(t);
  }, [showToast]);

  const confirmCancel = () => {
    setShowModal(false);
    // TODO: 취소 API 호출
    setShowToast(true);
  };

  return (
    <div className={`apply-page apply-complete ${showModal ? "modal-open" : ""}`}>
      {/* 상단바 */}
      <div className="topbar">
        <div className="title">지원완료</div>
        <button
          className="icon-btn"
          type="button"
          aria-label="닫기"
          onClick={() => nav("/")}
        >
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>
      </div>

      {/* 본문 */}
      <div className="container">
        <div className="applied-card">
          <div className="thumb" />
          <div className="texts">
            <div className="t1">지원한 프로젝트 제목</div>
            <div className="t2">프로젝트 설명</div>
          </div>
        </div>

        <div className="center-wrap">
          <div className="center-done">
            <img src={doneIcon} alt="지원 완료" />
            <div className="done-text">이력서를 안전하게 전달했어요!</div>
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="footer footer--gray">
        <button className="cancel-link" onClick={() => setShowModal(true)}>
          지원을 취소할래요
        </button>
        <button className="cta active" onClick={() => nav("/apply2/history")}>
          지원 내역 확인하기
        </button>
      </div>

      {/* 취소 확인 모달 — 클래스명 SCSS와 정합 */}
      {showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body">
              <span className="warn-badge" aria-hidden>!</span>
              <p className="modal-title">지원을 취소하시겠어요?</p>
            </div>

            <div className="modal-actions-row">
              <button className="bar-btn cancel" onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className="bar-btn danger" onClick={confirmCancel}>
                지원 취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 취소 완료 토스트 */}
      {showToast && (
        <div className="toast" role="status" aria-live="polite">
          <div className="toast-box">
            <div className="ok-icon" aria-hidden="true" />
            <div className="toast-text">지원이 취소되었습니다.</div>
          </div>
        </div>
      )}
    </div>
  );
}
