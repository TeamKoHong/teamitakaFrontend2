import React, { useState } from "react";
import { useParams } from "react-router-dom"; 
import DefaultHeader from "../../components/Common/DefaultHeader";
import Calendar from "../../components/ProjectCalendar/Calendar";
import "./ProjectCalendar.scss";
import AddFloatingButton from "../../components/Common/UI/AddFloatingButton";

export default function ProjectCalendar() {
  // 🔴 수정 1: projectId가 아니라 id로 꺼내야 합니다.
  // (App.js 라우트가 /project/:id/calendar 형태이기 때문)
  const { id } = useParams(); 
  
  // 변수명을 헷갈리지 않게 내부에서 projectId로 할당하거나 그대로 id를 씁니다.
  const projectId = id; 

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (date) => {
    console.log("선택된 날짜:", date);
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };
  
  // ✅ 이제 콘솔에 숫자가 잘 찍힐 겁니다.
  console.log("현재 페이지의 Project ID:", projectId);

  return (
    <div className="project-calendar-page-container">
      <DefaultHeader
        title="공유 캘린더"
        showChat={false}
      />

      <div className="calendar-container">
        {/* 🔴 수정 2: 위에서 꺼낸 projectId(id)를 전달 */}
        <Calendar 
          projectId={projectId}
          onDayClick={handleDayClick}
          isModalOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
        />
      </div>
      <AddFloatingButton onClick={handleAddButtonClick} />
    </div>
  );
}