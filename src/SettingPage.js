import React from 'react';
import backIcon from './images/back.png';
import moreIcon from './images/more.png';

function SettingPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', backgroundColor: '#f5f5f5' }}>
      {/* 상단 바 */}
      <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',  // 좌-중-우 정렬
  padding: '12px 16px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #ddd'
}}>
  {/* 왼쪽: ← 아이콘 */}
  <img
  src={backIcon}
  alt="뒤로가기"
  style={{
    width: '20px',
    height: '20px',
    objectFit: 'contain',
    display: 'block'
  }}
/>


  {/* 가운데: 설정 텍스트 */}
  <h3 style={{ margin: 0, fontSize: '16px', textAlign: 'center' }}>설정</h3>

  {/* 오른쪽: 빈 공간으로 균형 맞추기 */}
  <div style={{ width: '20px' }}></div>
</div>


      {/* 탈퇴 메뉴 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '16px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold' }}>탈퇴 하기</span>
        <img
  src={moreIcon}
  alt=">"
  style={{
    width: '16px',
    height: '16px',
    objectFit: 'contain',
    display: 'block'
  }}
/>

      </div>
    </div>
  );
}

export default SettingPage;
