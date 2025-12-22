import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import "./Calendar.scss";
import userDefaultImg from "../../assets/icons/user_default_img.svg";
import AddEventModal from "./AddEventModal";
import { getApiConfig } from "../../services/auth";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Calendar({ projectId, onDayClick, isModalOpen, onCloseModal }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});

  const { API_BASE_URL } = getApiConfig();

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ 1. 일정 조회 (GET)
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!projectId) return;

      try {
        // 백엔드가 year, month 파라미터를 안 받지만, 보내도 문제는 없습니다.
        // 다만 URL은 정확해야 합니다.
        console.log(`📅 일정 조회 요청: Project ID ${projectId}`);

        const response = await axios.get(
          `${API_BASE_URL}/api/schedule/project/${projectId}`, 
          {
            headers: getAuthHeader(),
            withCredentials: true
          }
        );

        console.log("✅ 불러온 일정:", response.data);

        const newEvents = {};
        if (response.data && Array.isArray(response.data)) {
            response.data.forEach((item) => {
            const dateKey = dayjs(item.date).format("YYYY-MM-DD");
            if (!newEvents[dateKey]) newEvents[dateKey] = [];
            
            newEvents[dateKey].push({
                // 백엔드 DB 컬럼명을 추측하여 매핑 (보통 id 아니면 schedule_id)
                id: item.id || item.schedule_id, 
                title: item.title,
                desc: item.description,
                author: item.author || "사용자", // 백엔드에서 author 정보를 안 주면 기본값
                authorProfile: userDefaultImg,
                createdAt: item.date 
            });
            });
        }
        setEvents(newEvents);
      } catch (error) {
        console.error("❌ 일정 불러오기 실패:", error);
      }
    };

    fetchSchedules();
  }, [currentMonth, projectId]);

  // (중간 달력 계산 로직은 기존과 동일)
  const monthLabel = useMemo(() => currentMonth.format("YYYY.MM"), [currentMonth]);
  const monthStart = currentMonth.startOf("month");
  const offset = (monthStart.day() + 6) % 7; 
  const daysInMonth = monthStart.endOf("month").date();
  const weekCount = Math.ceil((offset + daysInMonth) / 7);
  const gridStart = monthStart.subtract(offset, "day");
  const monthDays = useMemo(() => Array.from({ length: weekCount * 7 }).map((_, i) => gridStart.add(i, "day")), [gridStart, weekCount]);
  const isToday = (date) => date.isSame(dayjs(), "day");
  const hasEvents = (date) => { const k = date.format("YYYY-MM-DD"); return events[k] && events[k].length > 0; };
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const k = selectedDate.format("YYYY-MM-DD");
    return (events[k] || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [selectedDate, events]);


  // ✅ 2. 일정 추가 (POST) - 백엔드 형식에 완벽히 맞춤
  const handleAddEvent = async (newEventData) => {
    if (!selectedDate || !projectId) {
        alert("필수 정보가 누락되었습니다.");
        return;
    }

    try {
        // 👇 백엔드 컨트롤러(createSchedule)가 원하는 키 이름과 형식
        const payload = {
            project_id: projectId,          // ✅ 스네이크 케이스 필수
            title: newEventData.title,
            description: newEventData.desc,
            date: selectedDate.format("YYYY-MM-DD HH:mm:ss"), // ✅ 'T' 없는 포맷
        };

        console.log("📝 전송 데이터:", payload);

        const response = await axios.post(
            `${API_BASE_URL}/api/schedule/create`, 
            payload, 
            {
                headers: getAuthHeader(),
                withCredentials: true
            }
        );

        console.log("✅ 저장 성공:", response.data);

        // 성공 시 화면 즉시 반영
        const dateKey = selectedDate.format("YYYY-MM-DD");
        const createdEvent = {
            id: response.data.id || response.data.schedule_id, // 응답값 확인 필요
            title: newEventData.title,
            desc: newEventData.desc,
            author: "나", 
            authorProfile: userDefaultImg,
            createdAt: selectedDate.format("YYYY-MM-DD HH:mm:ss")
        };

        setEvents(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), createdEvent]
        }));
        
        onCloseModal(); 
    } catch (error) {
        console.error("❌ 일정 저장 실패:", error);
        if (error.response) {
             alert(`저장 실패 (${error.response.status}): ${error.response.data.message || "오류 발생"}`);
        } else {
             alert("서버와 통신할 수 없습니다.");
        }
    }
  };

  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth((m) => m.add(1, "month"));

  return (
    <>
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">‹</button>
          <div className="month-label">{monthLabel}</div>
          <button onClick={nextMonth} className="nav-btn">›</button>
        </div>
        <div className="weekday-row">
          {WEEKDAYS.map((wd) => (<div key={wd} className="weekday">{wd}</div>))}
        </div>
        <div className="dates-grid">
          {monthDays.map((day, idx) => {
            const inMonth = day.isSame(currentMonth, "month");
            const isSelected = day.isSame(selectedDate, "date");
            const isTodayDate = isToday(day);
            const hasEventsForDate = hasEvents(day);
            return (
              <div key={idx} className={`date-cell ${inMonth ? "" : "disabled"} ${isSelected ? "selected" : ""} ${isTodayDate ? "today" : ""}`}
                onClick={() => { if (inMonth) { setSelectedDate(day); onDayClick?.(day.toDate()); } }}>
                <div className="date-number">{day.format("DD")}</div>
                {hasEventsForDate && <div className="event-dot"></div>}
              </div>
            );
          })}
        </div>
      </div>
      {selectedDate && (
        <div className="selected-date-container">
          <div className="selected-date-info">
            <div className="date-label">{selectedDate.format("MM")}월 {selectedDate.format("DD")}일</div>
          </div>
          <div className="events-list">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div className="event-item" key={event.id}>
                  <div className="event-profile"><img src={event.authorProfile || userDefaultImg} alt={event.author} /></div>
                  <div className="event-content"><div className="event-title">{event.title}</div><div className="event-desc">{event.desc}</div></div>
                </div>
              ))
            ) : (<div className="no-events">일정이 없습니다.</div>)}
          </div>
        </div>
      )}
      <AddEventModal isOpen={isModalOpen} onClose={onCloseModal} onSave={handleAddEvent} />
    </>
  );
}