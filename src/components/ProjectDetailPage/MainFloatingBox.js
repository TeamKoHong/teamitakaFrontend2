import React from "react";
import "./MainFloatingBox.scss";
import groupCalendarIcon from "../../assets/icons/groupCalendarIcon.png";
import meetingNoteIcon from "../../assets/icons/meetingNoteIcon.png";
import teamMemberIcon from "../../assets/icons/teamMemberIcon.png";
import voteIcon from "../../assets/icons/voteIcon.png";
import { useNavigate } from "react-router-dom";
function MainFloatingBox() {
  const navigate = useNavigate();
  return (
    <div className="main-floating-box">
      <div className="header-container">
        <div className="icon-container">
          <div className="icon" onClick={() => navigate("/project/1/member")}>
            <img src={teamMemberIcon} alt="팀멤버아이콘" />
          </div>
          <p>팀원 정보</p>
        </div>

        <div className="icon-container">
          <div
            className="icon"
            onClick={() => navigate("/project/1/proceedings")}
          >
            <img src={meetingNoteIcon} alt="회의록" />
          </div>
          <p>팀 회의록</p>
        </div>

        <div className="icon-container">
          <div className="icon">
            <img
              src={voteIcon}
              alt="투표하기"
              onClick={() => navigate("/project/1/vote")}
            />
          </div>
          <p>투표하기</p>
        </div>

        <div className="icon-container">
          <div className="icon">
            <img
              src={groupCalendarIcon}
              alt="회의록"
              onClick={() => navigate("/project/1/calender")}
            />
          </div>
          <p>공유 캘린더</p>
        </div>
      </div>
    </div>
  );
}

export default MainFloatingBox;
