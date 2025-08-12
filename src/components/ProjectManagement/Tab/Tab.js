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
    <div className="tab-container">
      {tabsName.map((tab, index) => (
        <button
          key={tab}
          className={`tab-item ${activeTab === index ? "active" : ""}`}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tab;
