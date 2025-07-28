// src/components/BottomNav.js (또는 src/components/Common/BottomNav/BottomNav.js)
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { FaRegFolder } from "react-icons/fa6";
import { MdOutlinePerson } from "react-icons/md";
import { PiShareNetworkLight } from "react-icons/pi";

import "./BottomNav.scss";

function BottomNav() {
  const location = useLocation();

  // 각 탭의 활성화 여부를 결정하는 헬퍼 함수
  const isTabActive = (path) => {
    // '/project-management' 탭의 경우, '/project-management' 또는 '/project/'로 시작하는 모든 경로에서 활성화
    if (path === '/project-management') {
      return location.pathname.startsWith('/project-management') || location.pathname.startsWith('/project/');
    }
    // '/team-matching' 탭의 경우, '/team-matching'으로 시작하는 모든 경로에서 활성화
    if (path === '/team-matching') {
      return location.pathname.startsWith('/team-matching');
    }
    // 다른 탭들은 정확히 일치할 때만 활성화 (또는 필요에 따라 startsWith 사용)
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/main"
        className={isTabActive('/main') ? "nav-item active" : "nav-item"}
      >
        <RiHome2Line className="nav-icon" />
        <span>메인</span>
      </NavLink>
      <NavLink
        to="/project-management"
        className={isTabActive('/project-management') ? "nav-item active" : "nav-item"}
      >
        <FaRegFolder className="nav-icon" />
        <span>프로젝트 관리</span>
      </NavLink>
      {/* 팀매칭 탭의 to 경로를 /team-matching으로 변경하고, isTabActive 로직도 업데이트 */}
      <NavLink
        to="/team-matching" // <-- 이 부분을 /team-matching으로 변경
        className={isTabActive('/team-matching') ? "nav-item active" : "nav-item"} // <-- isTabActive 로직도 /team-matching으로 변경
      >
        <PiShareNetworkLight className="nav-icon" />
        <span>팀매칭</span>
      </NavLink>
      <NavLink
        to="/my"
        className={isTabActive('/my') ? "nav-item active" : "nav-item"}
      >
        <MdOutlinePerson className="nav-icon" />
        <span>마이</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;