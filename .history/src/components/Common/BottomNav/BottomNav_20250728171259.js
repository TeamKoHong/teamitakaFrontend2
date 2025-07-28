// src/components/BottomNav.js (또는 src/components/Common/BottomNav/BottomNav.js)
import React from "react";
import { NavLink, useLocation } from "react-router-dom"; // useLocation 임포트 추가
import { RiHome2Line } from "react-icons/ri";
import { FaRegFolder } from "react-icons/fa6";
import { MdOutlinePerson } from "react-icons/md";
import { PiShareNetworkLight } from "react-icons/pi";

import "./BottomNav.scss"; // 이 파일은 BottomNav.module.scss가 아닌, 일반 .scss 파일인 것으로 보입니다.

function BottomNav() {
  const location = useLocation(); // 현재 경로를 가져옵니다.

  // 각 탭의 활성화 여부를 결정하는 헬퍼 함수
  const isTabActive = (path) => {
    // '/project-management' 탭의 경우, '/project'로 시작하는 모든 경로에서 활성화
    if (path === '/project-management') {
      return location.pathname.startsWith('/project');
    }
    // 다른 탭들은 정확히 일치할 때만 활성화 (또는 필요에 따라 startsWith 사용)
    // 예: /main 이나 /team, /my
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/main" 
        // className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} // 기본 NavLink isActive
        // isTabActive 헬퍼 함수 사용
        className={isTabActive('/main') ? "nav-item active" : "nav-item"} 
      >
        <RiHome2Line className="nav-icon" />
        <span>메인</span>
      </NavLink>
      <NavLink 
        to="/project-management" 
        // className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        // isTabActive 헬퍼 함수 사용 (프로젝트 관리 탭)
        className={isTabActive('/project-management') ? "nav-item active" : "nav-item"} 
      >
        <FaRegFolder className="nav-icon" />
        <span>프로젝트 관리</span>
      </NavLink>
      <NavLink 
        to="/team" 
        // className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        // isTabActive 헬퍼 함수 사용
        className={isTabActive('/team') ? "nav-item active" : "nav-item"} 
      >
        <PiShareNetworkLight className="nav-icon" />
        <span>팀매칭</span>
      </NavLink>
      <NavLink 
        to="/my" 
        // className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        // isTabActive 헬퍼 함수 사용
        className={isTabActive('/my') ? "nav-item active" : "nav-item"} 
      >
        <MdOutlinePerson className="nav-icon" />
        <span>마이</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;