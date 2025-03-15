// src/components/BottomNav.js
import React from "react";
import { NavLink } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { FaRegFolder } from "react-icons/fa6";
import { MdOutlinePerson } from "react-icons/md";
import { PiShareNetworkLight } from "react-icons/pi";

import "./BottomNav.scss";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/main" className="nav-item">
        <RiHome2Line className="nav-icon" />
        <span>메인</span>
      </NavLink>
      <NavLink to="/project-management" className="nav-item">
        <FaRegFolder className="nav-icon" />
        <span>프로젝트 관리</span>
      </NavLink>
      <NavLink to="/team" className="nav-item">
        <PiShareNetworkLight className="nav-icon" />
        <span>팀매칭</span>
      </NavLink>
      <NavLink to="/my" className="nav-item">
        <MdOutlinePerson className="nav-icon" />
        <span>마이</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
