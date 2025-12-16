import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import ProfileImage from "../../../components/ProfileImage";
import BasicInfo from "../../../components/BasicInfo";
import MajorInput from "../../../components/MajorInput";
import TeamExperience from "../../../components/TeamExperience";
import InterestKeywords from "../../../components/InterestKeywords";
import Withdrawal from "../../../components/Withdrawal";
import Button from "../../../components/DesignSystem/Button/Button";
import { getMe, updateProfile, uploadProfileImage } from "../../../services/user";
import styles from "./ProfileEditPage.module.scss";

export default function ProfileEditPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 사용자 데이터 상태
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // 이미지 파일 상태 (업로드용)
  const [imageFile, setImageFile] = useState(null);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    major: "",
    teamExperience: 0,
    keywords: [],
  });

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // location.state에서 user 데이터 확인 (빠른 경로)
        if (location.state?.user) {
          const user = location.state.user;
          setUserData(user);
          setFormData({
            major: user.major || "",
            teamExperience: user.teamExperience || 0,
            keywords: user.keywords || [],
          });
          setIsLoading(false);
          return;
        }

        // state 없으면 API 호출 (새로고침 대응)
        const res = await getMe();
        if (res?.success && res.user) {
          const user = res.user;
          setUserData(user);
          setFormData({
            major: user.major || "",
            teamExperience: user.teamExperience || 0,
            keywords: user.keywords || [],
          });
        } else {
          throw new Error("사용자 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        if (err?.code === "UNAUTHORIZED") {
          navigate("/login", { replace: true });
          return;
        }
        setError(err.message || "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [location.state, navigate]);

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate("/my");
  };

  // 이미지 변경 핸들러
  const handleImageChange = (file) => {
    setImageFile(file);
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      let profileImageUrl = userData?.profileImage;

      // 새 이미지가 선택되었으면 먼저 업로드
      if (imageFile) {
        const uploadRes = await uploadProfileImage(imageFile);
        if (uploadRes?.success) {
          profileImageUrl = uploadRes.data.photo_url;
        }
      }

      // 프로필 업데이트
      const updatedData = {
        ...userData,
        profileImage: profileImageUrl,
        major: formData.major,
        teamExperience: formData.teamExperience,
        keywords: formData.keywords,
      };

      const res = await updateProfile(updatedData);
      if (res?.success) {
        // 성공 시 /my 페이지로 이동 (업데이트된 데이터 전달)
        navigate("/my", { replace: true, state: { user: updatedData } });
      } else {
        throw new Error("프로필 저장에 실패했습니다.");
      }
    } catch (err) {
      if (err?.code === "UNAUTHORIZED") {
        navigate("/login", { replace: true });
        return;
      }
      setError(err.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header title="프로필 편집" onBack={handleBack} />
        <div className={styles.loadingContainer}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 (사용자 데이터 로드 실패)
  if (!userData && error) {
    return (
      <div className={styles.container}>
        <Header title="프로필 편집" onBack={handleBack} />
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <Button onClick={() => navigate("/my")}>돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="프로필 편집" onBack={handleBack} />

      <div className={styles.content}>
        <ProfileImage
          src={userData?.profileImage}
          onChange={handleImageChange}
        />

        <BasicInfo
          name={userData?.username || "사용자"}
          email={userData?.email || ""}
          university={userData?.university || "소속 미등록"}
          showVerified={!!userData?.university}
        />

        <MajorInput
          value={formData.major}
          onChange={(value) => setFormData(prev => ({ ...prev, major: value }))}
        />

        <TeamExperience
          value={formData.teamExperience}
          onChange={(value) => setFormData(prev => ({ ...prev, teamExperience: value }))}
        />

        <InterestKeywords
          value={formData.keywords}
          onChange={(value) => setFormData(prev => ({ ...prev, keywords: value }))}
        />

        {/* 에러 메시지 */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <div className={styles.bottomSection}>
        <Button
          fullWidth
          onClick={handleSave}
          disabled={isSaving}
          isLoading={isSaving}
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </Button>

        {/* 탈퇴하기 */}
        <Withdrawal />
      </div>
    </div>
  );
}
