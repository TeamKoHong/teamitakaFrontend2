import './ProfileHeader.css';

export default function ProfileHeader() {
    return (
      <>
         {/* 상단 제목 + 설정 아이콘 영역 */}
      <div className="profile-header-top">
        <img src="/title-image.png" alt="프로필 제목" className="title-image" />
        <img src="/setting.png" alt="설정 아이콘" className="setting-icon" />
      </div>
  
        {/* 원래 프로필 카드 */}
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar-wrapper">
              <img src="/profile_default.png" alt="기본 프로필 이미지" className="avatar-image" />
              <img src="/university_verified.png" alt="인증 뱃지" className="verified-badge" />
            </div>
  
            <div className="profile-text-group">
              <p className="profile-title">프로필을 입력하세요.</p>
              <p className="profile-sub">
                <img src="/university.png" alt="학교 아이콘" className="univ-icon" />
                대학교명 재학 중
                <br />
                
              </p>
              <p className="profile-project-bold">현재 진행중인 프로젝트가 없어요.</p>
              <p className="profile-project-light">팀플 경험이 없어요.</p>
            </div>
          </div>
        </div>
      </>
    );
  }
  
