// src/components/ProjectCalendar/Calendar.jsx
import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import "./Calendar.scss";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Calendar({ onDayClick }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

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

  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth((m) => m.add(1, "month"));

  return (
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
          return (
            <div
              key={idx}
              className={`date-cell ${inMonth ? "" : "disabled"} ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => {
                if (!inMonth) return;
                setSelectedDate(day);
                onDayClick?.(day.toDate());
              }}
            >
              {day.format("DD")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
