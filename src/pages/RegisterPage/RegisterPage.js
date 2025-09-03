import React, { useState, useEffect } from 'react';
import './RegisterPage.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sendVerificationCode, verifyCode, registerUser } from '../../services/auth.js';

function RegisterPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [university, setUniversity] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [department, setDepartment] = useState('');
    const [consents, setConsents] = useState({
        personalInfo: false,
        personalInfoProvision: false,
        age14: false,
        terms: false,
        rights: false
    });
    const [isVerificationLoading, setIsVerificationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // 이미 로그인된 사용자는 메인 페이지로 리디렉션
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/main');
        }
    }, [isAuthenticated, navigate]);

    const handleNext = () => {
        if (currentStep < 8) {
            if (currentStep === 3) {
                // case3에서 다음 버튼을 누르면 case4로 이동
                setCurrentStep(4);
                // 3초 후 case5로 자동 이동
                setTimeout(() => {
                    setCurrentStep(5);
                    // 추가로 2.5초 후 메인 페이지로 자동 이동
                    setTimeout(() => {
                        navigate('/main');
                    }, 2500);
                }, 3000);
            } else if (currentStep === 6) {
                // case6에서 완료 버튼을 누르면 case7로 이동
                setCurrentStep(7);
            } else {
                setCurrentStep(currentStep + 1);
            }
        } else {
            // 로그인 처리
            console.log('로그인 시도');
            // main 페이지로 이동
            navigate('/main');
        }
    };

    const handleConsentChange = (key) => {
        setConsents(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSendVerificationCode = async () => {
        // 입력값 검증
        if (!email.trim() || !department.trim()) {
            setVerificationError('이메일과 학부를 모두 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setVerificationError('올바른 이메일 형식이 아닙니다.');
            return;
        }
        
        try {
            setIsVerificationLoading(true);
            setVerificationError('');
            
            const result = await sendVerificationCode({
                email: email
            });
            
            if (result.success) {
                setVerificationSuccess(true);
                setVerificationError('');
            } else {
                setVerificationError(result.message || '인증번호 전송에 실패했습니다.');
            }
            
        } catch (error) {
            setVerificationError(error.message || '네트워크 오류가 발생했습니다.');
        } finally {
            setIsVerificationLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode.trim()) {
            setVerificationError('인증번호를 입력해주세요.');
            return;
        }

        if (verificationCode.length !== 6) {
            setVerificationError('인증번호는 6자리 숫자입니다.');
            return;
        }

        try {
            setIsVerificationLoading(true);
            setVerificationError('');

            const result = await verifyCode({
                email: email,
                code: verificationCode
            });

            if (result.success) {
                setVerificationSuccess(true);
                setVerificationError('');
                setIsEmailVerified(true);
                // 인증 성공 시 다음 단계로 자동 진행
                setTimeout(() => {
                    setCurrentStep(4);
                }, 2000);
            } else {
                setVerificationError(result.message || '인증번호 확인에 실패했습니다.');
            }

        } catch (error) {
            setVerificationError(error.message || '인증번호 확인 중 오류가 발생했습니다.');
        } finally {
            setIsVerificationLoading(false);
        }
    };

    const handleCompleteRegistration = async () => {
        if (!isEmailVerified) {
            setRegistrationError('이메일 인증을 먼저 완료해주세요.');
            return;
        }

        if (password !== passwordConfirm) {
            setRegistrationError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (password.length < 6) {
            setRegistrationError('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        try {
            setIsRegistrationLoading(true);
            setRegistrationError('');

            const registrationData = {
                email: email,
                password: password,
                university: university,
                department: department,
                student_id: studentId || null
            };

            console.log('Registration data:', registrationData);

            const result = await registerUser(registrationData);

            if (result.success || result.token) {
                console.log('Registration successful:', result);
                
                // AuthContext를 통해 자동 로그인 처리
                if (result.token && result.user) {
                    const loginSuccess = login(result.user, result.token);
                    
                    if (loginSuccess) {
                        console.log('회원가입 후 자동 로그인 성공');
                        // 회원가입 성공 시 완료 화면으로 이동
                        setCurrentStep(7);
                    } else {
                        setRegistrationError('회원가입은 완료되었지만 자동 로그인에 실패했습니다.');
                    }
                } else {
                    // 토큰이나 사용자 정보가 없는 경우에도 완료 화면 표시
                    setCurrentStep(7);
                }
            } else {
                setRegistrationError(result.message || '회원가입에 실패했습니다.');
            }

        } catch (error) {
            console.error('Registration error:', error);
            setRegistrationError(error.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsRegistrationLoading(false);
        }
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
                // 이메일 입력: 학부 + 이메일 + 인증번호
                return department.trim() && email.trim() && verificationCode.trim();
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
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                        </div>
                        <div className="step3-input-with-verify-button">
                            <input
                                type="email"
                                placeholder="대학 이메일을 입력해주세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button 
                                className={`verify-button ${email && department ? 'active' : ''}`}
                                onClick={handleSendVerificationCode}
                                disabled={!email || !department || isVerificationLoading}
                            >
                                {isVerificationLoading ? '전송 중...' : 
                                 email && department ? '인증번호 전송' : '인증하기'}
                            </button>
                        </div>
                        
                        {verificationError && (
                            <div className="verification-error">
                                ❌ {verificationError}
                            </div>
                        )}

                        {verificationSuccess && (
                            <div className="verification-success">
                                ✅ {verificationCode.trim() ? '인증이 완료되었습니다!' : '인증번호가 전송되었습니다!'}
                            </div>
                        )}
                        <div className="step3-input-field">
                            <input
                                type="text"
                                placeholder="인증번호를 입력해주세요"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                maxLength={6}
                                style={{ marginBottom: '8px' }}
                            />
                            <button 
                                className={`verify-code-button ${verificationCode.length === 6 ? 'active' : ''}`}
                                onClick={handleVerifyCode}
                                disabled={verificationCode.length !== 6 || isVerificationLoading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: verificationCode.length === 6 && !isVerificationLoading ? 'pointer' : 'not-allowed',
                                    backgroundColor: verificationCode.length === 6 && !isVerificationLoading ? '#F76241' : '#E0E0E0',
                                    color: verificationCode.length === 6 && !isVerificationLoading ? 'white' : '#999'
                                }}
                            >
                                {isVerificationLoading ? '확인 중...' : '인증번호 확인'}
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <div>
                            <p style={{
                                color: 'var(--main, #F76241)',
                                textAlign: 'center',
                                fontFamily: 'Pretendard',
                                fontSize: '23px',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal',
                                textTransform: 'capitalize',
                                marginTop: '330px'
                            }}>
                                대학인증을 진행중<span style={{ color: '#140805' }}>입니다!</span>
                            </p>
                            <p style={{
                                color: 'rgba(0, 0, 0, 0.69)',
                                textAlign: 'center',
                                fontFamily: 'Pretendard',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: '500',
                                lineHeight: 'normal',
                                textTransform: 'capitalize',
                                margin: '8px 0'
                            }}>
                                잠시만 기다려주세요!
                            </p>
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="16" viewBox="0 0 56 16" fill="none">
                                    <circle opacity="0.4" cx="4" cy="12" r="4" fill="#F76241"/>
                                    <circle opacity="0.6" cx="20" cy="4" r="4" fill="#F76241"/>
                                    <circle opacity="0.8" cx="36" cy="9" r="4" fill="#F76241"/>
                                    <circle cx="52" cy="12" r="4" fill="#F76241"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <div>
                            <div style={{
                                borderRadius: '30px',
                                background: '#F76241',
                                display: 'flex',
                                width: '60px',
                                height: '60px',
                                padding: '16px 9px',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                flexShrink: '0',
                                margin: '330px auto 25px'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21" fill="none">
                                    <path d="M2 8.54545L11.6571 18L28 2" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <p style={{
                                color: '#000',
                                textAlign: 'center',
                                fontFamily: 'Pretendard',
                                fontSize: '25px',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal',
                                textTransform: 'capitalize',
                                margin: '0 0 8px'
                            }}>
                                대학교 인증이 완료되었습니다!
                            </p>
                            <p style={{
                                color: 'var(--grey-3, #807C7C)',
                                textAlign: 'center',
                                fontFamily: 'Pretendard',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: 'normal',
                                textTransform: 'capitalize',
                                margin: '0'
                            }}>
                                인증 내역은{' '}
                                <span style={{
                                    color: 'var(--grey-3, #807C7C)',
                                    fontFamily: 'Pretendard',
                                    fontSize: '16px',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    lineHeight: 'normal',
                                    textDecorationLine: 'underline',
                                    textDecorationStyle: 'solid',
                                    textDecorationSkipInk: 'auto',
                                    textDecorationThickness: '4.5%',
                                    textUnderlineOffset: '25%',
                                    textUnderlinePosition: 'from-font',
                                    textTransform: 'capitalize'
                                }}>
                                    마이페이지
                                </span>
                                에서 볼 수 있어요.
                            </p>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="step-content">
                        <button
                                onClick={() => setCurrentStep(5)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    marginBottom: '24px',
                                    marginTop: '30px',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                                    <path d="M8.81641 1L1.99822 8.5L8.81641 16" stroke="#140805" strokeWidth="2"/>
                                </svg>
                        </button>
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
                                type="text"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    marginBottom: '8px'
                                }}
                            />
                        </div>
                        <div className="step4-input-field">
                            <input
                                type="text"
                                placeholder="비밀번호 확인"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                style={{
                                    marginBottom: '8px'
                                }}
                            />
                        </div>
                        {registrationError && (
                            <div className="verification-error" style={{ marginTop: '8px' }}>
                                ❌ {registrationError}
                            </div>
                        )}
                        <div style={{ marginTop: '9px' }}>
                            <button 
                                className={`next-button ${password === passwordConfirm && password.trim() && passwordConfirm.trim() ? 'active' : ''}`}
                                onClick={handleCompleteRegistration}
                                disabled={password !== passwordConfirm || !password.trim() || !passwordConfirm.trim() || isRegistrationLoading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: password === passwordConfirm && password.trim() && passwordConfirm.trim() && !isRegistrationLoading ? 'pointer' : 'not-allowed',
                                    backgroundColor: password === passwordConfirm && password.trim() && passwordConfirm.trim() && !isRegistrationLoading ? 'var(--main, #F76241)' : '#E0E0E0',
                                    color: password === passwordConfirm && password.trim() && passwordConfirm.trim() && !isRegistrationLoading ? 'white' : '#999'
                                }}
                            >
                                {isRegistrationLoading ? '가입 중...' : '완료'}
                            </button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div>
                        <div>
                            <div style={{
                                borderRadius: '30px',
                                background: '#F76241',
                                display: 'flex',
                                width: '60px',
                                height: '60px',
                                padding: '16px 9px',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                flexShrink: '0',
                                margin: '330px auto 24px'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21" fill="none">
                                    <path d="M2 8.54545L11.6571 18L28 2" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <p style={{
                                color: '#000',
                                textAlign: 'center',
                                fontFamily: 'Pretendard',
                                fontSize: '25px',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal',
                                textTransform: 'capitalize',
                                margin: '0 0 8px'
                            }}>
                                회원가입 완료!
                            </p>
                        </div>
                    </div>
                );
            case 8:
                return (
                    <div className="step-content">
                        <div>
                            <button 
                                onClick={() => setCurrentStep(7)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    marginBottom: '24px',
                                    marginTop: '30px'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                                    <path d="M8.81641 1L1.99822 8.5L8.81641 16" stroke="#140805" strokeWidth="2"/>
                                </svg>
                            </button>
                        </div>
                        <div style={{
                            color: '#000',
                            fontFamily: 'Pretendard',
                            fontSize: '24px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '36px',
                            marginBottom: '24px'
                        }}>
                            로그인
                        </div>
                        <div className="step4-input-field">
                            <input
                                type="email"
                                placeholder="학교 이메일"
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    marginBottom: '8px'
                                }}
                            />
                        </div>
                        <div className="step4-input-field">
                            <input
                                type="text"
                                placeholder="비밀번호"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="find-links">
                            <span style={{
                                color: '#807C7C',
                                fontFamily: 'Pretendard',
                                fontSize: '12px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: 'normal',
                            }}>
                                비밀번호를 잊어버리셨나요?
                            </span>
                        </div>
                        <div style={{ marginTop: '24px' }}>
                            <button 
                                className={`next-button ${email.trim() && password.trim() ? 'active' : ''}`}
                                onClick={handleNext}
                                disabled={!email.trim() || !password.trim()}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: email.trim() && password.trim() ? 'pointer' : 'not-allowed',
                                    backgroundColor: email.trim() && password.trim() ? 'var(--main, #F76241)' : '#E0E0E0',
                                    color: email.trim() && password.trim() ? 'white' : '#999'
                                }}
                            >
                                로그인
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`register-page-container ${currentStep === 4 || currentStep === 5 || currentStep === 7 ? 'bg-gray' : ''}`}>
                {currentStep !== 4 && currentStep !== 5 && currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && (
                 <div className="header">
                     <button className="close-button" onClick={() => navigate('/login')}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                             <path d="M16.4141 1.41406L9.62109 8.20703L16.4141 15L15 16.4141L8.20703 9.62109L1.41406 16.4141L0 15L6.79297 8.20703L0 1.41406L1.41406 0L8.20703 6.79297L15 0L16.4141 1.41406Z" fill="#140805"/>
                         </svg>
                     </button>
                 </div>
             )}
            <div className="main-content">
                {renderStep()}
            </div>
                         {currentStep !== 4 && currentStep !== 6 && currentStep !== 8 && (
                 <div className="bottom-button">
                     {currentStep === 5 ? (
                         <button 
                             className="next-button active"
                             onClick={() => setCurrentStep(6)}
                         >
                             닫기
                         </button>
                     ) : currentStep === 7 ? (
                         <button 
                             className="next-button active"
                             onClick={() => setCurrentStep(8)}
                         >
                             로그인 하기
                         </button>
                     ) : (
                         <button 
                             className={`next-button ${isNextButtonActive() ? 'active' : ''}`}
                             onClick={handleNext}
                             disabled={!isNextButtonActive()}
                         >
                             다음
                         </button>
                     )}
                 </div>
             )}
        </div>
    );
}

export default RegisterPage;
