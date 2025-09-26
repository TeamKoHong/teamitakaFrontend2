import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/auth';
import './LoginPage.scss';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, error: authError } = useAuth();
    
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // 이미 로그인된 상태면 메인 페이지로 리디렉션
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/main');
        }
    }, [isAuthenticated, navigate]);

    const handleSignup = () => {
        navigate('/register');
    };

    const handleGuestMode = () => {
        navigate('/main');
    };

    const handleShowLoginForm = () => {
        setShowLoginForm(true);
        setLoginError('');
    };

    const handleBackToMain = () => {
        setShowLoginForm(false);
        setEmail('');
        setPassword('');
        setLoginError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // 중복 제출 방지
        if (isLoginLoading || isLoading) {
            return;
        }
        
        // 입력 검증
        if (!email.trim() || !password.trim()) {
            setLoginError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLoginError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            setIsLoginLoading(true);
            setLoginError('');

            const loginData = {
                email: email.trim(),
                password: password
            };

            console.log('로그인 시도:', { email: loginData.email });

            const result = await loginUser(loginData);

            if (result.success && result.token && result.user) {
                // AuthContext를 통해 로그인 상태 업데이트
                const success = login(result.user, result.token);
                
                if (success) {
                    console.log('로그인 성공, 메인 페이지로 이동');
                    navigate('/main');
                } else {
                    setLoginError('로그인 정보 저장에 실패했습니다.');
                }
            } else {
                setLoginError(result.message || '로그인에 실패했습니다.');
            }

        } catch (error) {
            console.error('로그인 오류:', error);
            setLoginError(error.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoginLoading(false);
        }
    };

    const isFormValid = email.trim() && password.trim();

    if (showLoginForm) {
        return (
            <div className="login-page-container">
                <div className="login-form-content">
                    <div className="login-header">
                        <button 
                            onClick={handleBackToMain}
                            className="back-button"
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '4px',
                                cursor: 'pointer',
                                marginBottom: '24px'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                                <path d="M8.81641 1L1.99822 8.5L8.81641 16" stroke="#140805" strokeWidth="2"/>
                            </svg>
                        </button>
                        <h1 style={{
                            color: '#000',
                            fontFamily: 'Pretendard',
                            fontSize: '24px',
                            fontWeight: '600',
                            lineHeight: '36px',
                            marginBottom: '32px'
                        }}>
                            로그인
                        </h1>
                    </div>

                    <form onSubmit={handleLogin} autoComplete="on">
                        <div className="input-field" style={{ marginBottom: '16px' }}>
                            <input
                                type="email"
                                placeholder="학교 이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #E0E0E0',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        
                        <div className="input-field" style={{ marginBottom: '8px' }}>
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #E0E0E0',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div className="find-links" style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <span style={{
                                color: '#807C7C',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}>
                                비밀번호를 잊어버리셨나요?
                            </span>
                        </div>

                        {(loginError || authError) && (
                            <div style={{
                                color: '#F76241',
                                fontSize: '14px',
                                marginBottom: '16px',
                                textAlign: 'center'
                            }}>
                                ❌ {loginError || authError}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={!isFormValid || isLoginLoading || isLoading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: (isFormValid && !isLoginLoading && !isLoading) ? 'pointer' : 'not-allowed',
                                backgroundColor: (isFormValid && !isLoginLoading && !isLoading) ? '#F76241' : '#E0E0E0',
                                color: (isFormValid && !isLoginLoading && !isLoading) ? 'white' : '#999'
                            }}
                        >
                            {isLoginLoading || isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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
                <div className="look-without-register" onClick={handleGuestMode}>
                    회원가입 없이 둘러볼래요
                </div>
            </div>
        </div>
    );
}

export default LoginPage; 