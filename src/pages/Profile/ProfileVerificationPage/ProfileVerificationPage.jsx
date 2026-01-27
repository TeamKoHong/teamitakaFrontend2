import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../services/user';

export default function ProfileVerificationPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getMe();
        if (res?.success) {
          setUserData(res.user);
        }
      } catch (err) {
        // [수정 포인트] setError(err) 대신 console.error를 사용하여 에러를 방지합니다.
        console.error('데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return <div style={{ padding: '20px' }}>로딩 중...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Pretendard' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={handleBack}
          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}
        >
          &larr;
        </button>
        <h1 style={{ fontSize: '18px', margin: '0 0 0 10px' }}>학교 인증</h1>
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>현재 인증 상태</p>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>
          {userData?.university ? `${userData.university} 인증 완료` : '미인증 상태'}
        </h2>
        {userData?.major && (
          <p style={{ fontSize: '14px', color: '#888' }}>학과: {userData.major}</p>
        )}
      </div>

      {!userData?.university && (
        <button
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#F76241',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            marginTop: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => alert('인증 페이지로 이동합니다.')}
        >
          학교 인증 시작하기
        </button>
      )}
    </div>
  );
}