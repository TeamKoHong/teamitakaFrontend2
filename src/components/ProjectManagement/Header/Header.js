import React from "react";
import "./Header.scss";
import bookMarkIcon from "../../../assets/icons/bookMarkIcon.svg";
import Tab from "../Tab/Tab";

function Header({ onTabChange, activeTabIndex }) {
  return (
    <header className="pm-header">
      <div className="header-first">
        <div className="header-left">
          <h1 className="title">내 프로젝트 관리</h1>
        </div>
        <div className="header-right">
          <button className="btn-bookmark">
            <img src={bookMarkIcon} alt="북마크" />
          </button>
        </div>
      </div>
      <div className="header-second">
        <Tab onTabChange={onTabChange} activeTabIndex={activeTabIndex} />
      </div>
    </header>
  );
}

export default Header;
