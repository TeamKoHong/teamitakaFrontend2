import DefaultHeader from "../../components/Common/DefaultHeader";
import "./ProceedingPage.scss";
export default function ProceedingsPage() {
  const items = [
    { day: "4/15", title: "중간 발표 단체 연습", fullDate: "2025.4.15" },
    {
      day: "4/05",
      title: "추가 회의 및 자료정리 완료 확인",
      fullDate: "2025.1.15",
    },
    {
      day: "4/02",
      title: "아이데이션을 위한 전체 회의",
      fullDate: "2025.1.15",
    },
    {
      day: "4/02",
      title: "아이데이션을 위한 전체 회의",
      fullDate: "2025.1.15",
    },
    { day: "4/15", title: "중간 발표 단체 연습", fullDate: "2025.4.15" },
    {
      day: "4/05",
      title: "추가 회의 및 자료정리 완료 확인",
      fullDate: "2025.1.15",
    },
    {
      day: "4/02",
      title: "아이데이션을 위한 전체 회의",
      fullDate: "2025.1.15",
    },
  ];
  return (
    <div className="proceedings-page-container">
      <DefaultHeader title="팀 회의록" showChat={false} backPath="/project/1" />
      <div className="proceedings-list">
        <div className="timeLineBox-container">
          <div className="timeLineBox-header"></div>

          {/* 타임라인 아이템 컨테이너 */}
          <div className="timeLineBox-items">
            {/* 전체 타임라인 선 */}
            <div className="timeLineBox-line" />

            {items.map((item, idx) => (
              <div className="timeLineBox-content" key={idx}>
                <div className="day-circle">{item.day}</div>
                <div className="timeLineBox-content-text">
                  <h3>{item.title}</h3>
                  <p>{item.fullDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
