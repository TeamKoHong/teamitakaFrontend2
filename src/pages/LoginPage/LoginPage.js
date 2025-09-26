import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';

function LoginPage() {
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate('/register');
    };

    return (
        <div className="login-page-container">
            <div className="login-content">
                <h1 className="welcome-text">반가워요!</h1>
                <div className="subtitle">
                    <span className="highlight">맞춤형 팀 매칭</span>
                    <span className="normal">으로 </span>
                    <span className="normal">프로젝트를 완성하세요!</span>
                </div>
                
                <div className="button-group">
                    <input className="input-field" placeholder="아이디 입력" type="text">
                    </input>
                    <input className="input-field" placeholder="비밀번호 입력" type="password">
                    </input>
                    <button className="login-button">
                        로그인
                    </button>
                </div>
                
                <div className="find-links">
                    <button className="find-links-button">
                        아이디 찾기
                    </button>
                    <span className="find-links-separator">|</span>
                    <button className="find-links-button">
                        비밀번호 찾기
                    </button>
                    <span className="find-links-separator">|</span>
                    <button className="find-links-button" onClick={handleSignup}>
                        회원가입
                    </button>
                </div>
                <div className="look-without-register">
                    회원가입 없이 둘러볼래요
                </div>
            </div>
        </div>
    );
}

export default LoginPage; 