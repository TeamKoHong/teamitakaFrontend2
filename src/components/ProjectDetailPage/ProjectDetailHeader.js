import BackArrow from "../Common/UI/BackArrow";
import { useNavigate } from "react-router-dom";
import "./ProjectDetailHeader.scss";
import React, { useState } from "react";
import BottomSheet from "../Common/BottomSheet";

function ProjectDetailHeader({ projectName }) {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const handleBack = () => {
    navigate("/project-management");
  };

  const handleSelectLibrary = () => {
    // TODO: 라이브러리 열기
    setSheetOpen(false);
  };

  const handleDeletePhoto = () => {
    // TODO: 삭제 로직
    setSheetOpen(false);
  };

  return (
    <div className="project-detail-header-container">
      {/* 실제 헤더 내용 */}
      <div className="project-detail-header">
        <div onClick={handleBack}>
          <BackArrow />
        </div>

        <p>{projectName}</p>
        <div className="header-spacer"></div>
      </div>

      {/* 이미지 클릭 영역 */}
      <div className="image-click-area" onClick={() => setSheetOpen(true)}></div>

      <BottomSheet
        open={sheetOpen}
        onDismiss={() => setSheetOpen(false)}
        blocking={true}
        snapPoints={({ maxHeight }) => [215]}
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
