import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
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
  const { logout } = useAuth();

  // 사용자 데이터 상태
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 이전 데이터와 비교를 위한 참조
  const prevDataRef = React.useRef(null);

  // 텍스트 정보(전공, 팀플 경험, 키워드) 자동 저장 로직
  const saveData = React.useCallback(async (currentFormData) => {
    // 저장 중이거나 데이터 로드 전이면 중단
    if (!userData) return;

    try {
      // 프로필 데이터 구성 (이미지는 현재 userData에 있는 것을 그대로 유지)
      const updatedData = {
        ...userData,
        major: currentFormData.major,
        teamExperience: currentFormData.teamExperience,
        keywords: currentFormData.keywords,
      };

      // API 호출
      const res = await updateProfile(updatedData);

      if (res?.success) {
        // 성공 시 로컬 상태 동기화 (재저장 방지용)
        setUserData(updatedData);
        prevDataRef.current = updatedData;
        setError(null);
      } else {
        console.error("Autosave failed without exception");
      }
    } catch (err) {
      console.error("Autosave error:", err);
      if (err?.code === "UNAUTHORIZED") {
        navigate("/login", { replace: true });
      }
    }
  }, [userData, navigate]);

  // 텍스트 자동 저장 (Debounce Effect)
  useEffect(() => {
    // 초기 로딩 시 실행 방지
    if (isLoading || !userData) return;

    // 변경 사항 확인 (Simple Deep Compare or Field Check)
    // 실제 변경이 있을 때만 타이머 설정
    const timeoutId = setTimeout(() => {
      saveData(formData);
    }, 1000); // 1초 디바운스

    return () => clearTimeout(timeoutId);
  }, [formData, userData, isLoading, saveData]);

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate("/profile");
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    try { sessionStorage.setItem('suppress-session-expired', '1'); } catch (e) { }
    try { logout(); } catch (e) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    navigate('/login', { replace: true });
  };

  // 💡 이미지 변경 핸들러 (즉시 저장 로직으로 교체됨)
  const handleImageChange = async (file) => {
    if (!file) return;

    try {
      // 1. 서버에 파일 업로드 요청
      const uploadRes = await uploadProfileImage(file);
      
      if (uploadRes?.success) {
        // 2. 백엔드에서 생성해준 새로운 이미지 URL 가져오기
        const newImageUrl = uploadRes.data.photo_url;
        
        // 3. 현재 내 프로필 데이터에 새 이미지 주소 덮어쓰기
        const updatedData = {
          ...userData,
          profileImage: newImageUrl,
          major: formData.major,
          teamExperience: formData.teamExperience,
          keywords: formData.keywords,
        };
        
        // 4. 프로필 정보 최종 업데이트
        const updateRes = await updateProfile(updatedData);
        
        if (updateRes?.success) {
          setUserData(updatedData); // 화면 데이터 즉시 동기화
          alert("프로필 이미지가 성공적으로 변경되었습니다! 🎉");
        }
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert("이미지 업로드에 실패했습니다. (용량 초과 혹은 서버 오류)");
    }
  };

  // 로그아웃 버튼 컴포넌트
  const logoutButton = (
    <button className="header-logout-btn" onClick={handleLogout}>
      로그아웃
    </button>
  );

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header title="프로필 편집" onBack={handleBack} rightAction={logoutButton} />
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
        <Header title="프로필 편집" onBack={handleBack} rightAction={logoutButton} />
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <Button onClick={() => navigate("/profile")}>돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="프로필 편집" onBack={handleBack} rightAction={logoutButton} />

      <div className={styles.content}>
        <ProfileImage
          src={userData?.avatar || userData?.profileImage}
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

      <div className={styles.bottomSection}>
        {/* 탈퇴하기 */}
        <Withdrawal />
      </div>
    </div>
  );
}