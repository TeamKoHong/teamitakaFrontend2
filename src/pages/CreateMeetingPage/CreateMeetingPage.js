import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import "./CreateMeetingPage.scss";

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

  const getCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return {
      month: `${month}월`,
      day: `${day}일`,
      fullDate: today.toISOString().split('T')[0]
    };
  };

  const handleNext = () => {
    if (isFormValid) {
      const currentDate = getCurrentDate();
      const newMeeting = {
        id: Date.now(), // 임시 ID 생성
        title: formData.title,
        author: "작성자 닉네임", // 실제로는 현재 사용자 정보
        description: formData.description,
        createdAt: currentDate.fullDate
      };

      // 로컬 스토리지에 새 회의록 저장
      const existingMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
      const updatedMeetings = [...existingMeetings, newMeeting];
      localStorage.setItem('meetings', JSON.stringify(updatedMeetings));

      // 회의록 목록 페이지로 이동
      navigate(`/project/${projectId}/proceedings`);
    }
  };

  return (
    <div className="create-meeting-page-container">
      <DefaultHeader 
        title="팀 회의록 작성하기" 
        showChat={false} 
        backPath={`/project/${projectId}/proceedings`} 
      />
      
      <div className="create-meeting-content">
        <div className="form-section">
          <div className="create-input-group">
            <label className="input-label">회의 제목</label>
            <input
              type="text"
              className="form-input"
              placeholder="내용을 입력하세요."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div className="create-input-group">
            <label className="input-label">회의 설명</label>
            <textarea
              className="form-textarea"
              placeholder="내용을 입력하세요."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <button 
          className={`next-button ${isFormValid ? 'active' : 'disabled'}`}
          onClick={handleNext}
          disabled={!isFormValid}
        >
          다음
        </button>
      </div>
    </div>
  );
}
