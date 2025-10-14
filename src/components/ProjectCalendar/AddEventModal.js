import React, { useState } from "react";
import "./AddEventModal.scss";

export default function AddEventModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (title.trim() && description.trim()) {
      onSave({
        title: title.trim(),
        desc: description.trim(),
        author: "사용자",
        authorProfile: "/src/assets/icons/user_default_img.svg",
        createdAt: new Date().toISOString()
      });
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        
        <div className="modal-header">
          <h2>일정 추가</h2>
        </div>

        <div className="form-group">
          <label htmlFor="event-title">일정 제목</label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="내용을 입력하세요."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-description">일정 설명</label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="내용을 입력하세요."
            className="form-textarea"
            rows="3"
          />
        </div>

        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={!title.trim() || !description.trim()}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
