import React, { useState } from "react";
import DefaultHeader from "../../components/Common/DefaultHeader";
import Calendar from "../../components/ProjectCalendar/Calendar";
import "./ProjectCalendar.scss";
import AddFloatingButton from "../../components/Common/UI/AddFloatingButton";

export default function ProjectCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (date) => {
    console.log("선택된 날짜:", date);
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="project-calendar-page-container">
      <DefaultHeader
        title="공유 캘린더"
        showChat={false}
        backPath="/project/1"
      />

      <div className="calendar-container">
        <Calendar 
          onDayClick={handleDayClick}
          isModalOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
        />
      </div>
      <AddFloatingButton onClick={handleAddButtonClick} />
    </div>
  );
}
