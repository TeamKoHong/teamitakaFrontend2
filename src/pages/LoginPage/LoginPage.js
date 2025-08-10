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
                    <span className="normal">완벽한 프로젝트 케미를</span>
                </div>
                
                <div className="button-group">
                    <button className="login-button">
                        이메일로 로그인하기
                    </button>
                    <button className="signup-button" onClick={handleSignup}>
                        회원가입
                    </button>
                </div>
                
                <div className="find-links">
                    <button className="find-links-button">
                        아이디 찾기 / 비밀번호 찾기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage; 