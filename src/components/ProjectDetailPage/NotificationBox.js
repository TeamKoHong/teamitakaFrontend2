import React from "react";
import "./NotificationBox.scss";
import avatar1 from "../../assets/icons/avatar1.png";
import avatar2 from "../../assets/icons/avatar2.png";
import avatar3 from "../../assets/icons/avatar3.png";
import avatar4 from "../../assets/icons/avatar4.png";
// 더미 알림 데이터
const dummyAlerts = [
  {
    id: 1,
    avatar: avatar1,
    time: "3시간 전",
    message: "전달받은 자료로 발표자료 완성했습니다!",
  },
  {
    id: 2,
    avatar: avatar2,
    time: "15시간 전",
    message: "자료 정리해서 공유 드라이브에 올렸어요.",
  },
  {
    id: 3,
    avatar: avatar3,
    time: "2주 전",
    message: "여러분 아이데이션 회의 시간 투표 참여해주세요!",
  },
  {
    id: 4,
    avatar: avatar4,
    time: "4주 전",
    message: "다음 주 중간 회의 일정 공유드립니다.",
  },
  // 더 많은 항목을 넣어 보세요…
];

export default function NotificationBox({ projectName = "프로젝트명" }) {
  return (
    <div className="notification-box-container">
      <div className="notification-header">
        <h2>[{projectName}] 알림</h2>
        <button className="add-btn">+</button>
      </div>

      <div className="notification-list">
        {dummyAlerts.map((alert) => (
          <div className="notification-item" key={alert.id}>
            <img className="avatar" src={alert.avatar} alt="avatar" />
            <div className="notification-content">
              <span className="time">{alert.time}</span>
              <p className="message">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
