import React, { useState } from 'react';
import './RegisterPage.scss';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [university, setUniversity] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [consents, setConsents] = useState({
        personalInfo: false,
        personalInfoProvision: false,
        age14: false,
        terms: false,
        rights: false
    });

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // 회원가입 완료 처리
            console.log('회원가입 완료');
            navigate('/login');
        }
    };

    const handleConsentChange = (key) => {
        setConsents(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isNextButtonActive = () => {
        switch (currentStep) {
            case 1:
                // 대학 검색: 대학 선택만
                return university.trim();
            case 2:
                // 약관 동의: 모든 필수 약관 동의
                return consents.personalInfo && 
                       consents.personalInfoProvision && 
                       consents.age14 && 
                       consents.terms && 
                       consents.rights;
            case 3:
                // 이메일 입력: 이메일 + 인증번호
                return email.trim() && verificationCode.trim();
            case 4:
                return password.trim() && passwordConfirm.trim();
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content">
                        <div className="progress-indicator">
                            <div className="progress-step active"></div>
                            <div className="progress-step"></div>
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>약관을 동의하면</p>
                            <p><span className="highlight">대학교 인증</span>을 시작합니다.</p>
                        </div>
                        <div className="input-group">
                            <label>대학 검색</label>
                            <div className="input-with-check">
                                <input
                                    type="text"
                                    placeholder="대학교 검색하기"
                                    value={university}
                                    onChange={(e) => setUniversity(e.target.value)}
                                />
                                {university.trim() && (
                                    <div className="check-icon">
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <div className="progress-indicator">
                            <div className="progress-step"></div>
                            <div className="progress-step active"></div>
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>약관을 동의하면</p>
                            <p><span className="highlight">대학교 인증</span>을 시작합니다.</p>
                        </div>
                        <div className="consent-sections">
                            <div className="consent-section">
                                <h3 className="consent-section-title">필수 동의 (서비스)</h3>
                                <div className="consent-items">
                                    <div className={`consent-item ${consents.personalInfo ? 'checked' : ''}`} onClick={() => handleConsentChange('personalInfo')}>
                                        <div className="check-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                                <path d="M14.5537 0.918916C15.1428 0.438799 16.0115 0.473407 16.5605 1.02243C17.1096 1.57146 17.1442 2.44012 16.664 3.02927L16.5605 3.14353L7.22752 12.4765C6.64174 13.0623 5.69222 13.0623 5.10643 12.4765L0.439439 7.81052L0.335923 7.69626C-0.144314 7.10716 -0.109491 6.23852 0.439439 5.68942C0.988513 5.14035 1.85712 5.10566 2.44627 5.58591L2.56053 5.68942L6.166 9.29489L14.4394 1.02243L14.5537 0.918916Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <span>개인 정보 수집/이용 동의</span>
                                        <div className="arrow-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                                <path d="M1.2607 13.175C0.781753 12.7396 0.718796 12.0175 1.09566 11.508L1.17671 11.4094L5.41206 6.75021L1.17671 2.09103C0.712342 1.58023 0.74992 0.789797 1.2607 0.325407C1.7715 -0.138962 2.56193 -0.101384 3.02632 0.409391L7.41499 5.23654C8.14648 6.04118 8.1919 7.24359 7.55171 8.09787L7.41499 8.26388L3.02632 13.091L2.9355 13.1809C2.46414 13.6043 1.73962 13.6104 1.2607 13.175Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className={`consent-item ${consents.personalInfoProvision ? 'checked' : ''}`} onClick={() => handleConsentChange('personalInfoProvision')}>
                                        <div className="check-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                                <path d="M14.5537 0.918916C15.1428 0.438799 16.0115 0.473407 16.5605 1.02243C17.1096 1.57146 17.1442 2.44012 16.664 3.02927L16.5605 3.14353L7.22752 12.4765C6.64174 13.0623 5.69222 13.0623 5.10643 12.4765L0.439439 7.81052L0.335923 7.69626C-0.144314 7.10716 -0.109491 6.23852 0.439439 5.68942C0.988513 5.14035 1.85712 5.10566 2.44627 5.58591L2.56053 5.68942L6.166 9.29489L14.4394 1.02243L14.5537 0.918916Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <span>개인 정보 제공 동의</span>
                                        <div className="arrow-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                                <path d="M1.2607 13.175C0.781753 12.7396 0.718796 12.0175 1.09566 11.508L1.17671 11.4094L5.41206 6.75021L1.17671 2.09103C0.712342 1.58023 0.74992 0.789797 1.2607 0.325407C1.7715 -0.138962 2.56193 -0.101384 3.02632 0.409391L7.41499 5.23654C8.14648 6.04118 8.1919 7.24359 7.55171 8.09787L7.41499 8.26388L3.02632 13.091L2.9355 13.1809C2.46414 13.6043 1.73962 13.6104 1.2607 13.175Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className={`consent-item ${consents.age14 ? 'checked' : ''}`} onClick={() => handleConsentChange('age14')}>
                                        <div className="check-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                                <path d="M14.5537 0.918916C15.1428 0.438799 16.0115 0.473407 16.5605 1.02243C17.1096 1.57146 17.1442 2.44012 16.664 3.02927L16.5605 3.14353L7.22752 12.4765C6.64174 13.0623 5.69222 13.0623 5.10643 12.4765L0.439439 7.81052L0.335923 7.69626C-0.144314 7.10716 -0.109491 6.23852 0.439439 5.68942C0.988513 5.14035 1.85712 5.10566 2.44627 5.58591L2.56053 5.68942L6.166 9.29489L14.4394 1.02243L14.5537 0.918916Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <span>만 14세 이상</span>
                                        <div className="arrow-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                                <path d="M1.2607 13.175C0.781753 12.7396 0.718796 12.0175 1.09566 11.508L1.17671 11.4094L5.41206 6.75021L1.17671 2.09103C0.712342 1.58023 0.74992 0.789797 1.2607 0.325407C1.7715 -0.138962 2.56193 -0.101384 3.02632 0.409391L7.41499 5.23654C8.14648 6.04118 8.1919 7.24359 7.55171 8.09787L7.41499 8.26388L3.02632 13.091L2.9355 13.1809C2.46414 13.6043 1.73962 13.6104 1.2607 13.175Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="consent-section">
                                <div className="consent-section-title">필수 동의 (약관 및 인증)</div>
                                <div className="consent-items">
                                    <div className={`consent-item ${consents.terms ? 'checked' : ''}`} onClick={() => handleConsentChange('terms')}>
                                        <div className="check-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                                <path d="M14.5537 0.918916C15.1428 0.438799 16.0115 0.473407 16.5605 1.02243C17.1096 1.57146 17.1442 2.44012 16.664 3.02927L16.5605 3.14353L7.22752 12.4765C6.64174 13.0623 5.69222 13.0623 5.10643 12.4765L0.439439 7.81052L0.335923 7.69626C-0.144314 7.10716 -0.109491 6.23852 0.439439 5.68942C0.988513 5.14035 1.85712 5.10566 2.44627 5.58591L2.56053 5.68942L6.166 9.29489L14.4394 1.02243L14.5537 0.918916Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <span>개인 정보 수집/이용 동의</span>
                                        <div className="arrow-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                                <path d="M1.2607 13.175C0.781753 12.7396 0.718796 12.0175 1.09566 11.508L1.17671 11.4094L5.41206 6.75021L1.17671 2.09103C0.712342 1.58023 0.74992 0.789797 1.2607 0.325407C1.7715 -0.138962 2.56193 -0.101384 3.02632 0.409391L7.41499 5.23654C8.14648 6.04118 8.1919 7.24359 7.55171 8.09787L7.41499 8.26388L3.02632 13.091L2.9355 13.1809C2.46414 13.6043 1.73962 13.6104 1.2607 13.175Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className={`consent-item ${consents.rights ? 'checked' : ''}`} onClick={() => handleConsentChange('rights')}>
                                        <div className="check-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                                                <path d="M14.5537 0.918916C15.1428 0.438799 16.0115 0.473407 16.5605 1.02243C17.1096 1.57146 17.1442 2.44012 16.664 3.02927L16.5605 3.14353L7.22752 12.4765C6.64174 13.0623 5.69222 13.0623 5.10643 12.4765L0.439439 7.81052L0.335923 7.69626C-0.144314 7.10716 -0.109491 6.23852 0.439439 5.68942C0.988513 5.14035 1.85712 5.10566 2.44627 5.58591L2.56053 5.68942L6.166 9.29489L14.4394 1.02243L14.5537 0.918916Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <span>개인 정보 제공 동의</span>
                                        <div className="arrow-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                                <path d="M1.2607 13.175C0.781753 12.7396 0.718796 12.0175 1.09566 11.508L1.17671 11.4094L5.41206 6.75021L1.17671 2.09103C0.712342 1.58023 0.74992 0.789797 1.2607 0.325407C1.7715 -0.138962 2.56193 -0.101384 3.02632 0.409391L7.41499 5.23654C8.14648 6.04118 8.1919 7.24359 7.55171 8.09787L7.41499 8.26388L3.02632 13.091L2.9355 13.1809C2.46414 13.6043 1.73962 13.6104 1.2607 13.175Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <div className="progress-indicator">
                            <div className="progress-step"></div>
                            <div className="progress-step active"></div>
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>인증 시 필요한</p>
                            <p><span className="highlight">대학 메일을 입력</span>해주세요.</p>
                        </div>
                        <div className="step3-input-with-check">
                            <span className="step3-input-with-check-text">{`${university}`}</span>
                            <span className="check-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className="step3-input-field">
                            <input
                                type="text"
                                placeholder="학부를 입력해주세요"
                            />
                        </div>
                        <div className="step3-input-with-verify-button">
                            <input
                                type="email"
                                placeholder="대학 이메일을 입력해주세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className={`verify-button ${email ? 'active' : ''}`}>
                                {email ? '인증번호 전송' : '인증하기'}
                            </button>
                        </div>
                        <div className="step3-input-field">
                            <input
                                type="text"
                                placeholder="인증번호를 입력해주세요"
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step-content">
                        <div className="progress-indicator">
                            <div className="progress-step"></div>
                            <div className="progress-step"></div>
                            <div className="progress-step active"></div>
                        </div>
                        <div className="step-description">
                            <p>로그인 시 사용할</p>
                            <p><span className="highlight">비밀번호</span>를 입력해주세요.</p>
                        </div>
                        <div className="step4-input-field">
                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="step4-input-field">
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="register-page-container">
            <div className="header">
                <button className="close-button" onClick={() => navigate('/login')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M16.4141 1.41406L9.62109 8.20703L16.4141 15L15 16.4141L8.20703 9.62109L1.41406 16.4141L0 15L6.79297 8.20703L0 1.41406L1.41406 0L8.20703 6.79297L15 0L16.4141 1.41406Z" fill="#140805"/>
                    </svg>
                </button>
            </div>
            <div className="main-content">
                {renderStep()}
            </div>
            <div className="bottom-button">
                <button 
                    className={`next-button ${isNextButtonActive() ? 'active' : ''}`}
                    onClick={handleNext}
                    disabled={!isNextButtonActive()}
                >
                    {currentStep === 4 ? '회원가입 완료' : '다음'}
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;
