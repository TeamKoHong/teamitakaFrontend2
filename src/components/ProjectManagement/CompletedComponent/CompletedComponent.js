import React from "react";
import "./CompletedComponent.scss";
import SectionHeader from "../Common/SectionHeader";
import { FaStar } from "react-icons/fa"; // 즐겨찾기 아이콘
import avatar1 from "../../../assets/icons/avatar1.png";
import avatar2 from "../../../assets/icons/avatar2.png";
import avatar3 from "../../../assets/icons/avatar3.png";
import avatar4 from "../../../assets/icons/avatar4.png";

const CompletedComponent = () => {
  return (
    <div className="completed-container">
      {/* 상단 - 팀원 평가 안내 */}
      <div className="completed-top">
        <SectionHeader
          explainText={`팀원 평가가 이루어지지 않은\n프로젝트가 1개 있어요!`}
          highlightText="1개"
          filterOptions={[
            { value: "latest", label: "최신순" },
            { value: "date", label: "완료 날짜순" },
            { value: "rating", label: "평점순" },
          ]}
          onFilterChange={(e) => console.log(e.target.value)}
        />
      </div>

      {/* 상호 평가 진행 중 프로젝트 */}
      <div className="pending-review-card">
        <span className="review-badge">상호평가 진행중</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="13"
          viewBox="0 0 8 13"
          fill="none"
        >
          <path d="M1 12L6 6.5L1 1" stroke="#7B797A" stroke-width="1.625" />
        </svg>

        <h3>고려대 X 홍익대 프로젝트</h3>
        <p className="description">
          광화문 디자인 페스티벌에서 진행한 프로젝트입니다. 팀원들과 협업을
          경험하며 기획력과 디자인 역량을 키웠습니다.
        </p>
        <div className="team-avatars">
          <img
            src={avatar1}
            alt="팀원아바타"
            style={{ right: "0", zIndex: 2 }}
          />
          <img
            src={avatar2}
            alt="팀원아바타"
            style={{ right: "1.5rem", zIndex: 3 }}
          />
          <img
            src={avatar3}
            alt="팀원아바타"
            style={{ right: "3rem", zIndex: 4 }}
          />
          <img
            src={avatar4}
            alt="팀원아바타"
            style={{ right: "4.5rem", zIndex: 5 }}
          />
        </div>
      </div>

      <hr />

      {/* 완료된 프로젝트 리스트 */}
      <div className="completed-section">
        <h4 className="completed-section-title">완료 프로젝트</h4>
        <div className="completed-list">
          <div className="completed-item">
            <div className="completed-item-left">
              <h3>연합동아리 부스전 기획 프로젝트</h3>
              <p className="description">
                서울 디자인 전시 부스를 위한 기획 프로젝트
              </p>
            </div>
            <FaStar className="favorite-icon" />
          </div>
          <div className="completed-item">
            <div className="completed-item-left">
              <h3>예비 졸업전시 부스 준비 위원 프로젝트 </h3>
              <p className="description">
                졸업 전시를 위한 예비 프로젝트로서 전시를 기획하고 운영하는 ...
              </p>
            </div>
            <FaStar className="favorite-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedComponent;
