import BackArrow from "../Common/UI/BackArrow";
import GroupChatIcon from "../Common/UI/GroupChatIcon";
import { useNavigate } from "react-router-dom";
import "./ProjectDetailHeader.scss";
import React, { useState } from "react";
import { ReactComponent as Triangle } from "../../assets/icons/Polygon.svg";
import { ReactComponent as Circle } from "../../assets/icons/Ellipse.svg";
import { ReactComponent as Square } from "../../assets/icons/Rectangle.svg";
import BottomSheet from "../Common/BottomSheet";
function ProjectDetailHeader({ projectName }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();
  const handleSelectLibrary = () => {
    // TODO: 라이브러리 열기
    setSheetOpen(false);
  };
  const handleDeletePhoto = () => {
    // TODO: 삭제 로직
    setSheetOpen(false);
  };
  const handleBack = () => {
    navigate("/project-management");
  };

  return (
    <div className="project-detail-header-container">
      {/* 실제 헤더 내용 */}
      <div className="project-detail-header">
        <div onClick={handleBack}>
          <BackArrow />
        </div>

        <p>{projectName}</p>
        <GroupChatIcon />
      </div>
      {/* 배경 도형들 */}
      <div className="shape-container" onClick={() => setSheetOpen(true)}>
        <Triangle className="triangle" />
        <div className="shape-two">
          <Circle className="circle" />
          <Square className="square" />
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        onDismiss={() => setSheetOpen(false)}
        blocking={true}
        snapPoints={({ maxHeight }) => [215]} // 높이 조정 (패딩 고려하여 215로 복원)
        className="offset-sheet"
      >
        <div className="sheet-body">
          <ul className="option-list">
            <li onClick={handleSelectLibrary}>라이브러리에서 선택</li>
            <div className="divider" />
            <li onClick={handleDeletePhoto}>현재 사진 삭제</li>
          </ul>
          <ul className="cancel-list">
            <li onClick={() => setSheetOpen(false)}>취소</li>
          </ul>
        </div>
      </BottomSheet>
    </div>
  );
}

export default ProjectDetailHeader;
