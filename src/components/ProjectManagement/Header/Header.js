import React from "react";
import "./Header.scss";
import { CiBookmark } from "react-icons/ci";
import { MdToday } from "react-icons/md";
import Tab from "../Tab/Tab";

function Header({ onTabChange }) {
  return (
    <header className="pm-header">
      <div className="header-first">
        <div className="header-left">
          <h1 className="title">내 프로젝트 관리</h1>
        </div>
        <div className="header-right">
          <button className="btn-mark">
            <CiBookmark className="icon-mark" />
          </button>
          <button className="btn-day">
            <MdToday className="icon-day" />
          </button>
        </div>
      </div>
      <div className="header-second">
        <Tab onTabChange={onTabChange} />
      </div>
    </header>
  );
}

export default Header;
