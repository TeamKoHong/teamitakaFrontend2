import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isButtonActive = email.length > 0 && password.length > 0;

  function handleLogin() {
    alert('로그인 버튼이 눌렸어!');
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>로그인</h2>
      <input
        type="email"
        placeholder="학교 이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <div style={styles.forgotContainer}>
        <a href="#" style={styles.forgot}>비밀번호를 잊어버리셨나요?</a>
      </div>
      <button
        onClick={handleLogin}
        style={{
          ...styles.button,
          backgroundColor: isButtonActive ? '#FF6B00' : '#ddd',
          color: isButtonActive ? '#fff' : '#888',
          cursor: isButtonActive ? 'pointer' : 'default',
        }}
        disabled={!isButtonActive}
      >
        로그인
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '320px',
    margin: '80px auto',
    padding: '0 20px',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    height: '48px',
    marginBottom: '12px',
    padding: '0 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  forgotContainer: {
    textAlign: 'right',
    marginBottom: '24px',
  },
  forgot: {
    fontSize: '12px',
    color: '#555',
    textDecoration: 'none',
  },
  button: {
    width: '100%',
    height: '48px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
};

export default LoginPage;
