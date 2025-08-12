import React, { useState } from "react";
import "./Tab.scss";

function Tab({ onTabChange, activeTabIndex = 0 }) {
  // 0: 진행 중, 1: 모집중, 2: 완료된
  const [activeTab, setActiveTab] = useState(activeTabIndex);

  const tabsName = ["진행 중", "모집중", "완료된"];

  const handleTabClick = (index) => {
    setActiveTab(index);
    onTabChange(index); // 선택된 탭을 부모 컴포넌트로 전달
  };

  return (
    <div className="tab-container" role="tablist" aria-label="프로젝트 상태 탭">
      {tabsName.map((tab, index) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === index}
          className={`tab-item ${activeTab === index ? "active" : ""}`}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </button>
      ))}
      {/* 3분할 인디케이터 바 */}
      <span
        className="indicator"
        aria-hidden="true"
        style={{ left: `calc((100% / 3) * ${activeTab})` }}
      />
    </div>
  );
}

export default Tab;
