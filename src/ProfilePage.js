import React from 'react';
import profileImage from './images/profileImage.png';
import gearIcon from './images/gear.png';
import linkIcon from './images/link.png';
import tagIcon from './images/tag.png';
import trophyIcon from './images/trophy.png';
import schoolIcon from './images/school.png';
import profileTitle from './images/profileTitle.png'; 



function ProfilePage() {
  return (
    <div style={{
        fontFamily: 'sans-serif',
        maxWidth: '400px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: '#F5F5F5',
        padding: '16px',
        boxSizing: 'border-box'
      }}>      
      {/* 헤더 영역 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5px'
      }}>
        <h2 style={{ color: '#ff4d00', fontWeight: 'bold', fontSize: '30px' }}>프로필</h2>
        <img
  src={gearIcon}
  alt="설정"
  style={{
    width: '28px',
    height: '28px',
    objectFit: 'contain',
    display: 'block'
  }}
/>

      </div>

      {/* 프로필 정보 영역 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 프로필 이미지 */}
        <img
          src={profileImage}
          alt="프로필"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '16px'
          }}
        />

        {/* 텍스트 정보 */}
        <div>
          <div style={{
            backgroundColor: '#ff4d00',
            color: 'white',
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '12px',
            display: 'inline-block',
            marginBottom: '4px'
          }}>
            AAAA
          </div>

          <div style={{ fontWeight: 'bold', fontSize: '15px' }}>사용자 닉네임</div>
          <div style={{
  fontSize: '12px',
  color: '#555',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '2px'
}}>
  <img
    src={schoolIcon}
    alt="scool"
    style={{ width: '14px', height: '14px', objectFit: 'contain' }}
  />
  <span>대학교명 전공1 전공2</span>
</div>

        </div>
      </div>

      {/* 추가 정보 */}
      <div style={{ marginTop: '12px', fontSize: '13px', color: '#333' }}>
        {/* 태그 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <img src={tagIcon} alt="#" style={{ width: '16px', height: '16px', marginRight: 'px' }} />
          <span>#보유 스킬 #보유 스킬</span>
        </div>

        {/* 링크 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <img src={linkIcon} alt="link" style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          <span>any_link.com</span>
        </div>

        {/* 수상이력 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={trophyIcon} alt="수상" style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          <span>수상이력 1</span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
