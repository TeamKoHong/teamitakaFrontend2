import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import bookMarkIcon from "../../../assets/icons/bookMarkIcon.svg";
import bellIcon from "../../../assets/icons/bell.png";
import Tab from "../Tab/Tab";
import { OTHER_ROUTES } from "../../../constants/routes";

function Header({ onTabChange, activeTabIndex }) {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleBookmarkClick = () => {
    navigate(OTHER_ROUTES.BOOKMARK);
  };

  return (
    <header className="pm-header">
      <div className="header-first">
        <div className="header-left">
          <h1 className="title">내 프로젝트 관리</h1>
        </div>
        <div className="header-right">
          <button className="btn-notification" onClick={handleNotificationClick}>
            <img src={bellIcon} alt="알림" />
          </button>
          <button className="btn-bookmark" onClick={handleBookmarkClick}>
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
