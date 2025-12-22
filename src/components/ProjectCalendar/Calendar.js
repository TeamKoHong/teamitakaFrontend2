// src/components/ProjectCalendar/Calendar.jsx
import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios"; // axios 추가
import "./Calendar.scss";
import userDefaultImg from "../../assets/icons/user_default_img.svg";
import AddEventModal from "./AddEventModal";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const API_BASE_URL = "http://localhost:8080/api"; // 백엔드 주소 확인 필요

// projectId를 props로 받아야 합니다.
export default function Calendar({ projectId, onDayClick, isModalOpen, onCloseModal }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({}); // 초기값 빈 객체로 변경

  // ✅ 1. 일정 조회 (월이 바뀌거나 projectId가 바뀌면 실행)
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!projectId) return;

      try {
        const year = currentMonth.format("YYYY");
        const month = currentMonth.format("MM");

        const response = await axios.get(`${API_BASE_URL}/schedule/project/${projectId}`, {
          params: { year, month },
          withCredentials: true
        });

        // 서버 데이터를 날짜 키(YYYY-MM-DD) 형태의 객체로 변환
        const newEvents = {};
        response.data.forEach((item) => {
          const dateKey = dayjs(item.date).format("YYYY-MM-DD");
          if (!newEvents[dateKey]) newEvents[dateKey] = [];
          
          newEvents[dateKey].push({
            id: item.schedule_id,
            title: item.title,
            desc: item.description,
            author: item.author || "사용자", // 백엔드 응답값에 맞춰 수정
            authorProfile: item.authorProfile || userDefaultImg,
            createdAt: item.date // 정렬을 위해 날짜 사용
          });
        });
        
        setEvents(newEvents);
      } catch (error) {
        console.error("일정 불러오기 실패:", error);
      }
    };

    fetchSchedules();
  }, [currentMonth, projectId]);

  // YYYY.MM 헤더
  const monthLabel = useMemo(
    () => currentMonth.format("YYYY.MM"),
    [currentMonth]
  );

  // 이번 달 1일, 오프셋(월요일 기준)
  const monthStart = currentMonth.startOf("month");
  const offset = (monthStart.day() + 6) % 7; // Mon→0, ..., Sun→6

  // 그 달 마지막 날짜 가져오기
  const daysInMonth = monthStart.endOf("month").date();

  // 필요한 주(줄) 수 계산
  const weekCount = Math.ceil((offset + daysInMonth) / 7);

  // 그리드 시작일 (월요일)
  const gridStart = monthStart.subtract(offset, "day");

  // 동적으로 rows*7 개만 생성
  const monthDays = useMemo(
    () =>
      Array.from({ length: weekCount * 7 }).map((_, i) =>
        gridStart.add(i, "day")
      ),
    [gridStart, weekCount]
  );

  // 오늘 날짜 확인
  const isToday = (date) => {
    return date.isSame(dayjs(), "day");
  };
  
  // 일정이 있는 날짜 확인
  const hasEvents = (date) => {
    const dateKey = date.format("YYYY-MM-DD");
    return events[dateKey] && events[dateKey].length > 0;
  };

  // 선택된 날짜의 일정 가져오기 (등록 순서대로 정렬)
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.format("YYYY-MM-DD");
    const dateEvents = events[dateKey] || [];
    // createdAt 기준으로 정렬
    return dateEvents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [selectedDate, events]);

  // ✅ 2. 일정 추가 함수 (서버 연동)
  const handleAddEvent = async (newEventData) => {
    if (!selectedDate) {
        alert("날짜를 선택해주세요.");
        return;
    }
    if (!projectId) {
        alert("프로젝트 ID가 없습니다.");
        return;
    }

    try {
        const payload = {
            project_id: projectId,
            title: newEventData.title,
            description: newEventData.desc, // 모달에서 desc로 넘어옴
            date: selectedDate.format("YYYY-MM-DD HH:mm:ss"),
        };

        const response = await axios.post(`${API_BASE_URL}/schedule/create`, payload, {
            withCredentials: true
        });

        // 성공 시 로컬 상태 업데이트 (화면 즉시 반영)
        const dateKey = selectedDate.format("YYYY-MM-DD");
        const createdEvent = {
            id: response.data.schedule_id,
            title: newEventData.title,
            desc: newEventData.desc,
            author: "나", // 현재 로그인한 사용자 정보가 있다면 사용
            authorProfile: userDefaultImg,
            createdAt: new Date().toISOString()
        };

        setEvents(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), createdEvent]
        }));
        
        onCloseModal(); // 모달 닫기
    } catch (error) {
        console.error("일정 저장 실패:", error);
        alert("일정 저장 중 오류가 발생했습니다.");
    }
  };

  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth((m) => m.add(1, "month"));

  return (
    <>
      <div className="calendar">
        {/* 헤더 */}
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">
            ‹
          </button>
          <div className="month-label">{monthLabel}</div>
          <button onClick={nextMonth} className="nav-btn">
            ›
          </button>
        </div>

        {/* 요일 */}
        <div className="weekday-row">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="weekday">
              {wd}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="dates-grid">
          {monthDays.map((day, idx) => {
            const inMonth = day.isSame(currentMonth, "month");
            const isSelected = day.isSame(selectedDate, "date");
            const isTodayDate = isToday(day);
            const hasEventsForDate = hasEvents(day);
            
            return (
              <div
                key={idx}
                className={`date-cell ${inMonth ? "" : "disabled"} ${
                  isSelected ? "selected" : ""
                } ${isTodayDate ? "today" : ""}`}
                onClick={() => {
                  if (!inMonth) return;
                  setSelectedDate(day);
                  onDayClick?.(day.toDate());
                }}
              >
                <div className="date-number">{day.format("DD")}</div>
                {hasEventsForDate && <div className="event-dot"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택된 날짜 정보 및 일정 - 별개 박스 */}
      {selectedDate && (
        <div className="selected-date-container">
          <div className="selected-date-info">
            <div className="date-label">
              {selectedDate.format("MM")}월 {selectedDate.format("DD")}일
            </div>
          </div>

        <div className="events-list">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <div className="event-item" key={event.id}>
                <div className="event-profile">
                  <img src={event.authorProfile || userDefaultImg} alt={event.author} />
                </div>
                <div className="event-content">
                  <div className="event-title">{event.title}</div>
                  <div className="event-desc">{event.desc}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">일정이 없습니다.</div>
          )}
        </div>
        </div>
      )}

      {/* 일정 추가 모달 */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSave={handleAddEvent}
      />
    </>
  );
}