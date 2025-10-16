import React from "react";
import projectDefaultImg from "../../assets/icons/project_default_img.png";
import "./ApplicationHistorySlide.scss";

function ApplicationHistorySlide({ isOpen, onClose }) {
  if (!isOpen) return null;

  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const applications = [
    {
      id: 1,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg,
      status: "recruiting", // recruiting, confirmed, ended
      statusText: "팀원 모집 중"
    },
    {
      id: 2,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg,
      status: "confirmed",
      statusText: "팀 확정 완료"
    },
    {
      id: 3,
      title: "프로젝트 제목",
      description: "프로젝트 설명글입니다. 최대 2줄까지 미리보기로 볼 수 있습니다. (최대 48자)",
      startDate: "00.00",
      endDate: "00.00",
      image: projectDefaultImg,
      status: "ended",
      statusText: "모집 종료"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "recruiting":
        return "#ff6b35"; // 주황색
      case "confirmed":
      case "ended":
        return "#140805"; // 검은색
      default:
        return "#140805";
    }
  };

  return (
    <div className="application-history-overlay">
      <div className="application-history-slide">
        {/* 헤더 */}
        <div className="application-history-header">
          <h2 className="application-history-title">지원 내역</h2>
          <button className="application-history-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 프로젝트 목록 */}
        <div className="application-history-list">
          {applications.map((application) => (
            <div key={application.id} className="application-history-card">
              {/* 프로젝트 정보와 이미지 */}
              <div className="application-history-top">
                <div className="application-history-content">
                  <div className="application-history-dates">
                    {application.startDate} ~ {application.endDate}
                  </div>
                  <h3 className="application-history-title-text">{application.title}</h3>
                  <p className="application-history-description">{application.description}</p>
                </div>
                <div className="application-history-image">
                  <img src={application.image} alt={application.title} />
                </div>
              </div>

              {/* 구분선 */}
              <div className="application-history-divider"></div>

              {/* 하단 상태와 액션 */}
              <div className="application-history-bottom">
                <div className="application-history-status">
                  <span 
                    className="status-text"
                    style={{ color: getStatusColor(application.status) }}
                  >
                    {application.statusText}
                  </span>
                </div>
                <div className="application-history-action">
                  <span className="view-application">지원서 보기</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApplicationHistorySlide;
