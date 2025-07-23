import React, { useState, useMemo, useEffect } from "react";
import "./SlideContentSchedule.scss";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// 💡 컴포넌트 내부에 더미 데이터 선언
const dummySchedule = {
  events: {
    "2025-05-11": [
      { time: "09:00", desc: "팀 미팅" },
      { time: "11:30", desc: "디자인 리뷰" },
    ],
    "2025-05-12": [
      { time: "09:00", desc: "팀 미팅" },
      { time: "11:30", desc: "디자인 리뷰" },
    ],
    "2025-05-13": [
      { time: "10:00", desc: "API 연동 점검" },
      { time: "15:00", desc: "데모 준비" },
    ],
    "2025-05-14": [{ time: "14:00", desc: "고객 피드백 수집" }],
    "2025-05-15": [
      { time: "13:00", desc: "회의록 정리" },
      { time: "16:00", desc: "배포 준비" },
    ],
    "2025-05-16": [
      { time: "10:00", desc: "코드 머지" },
      { time: "13:00", desc: "회의록 정리" },
      { time: "16:00", desc: "배포 준비" },
      { time: "13:00", desc: "회의록 정리" },
      { time: "16:00", desc: "배포 준비" },
    ],
    "2025-05-17": [{ time: "09:30", desc: "오프라인 워크숍" }],
    "2025-05-18": [{ time: "11:00", desc: "주간 회고" }],
  },
};

export default function SlideContentSchedule() {
  // today를 한 번만 생성하여 참조 고정
  const today = useMemo(() => new Date("2025-05-16"), []);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // 이번 주 월요일(weekOffset 주차)~일요일 날짜 배열 생성
  const weekDates = useMemo(() => {
    const base = new Date(today);
    base.setDate(base.getDate() + weekOffset * 7);

    const dayOfWeek = base.getDay(); // 0=Sun,1=Mon...
    const diffToMon = (dayOfWeek + 6) % 7; // Mon=1→0, Sun=0→6
    const mon = new Date(base);
    mon.setDate(base.getDate() - diffToMon);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return d;
    });
  }, [today, weekOffset]);

  // 마운트 시 오늘 인덱스 설정
  useEffect(() => {
    const idx = weekDates.findIndex(
      (d) => d.toDateString() === today.toDateString()
    );
    setSelectedIdx(idx >= 0 ? idx : 0);
  }, [weekDates, today]);

  // weekOffset이 바뀔 때는 월요일(인덱스 0)으로 리셋
  useEffect(() => {
    if (weekOffset !== 0) {
      setSelectedIdx(0);
    }
  }, [weekOffset]);

  // 헤더 월.년 포맷
  const headerLabel = useMemo(() => {
    const d = weekDates[0];
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, [weekDates]);

  // 선택된 날짜 key, 해당 날짜 이벤트
  const selectedKey = weekDates[selectedIdx].toISOString().slice(0, 10);
  const todaysEvents = dummySchedule.events[selectedKey] || [];

  return (
    <div className="slide-card schedule-slide">
      <div className="schedule-header">{headerLabel}</div>

      <div className="week-row">
        {weekDates.map((d, i) => {
          const dayNum = String(d.getDate()).padStart(2, "0");
          return (
            <div
              key={i}
              className={`week-day ${i === selectedIdx ? "selected" : ""}`}
              onClick={() => setSelectedIdx(i)}
            >
              <div className="abbr">{WEEKDAYS[i]}</div>
              <div className="date">{dayNum}</div>
            </div>
          );
        })}
      </div>

      <div className="events-list">
        {todaysEvents.map((ev, i) => (
          <div className="event-item" key={i}>
            <div className="time">{ev.time}</div>
            <div className="desc">{ev.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
