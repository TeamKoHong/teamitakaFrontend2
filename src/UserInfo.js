import React from 'react';
import backIcon from './images/back.png';
import moreIcon from './images/more.png';
import profileImage from './images/profileImage.png';


function UserInfo() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', backgroundColor: '#fff' }}>
      {/* 상단 바 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
      <img
  src={backIcon}
  alt="뒤로가기"
  style={{
    width: '20px', height: '20px', objectFit: 'contain' }}
    />


        <h3 style={{ margin: 0, marginLeft: '110px', fontSize: '16px' }}>사용자님의 정보</h3>

      </div>

      {/* 프로필 이미지 */}
      <div style={{ textAlign: 'center', margin: '50px 0' }}>
        <img
          src={profileImage}
          alt="프로필"
          style={{ width: '80px', height: '80px', borderRadius: '50%' }}
        />
      </div>

      {/* 사용자 정보 목록 */}
      <ul style={{ listStyle: 'none', padding: '0 16px' }}>
        <InfoItem title="이름" value="사용자 이름" />
        <InfoItem title="닉네임" value="사용자 닉네임" />
        <InfoItem title="대학교" value="@@@ 대학교" />
        <InfoItem title="휴대폰 번호" value="010-@@@@-@@@@" />
        <InfoItem title="이메일 주소" value="***@gmail.com" />
      </ul>
    </div>
  );
}

// 개별 항목 컴포넌트


function InfoItem({ title, value }) {
  return (
    <li style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0'
    }}>
      <span style={{ fontWeight: 'bold' }}>{title}</span>

      {/* 값 + 아이콘 묶음 */}
      <span style={{ display: 'flex', alignItems: 'center', color: '#888' }}>
        {value}
        <img
          src={moreIcon}
          alt=">"
          style={{
            width: '16px',       
            height: '14px',
            marginLeft: '8px',
            objectFit: 'contain'
          }}
        />
      </span>
    </li>
  );
}

  

export default UserInfo;
