// src/components/TeamMatching/Header/Header.js
import React from 'react';
import './Header.scss';
import search_icon from "../../../assets/search_icon.png";
import SchoolFilterToggle from '../../Common/SchoolFilterToggle';

import { useNavigate } from 'react-router-dom';

function Header({ title, showSchoolFilter = true }) {
  const navigate = useNavigate();

  return (
    <header className="teamheader">
      <div className="header-first">
        <div className="header-left">
          <h1 className="title">{title || '모집하기'}</h1>
        </div>
        <div className="header-right">
          {showSchoolFilter && <SchoolFilterToggle />}
          <button
            className="btn-search"
            onClick={() => navigate('/search')}
            type="button"
          >
            <img src={search_icon} alt="알림" className="icon-search" />
          </button>

        </div>
      </div>
    </header>
  );
}

export default Header;
