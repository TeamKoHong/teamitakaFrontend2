import BackArrow from "../Common/UI/BackArrow";
import GroupChatIcon from "../Common/UI/GroupChatIcon";
import "./ProjectDetailHeader.scss";
import React from "react";

function ProjectDetailHeader({ projectName }) {
  return (
    <div className="project-detail-header-container">
      <div className="project-detail-header">
        <BackArrow />
        <p>{projectName}</p>
        <GroupChatIcon />
      </div>
    </div>
  );
}

export default ProjectDetailHeader;
