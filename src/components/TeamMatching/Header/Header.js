// src/components/TeamMatching/Header/Header.js
import React from 'react';
import './Header.scss';
import { CiSearch, CiBellOn } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="teamheader">
      <div className="header-first">
        <div className="header-left">
          <h1 className="title">{title || '모집하기'}</h1>
        </div>
        <div className="header-right">
          <button
            className="btn-search"
            onClick={() => navigate('/search')}
            type="button"
          >
            <CiSearch className="icon-search" />
          </button>
          <button
            className="btn-bell"
            onClick={() => {/* 알림 클릭 로직 */}}
            type="button"
          >
            <CiBellOn className="icon-bell" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
