import React, { useState, useEffect } from "react";
import "./ProfileImage.css";
import PenIcon from "../assets/pen.png";
import PenBack from "../assets/penback.png";
import DefaultProfile from "../assets/profile_potato.png"; // 기본 이미지 (감자)

export default function ProfileImage({ src, onChange }) {
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(src || DefaultProfile);

  // src prop이 변경되면 상태 업데이트 (외부에서 이미지 URL 전달 시)
  useEffect(() => {
    if (src) {
      setProfileImage(src);
    }
  }, [src]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 미리보기용 로컬 이미지 설정
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    // 부모 컴포넌트에 파일 전달
    if (onChange) {
      onChange(file);
    }
  };

  const resetImage = () => {
    setProfileImage(DefaultProfile);
    setShowModal(false);
    // 부모 컴포넌트에 리셋 알림 (null로 전달)
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <>
      <div className="profile-wrapper">
        <img src={profileImage} className="profile-photo" alt="profile" />

        <button className="edit-icon-btn" onClick={() => setShowModal(true)}>
          <img src={PenBack} className="edit-back" alt="edit-background" />
          <img src={PenIcon} className="edit-icon" alt="edit-icon" />
        </button>

        {/* input hidden */}
        <input
          type="file"
          id="fileUpload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>

            {/* 상단 박스 */}
            <div className="modal-top-box">
              <div
                className="modal-item"
                onClick={() => document.getElementById("fileUpload").click()}
              >
                라이브러리에서 선택
              </div>

              <div className="modal-divider" />

              <div className="modal-item" onClick={resetImage}>
                현재 사진 삭제
              </div>
            </div>

            {/* 하단 취소 버튼 */}
            <div className="modal-cancel" onClick={() => setShowModal(false)}>
              취소
            </div>
          </div>
        </div>
      )}
    </>
  );
}
