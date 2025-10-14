// src/components/ProjectCalendar/Calendar.jsx
import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import "./Calendar.scss";
import userDefaultImg from "../../assets/icons/user_default_img.svg";
import AddEventModal from "./AddEventModal";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// 일정 데이터
const dummySchedule = {
  events: {
    "2025-10-03": [
      { 
        id: 1,
        title: "프로젝트 회의",
        desc: "프로젝트 진행 상황 논의",
        author: "김팀장",
        authorProfile: "https://via.placeholder.com/36x36/EBEBEB/999?text=김",
        createdAt: "2025-10-01T09:00:00"
      },
    ],
    "2025-10-04": [
      { 
        id: 2,
        title: "디자인 리뷰",
        desc: "UI/UX 디자인 검토 및 피드백",
        author: "박디자이너",
        authorProfile: "https://via.placeholder.com/36x36/EBEBEB/999?text=박",
        createdAt: "2025-10-02T14:30:00"
      },
      { 
        id: 3,
        title: "코드 리뷰",
        desc: "프론트엔드 코드 품질 검토",
        author: "이개발자",
        authorProfile: "https://via.placeholder.com/36x36/EBEBEB/999?text=이",
        createdAt: "2025-10-03T10:15:00"
      },
    ],
    "2025-10-05": [
      { 
        id: 4,
        title: "클라이언트 미팅",
        desc: "고객사와의 프로젝트 진행 상황 공유",
        author: "최PM",
        authorProfile: "https://via.placeholder.com/36x36/EBEBEB/999?text=최",
        createdAt: "2025-10-04T16:00:00"
      },
    ],
    "2025-10-06": [
      { 
        id: 5,
        title: "배포 준비",
        desc: "프로덕션 배포 전 최종 점검",
        author: "정개발자",
        authorProfile: "https://via.placeholder.com/36x36/EBEBEB/999?text=정",
        createdAt: "2025-02-05T11:20:00"
      },
    ],
    "2025-10-23": [
      { 
        id: 6,
        title: "테스트 실행",
        desc: "전체 시스템 통합 테스트",
        author: "한테스터",
        authorProfile: "https://via.placeholder.com/36x36/EBEBEB/999?text=한",
        createdAt: "2025-02-06T13:45:00"
      },
    ],
    "2025-10-25": [
      { 
        id: 7,
        title: "프로젝트 완료",
        desc: "프로젝트 최종 완료 및 문서화",
        author: "김팀장",
        authorProfile: "https://via.placeholder.com/36x36/EBEBEB/999?text=김",
        createdAt: "2025-02-07T15:30:00"
      },
    ],
  },
};

export default function Calendar({ onDayClick, isModalOpen, onCloseModal }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(dummySchedule.events);

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
    return dateEvents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [selectedDate, events]);

  // 일정 추가 함수
  const handleAddEvent = (newEvent) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.format("YYYY-MM-DD");
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent]
    }));
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
                  <img src={userDefaultImg} alt={event.author} />
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
