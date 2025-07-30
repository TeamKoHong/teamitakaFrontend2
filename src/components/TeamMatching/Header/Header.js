import React from 'react';
import './Header.scss';
import { CiSearch} from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";

function Header({ title }) {
    return (
        <header className="teamheader">
        <div className="header-first">
        <div className="header-left">
          <h1 className="title">모집하기</h1>
        </div>            
        <div className="header-right">
          <button className="btn-search">
            <CiSearch className="icon-search" />
          </button>
          <button className="btn-bell">
            <CiBellOn className="icon-bell" />
          </button>
        </div>
        </div>
        </header>
    );
}

export default Header;
