import React from "react";
import DefaultHeader from "../../components/Common/DefaultHeader";
import Calendar from "../../components/ProjectCalendar/Calendar";
import "./ProjectCalendar.scss";
import AddFloatingButton from "../../components/Common/UI/AddFloatingButton";

export default function ProjectCalendar() {
  const handleDayClick = (date) => {
    console.log("선택된 날짜:", date);
  };

  return (
    <div className="project-calendar-page-container">
      <DefaultHeader
        title="공유 캘린더"
        showChat={false}
        backPath="/project/1"
      />

      <div className="calendar-container">
        <Calendar onDayClick={handleDayClick} />
      </div>
      <AddFloatingButton />
    </div>
  );
}
