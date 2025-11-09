import React, { useRef, useState, useEffect } from 'react';
import './RegisterPage.scss';
import './RegisterPage.step2.scss';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sendVerificationCode } from '../../services/auth.js';
import VerificationLoading from '../../components/Common/VerificationLoading';

function RegisterPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showTermsPage, setShowTermsPage] = useState(false);
    const [currentTermsType, setCurrentTermsType] = useState('');
    const isValidEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };
    const isValidPassword = (value) => {
        // 영문과 숫자를 모두 포함하고 8자 이상
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(value);
    };

    const codeInputRef = useRef(null);

    const handleBackClick = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const [consents, setConsents] = useState({
        all: false,
        terms: false,
        privacy: false,
        marketing: false,
        thirdParty: false
    });
    const [isVerificationLoading, setIsVerificationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [verificationErrorCode, setVerificationErrorCode] = useState('');

    // 이미 로그인된 사용자는 메인 페이지로 리디렉션
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/main');
        }
    }, [isAuthenticated, navigate]);

    const handleNext = () => {
        if (currentStep < 8) {
            if (currentStep === 3) {
                // 인증코드 입력 완료 → 완료 화면으로 이동
                setCurrentStep(4);
            } else if (currentStep === 6) {
                // case6에서 완료 버튼을 누르면 case7로 이동
                navigate('/login');
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
        if (key === 'all') {
            const newAllValue = !consents.all;
            setConsents({
                all: newAllValue,
                terms: newAllValue,
                privacy: newAllValue,
                marketing: newAllValue,
                thirdParty: newAllValue
            });
        } else {
            const newConsents = {
                ...consents,
                [key]: !consents[key]
            };
            
            // 개별 체크박스 변경 시 전체 동의 상태 업데이트
            const allChecked = newConsents.terms && newConsents.privacy && newConsents.marketing && newConsents.thirdParty;
            newConsents.all = allChecked;
            
            setConsents(newConsents);
        }
    };

    const handleResendCode = () => {
        setShowToast(true);
        // 3초 후 토스트 메시지 숨기기
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleTermsClick = (termsType) => {
        setCurrentTermsType(termsType);
        setShowTermsPage(true);
    };

    const handleBackToRegister = () => {
        setShowTermsPage(false);
        setCurrentTermsType('');
    };

    const getTermsContent = (termsType) => {
        switch (termsType) {
            case 'terms':
                return {
                    title: '서비스 이용 약관',
                    subtitle: '1. (필수) 서비스 이용약관',
                    content: `제1조 (목적)
본 약관은 티미타카(이하 본사)가 제공하는 서비스의 이용과 관련하여, 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"라 함은 회사가 제공하는 모든 온라인/모바일 기반 기능을 말합니다.
2. "이용자"라 함은 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 의미합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.
2. 회사는 필요 시 관련 법령을 위반하지 않는 범위 내에서 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.

제4조 (회원가입 및 계정 관리)
1. 이용자는 회사가 정한 절차에 따라 회원가입을 신청하고, 회사가 이를 승낙함으로써 회원이 됩니다.
2. 회원은 자신의 계정 정보를 정확히 관리해야 하며, 타인에게 양도·대여할 수 없습니다.

제5조 (서비스의 제공 및 변경)
1. 회사는 안정적인 서비스를 제공하기 위해 노력합니다.
2. 회사는 서비스의 일부 또는 전부를 변경·중단할 수 있으며, 사전에 공지합니다.

제6조 (이용자의 의무)
1. 타인의 계정을 도용하거나 허위 정보를 입력해서는 안 됩니다.
2. 서비스 운영을 방해하는 행위를 해서는 안 됩니다.

제7조 (회사의 책임 제한)
1. 회사는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
2. 회사는 이용자의 귀책 사유로 발생한 손해에 대해서는 책임을 지지 않습니다.

제8조 (준거법 및 관할법원)
본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 회사 본점 소재지를 관할하는 법원을 전속 관할법원으로 합니다.`
                };
            case 'privacy':
                return {
                    title: '개인정보 처리방침',
                    subtitle: '2. (필수) 개인정보 처리방침',
                    content: `제1조 (개인정보의 처리목적)
회사는 다음의 목적을 위해 개인정보를 수집·이용합니다.
 · 회원 가입 및 본인 확인
 · 서비스 제공 및 맞춤형 기능 제공
 · 고객 문의 응대 및 공지사항 전달

제2조 (수집하는 개인정보 항목)
 · 필수: 이름, 이메일, 비밀번호, 학교 이메일 인증 값
 · 선택: 프로필 사진

제3조 (개인정보의 보관 및 이용 기간)
 · 회원 탈퇴 시 즉시 파기
 · 법령에서 정한 기간 동안 보존해야 하는 경우, 해당 기간 동안 보관

제4조 (개인정보 제3자 제공)
회사는 이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 따라 요청이 있는 경우는 예외로 합니다.

제5조 (개인정보 처리 위탁)
서비스 운영을 위해 일부 업무를 외부에 위탁할 수 있으며, 이 경우 이용자에게 고지합니다.

제6조 (이용자의 권리와 행사 방법)
이용자는 언제든지 자신의 개인정보를 열람·정정·삭제할 수 있습니다.`
                };
            case 'marketing':
                return {
                    title: '마케팅 정보 수신 동의',
                    subtitle: '3. (선택) 마케팅 정보 수신 동의',
                    content: `제1조 (마케팅 활용 목적)
회사는 서비스 관련 혜택, 이벤트, 프로모션, 신규 기능 안내 등을 이메일, 앱 알림 등을 통해 발송할 수 있습니다.

제2조 (수집 항목)
 · 이메일 주소, 앱 푸시 토큰

제3조 (동의 철회)
 · 이용자는 언제든지 [알림]에서 수신 동의를 철회할 수 있습니다.
 · 철회 시 마케팅 정보 발송은 중단되며, 필수 서비스 공지는 계속 발송될 수 있습니다.`
                };
            case 'thirdParty':
                return {
                    title: '제 3자 제공 동의',
                    subtitle: '4. (선택) 제3자 제공 동의',
                    content: `제1조 (제3자 제공 목적)
회사는 서비스 품질 향상 및 제휴 서비스 제공을 위하여 이용자의 개인정보를 제3자에게 제공할 수 있습니다.

제2조 (제공 항목 및 대상)
 · 제공 항목: 이메일, 이름, 서비스 이용 기록 일부
 · 제공 대상: 제휴 콘텐츠 업체, 광고 파트너사

제3조 (보관 및 이용 기간)
 · 제공 시 명시된 목적 달성 시까지
 · 법령상 의무가 있는 경우 해당 기간 동안 보관

제4조 (동의 철회)
 · 이용자는 언제든지 제3자 제공 동의를 철회할 수 있으며, 철회 즉시 제3자 제공이 중단됩니다.`
                };
            default:
                return { title: '', subtitle: '', content: '' };
        }
    };

    const handleSendVerificationCode = async () => {
        // 입력값 검증
        if (!email.trim()) {
            setVerificationError('이메일을 입력해주세요.');
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

            const result = await sendVerificationCode(email);

            // 성공 시 인증번호 입력 페이지로 이동
            if (result.success || result.message) {
                setVerificationError('');
                // 성공 시에만 다음 화면으로 이동
                setCurrentStep(3);
            } else {
                setVerificationError(result.message || '인증번호 전송에 실패했습니다.');
            }

        } catch (error) {
            console.error('인증번호 전송 에러:', error);

            // 409 Conflict: 중복 이메일 에러 처리
            if (error.code === 'DUPLICATE_EMAIL' || error.statusCode === 409) {
                setVerificationError('이미 가입된 이메일입니다.');
                setVerificationErrorCode('DUPLICATE_EMAIL');
                // 다음 페이지로 이동하지 않음
                return;
            }

            // 429 Too Many Requests: Rate Limiting 초과
            if (error.code === 'RATE_LIMITED' || error.statusCode === 429) {
                setVerificationError('요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.');
                setVerificationErrorCode('RATE_LIMITED');
                return;
            }

            // 400 Bad Request: 이메일 형식 오류
            if (error.code === 'INVALID_EMAIL' || error.statusCode === 400) {
                setVerificationError(error.message || '유효하지 않은 이메일 형식입니다.');
                setVerificationErrorCode('INVALID_EMAIL');
                return;
            }

            // 일일 한도 초과 에러 처리
            if (error.message && error.message.includes('하루 최대')) {
                setVerificationError('하루 최대 5회까지만 인증번호를 전송할 수 있습니다. 내일 다시 시도해주세요.');
                setVerificationErrorCode('DAILY_LIMIT');
            } else {
                setVerificationError(error.message || '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
                setVerificationErrorCode('NETWORK_ERROR');
            }
        } finally {
            setIsVerificationLoading(false);
        }
    };

    // 인증번호 확인 및 회원가입 완료 함수들은 현재 미사용 (향후 구현 예정)

    const isNextButtonActive = () => {
        switch (currentStep) {
            case 1:
                // 필수 항목만 체크되면 활성화
                return consents.terms && consents.privacy;
            case 2:
                // 약관 동의: 모든 필수 약관 동의
                return consents.personalInfo && 
                       consents.personalInfoProvision && 
                       consents.age14 && 
                       consents.terms && 
                       consents.rights;
            case 3:
                // 인증 코드: 6자리 모두 입력되면 활성화
                return verificationCode.trim().length === 6;
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
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>서비스 이용을 위해</p>
                            <p>약관에 동의해주세요.</p>
                        </div>
                        <div className="step-description-sub">
                            <p>필수 항목에 동의해야 가입할 수 있습니다.</p>
                        </div>
                        
                        <div className="consent-section">
                            <div className={`consent-item all-consent ${consents.all ? 'checked' : ''}`} onClick={() => handleConsentChange('all')}>
                                <div className={`checkbox all-checkbox ${consents.all ? 'checked' : ''}`}>
                                    <img
                                        src={consents.all ? '/check__active.png' : '/check__inactive.png'}
                                        alt="전체 동의 체크"
                                        className="check-image"
                                    />
                                </div>
                                <span className="consent-text">전체 동의</span>
                            </div>
                            
                            <div className={`consent-item ${consents.terms ? 'checked' : ''}`} onClick={() => handleConsentChange('terms')}>
                                <div className="checkbox-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                                        <path d="M14.4393 1.27284C15.025 0.68705 15.9746 0.68705 16.5604 1.27284C17.1461 1.85862 17.1461 2.80814 16.5604 3.39393L7.22734 12.7269C6.64156 13.3127 5.69204 13.3127 5.10625 12.7269L0.439258 8.06092C-0.146474 7.47519 -0.146365 6.52563 0.439258 5.93983C1.02504 5.35404 1.97457 5.35404 2.56035 5.93983L6.16582 9.5453L14.4393 1.27284Z" fill={consents.terms ? "#F76241" : "#807C7C"}/>
                                    </svg>
                                </div>
                                <span className="consent-text">
                                    <span className="consent-label">[필수]</span>
                                    <span className="consent-content"> 서비스 이용약관 동의</span>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none" onClick={() => handleTermsClick('terms')} style={{cursor: 'pointer'}}>
                                    <path d="M2 12.5L6.38848 7.67267C6.73523 7.29125 6.73523 6.70875 6.38848 6.32733L2 1.5" stroke={consents.terms ? "#F76241" : "#807C7C"} strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                            
                            <div className={`consent-item ${consents.privacy ? 'checked' : ''}`} onClick={() => handleConsentChange('privacy')}>
                                <div className="checkbox-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                                        <path d="M14.4393 1.27284C15.025 0.68705 15.9746 0.68705 16.5604 1.27284C17.1461 1.85862 17.1461 2.80814 16.5604 3.39393L7.22734 12.7269C6.64156 13.3127 5.69204 13.3127 5.10625 12.7269L0.439258 8.06092C-0.146474 7.47519 -0.146365 6.52563 0.439258 5.93983C1.02504 5.35404 1.97457 5.35404 2.56035 5.93983L6.16582 9.5453L14.4393 1.27284Z" fill={consents.privacy ? "#F76241" : "#807C7C"}/>
                                    </svg>
                                </div>
                                <span className="consent-text">
                                    <span className="consent-label">[필수]</span>
                                    <span className="consent-content"> 개인정보 처리방침 동의</span>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none" onClick={() => handleTermsClick('privacy')} style={{cursor: 'pointer'}}>
                                    <path d="M2 12.5L6.38848 7.67267C6.73523 7.29125 6.73523 6.70875 6.38848 6.32733L2 1.5" stroke={consents.privacy ? "#F76241" : "#807C7C"} strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                            
                            <div className={`consent-item ${consents.marketing ? 'checked' : ''}`} onClick={() => handleConsentChange('marketing')}>
                                <div className="checkbox-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                                        <path d="M14.4393 1.27284C15.025 0.68705 15.9746 0.68705 16.5604 1.27284C17.1461 1.85862 17.1461 2.80814 16.5604 3.39393L7.22734 12.7269C6.64156 13.3127 5.69204 13.3127 5.10625 12.7269L0.439258 8.06092C-0.146474 7.47519 -0.146365 6.52563 0.439258 5.93983C1.02504 5.35404 1.97457 5.35404 2.56035 5.93983L6.16582 9.5453L14.4393 1.27284Z" fill={consents.marketing ? "#F76241" : "#807C7C"}/>
                                    </svg>
                                </div>
                                <span className="consent-text">
                                    <span className="consent-label">[선택]</span>
                                    <span className="consent-content"> 마케팅 정보 수신 동의</span>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none" onClick={() => handleTermsClick('marketing')} style={{cursor: 'pointer'}}>
                                    <path d="M2 12.5L6.38848 7.67267C6.73523 7.29125 6.73523 6.70875 6.38848 6.32733L2 1.5" stroke={consents.marketing ? "#F76241" : "#807C7C"} strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                            
                            <div className={`consent-item ${consents.thirdParty ? 'checked' : ''}`} onClick={() => handleConsentChange('thirdParty')}>
                                <div className="checkbox-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
                                        <path d="M14.4393 1.27284C15.025 0.68705 15.9746 0.68705 16.5604 1.27284C17.1461 1.85862 17.1461 2.80814 16.5604 3.39393L7.22734 12.7269C6.64156 13.3127 5.69204 13.3127 5.10625 12.7269L0.439258 8.06092C-0.146474 7.47519 -0.146365 6.52563 0.439258 5.93983C1.02504 5.35404 1.97457 5.35404 2.56035 5.93983L6.16582 9.5453L14.4393 1.27284Z" fill={consents.thirdParty ? "#F76241" : "#807C7C"}/>
                                    </svg>
                                </div>
                                <span className="consent-text">
                                    <span className="consent-label">[선택]</span>
                                    <span className="consent-content"> 제3자 제공 동의</span>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none" onClick={() => handleTermsClick('thirdParty')} style={{cursor: 'pointer'}}>
                                    <path d="M2 12.5L6.38848 7.67267C6.73523 7.29125 6.73523 6.70875 6.38848 6.32733L2 1.5" stroke={consents.thirdParty ? "#F76241" : "#807C7C"} strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        {isVerificationLoading && <VerificationLoading />}
                        <div className="progress-indicator">
                            <div className="progress-step completed"></div>
                            <div className="progress-step active"></div>
                            <div className="progress-step"></div>
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>학생 인증을 위해</p>
                            <p>학교 이메일을 입력해주세요.</p>
                        </div>
                        <div className="step-description-sub">
                            <p>티미타카는 학교 이메일로만 가입할 수 있습니다.</p>
                        </div>
                        <div className="step-description-small">
                            <p>학교 이메일 입력</p>
                        </div>
                        <div className="standard-input-field">
                            <input
                                type="email"
                                placeholder="본인 명의의 학교 이메일을 입력해주세요."
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    // 이메일 입력 시 에러 메시지 초기화
                                    if (verificationError) {
                                        setVerificationError('');
                                        setVerificationErrorCode('');
                                    }
                                }}
                                disabled={isVerificationLoading}
                            />
                        </div>
                        {email && !isValidEmail(email) && !verificationError && (
                            <div className="input-error-text" role="alert">
                                ⚠️ 올바른 이메일 형식을 입력해주세요.
                            </div>
                        )}
                        {verificationError && (
                            <div className="input-error-text" role="alert" aria-live="polite">
                                {verificationErrorCode === 'DUPLICATE_EMAIL' && '⚠️ '}
                                {verificationErrorCode === 'RATE_LIMITED' && '⏱️ '}
                                {verificationErrorCode === 'INVALID_EMAIL' && '⚠️ '}
                                {verificationErrorCode === 'NETWORK_ERROR' && '🔌 '}
                                {verificationError}
                                {verificationErrorCode === 'DUPLICATE_EMAIL' && (
                                    <div style={{ marginTop: '8px', fontSize: '14px' }}>
                                        이미 계정이 있으신가요? <Link to="/login" style={{ color: '#F76241', textDecoration: 'underline' }}>로그인하기</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <div className="progress-indicator">
                            <div className="progress-step completed"></div>
                            <div className="progress-step active"></div>
                            <div className="progress-step"></div>
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>입력하신 이메일로 받은</p>
                            <p>인증 코드를 입력해주세요.</p>
                        </div>
                        <div className="step-description-sub">
                            <p>인증 코드를 이메일로 보냈습니다.</p>
                        </div>
                        <div className="step-description-small">
                            <p>인증 코드 입력</p>
                        </div>
                        <div className="code-input-wrapper" onClick={() => codeInputRef.current && codeInputRef.current.focus()}>
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="code-box">
                                    {verificationCode[idx] || ''}
                                </div>
                            ))}
                            <input
                                ref={codeInputRef}
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                className="code-hidden-input"
                            />
                        </div>
                        <div className="resend-code-link" onClick={handleResendCode}>코드 다시 받기</div>
                        {showToast && (
                            <div className="toast-message">
                                <div className="toast-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17" fill="none">
                                        <path d="M19.4501 0.978472C19.9877 0.420763 20.8752 0.40458 21.4332 0.941933C21.9913 1.47951 22.0083 2.36787 21.4707 2.92597L8.85762 16.0213C8.59314 16.2959 8.22765 16.4507 7.84641 16.4507C7.46536 16.4506 7.10053 16.2957 6.83613 16.0213L0.529591 9.47366C-0.00787739 8.91566 0.00834407 8.02723 0.56613 7.48962C1.12413 6.95215 2.01256 6.96837 2.55017 7.52616L7.84641 13.0243L19.4501 0.978472Z" fill="#FFFDFC"/>
                                    </svg>
                                </div>
                                <span className="toast-text">인증 코드를 전송했습니다.</span>
                            </div>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="step-content">
                        <div className="progress-indicator">
                            <div className="progress-step completed"></div>
                            <div className="progress-step active"></div>
                            <div className="progress-step"></div>
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>입력하신 이메일로 받은</p>
                            <p>인증 코드를 입력해주세요.</p>
                        </div>
                        <div className="step-description-sub">
                            <p>인증 코드를 이메일로 보냈습니다.</p>
                        </div>
                        <div></div>
                        <div style={{ textAlign: 'center', marginTop: '122px' }}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img src="/Star 92.png" alt="star" style={{ width: '64px', height: '64px' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17" fill="none">
                                        <path d="M19.4501 0.978472C19.9877 0.420763 20.8752 0.40458 21.4332 0.941933C21.9913 1.47951 22.0083 2.36787 21.4707 2.92597L8.85762 16.0213C8.59314 16.2959 8.22765 16.4507 7.84641 16.4507C7.46536 16.4506 7.10053 16.2957 6.83613 16.0213L0.529591 9.47366C-0.00787739 8.91566 0.00834407 8.02723 0.56613 7.48962C1.12413 6.95215 2.01256 6.96837 2.55017 7.52616L7.84641 13.0243L19.4501 0.978472Z" fill="#140805"/>
                                    </svg>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', color: '#140805', textAlign: 'center', fontFamily: 'Pretendard', fontSize: '25px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal' }}>
                                대학교 인증 완료
                            </div>
                            <div style={{ marginTop: '4px', color: '#807C7C', textAlign: 'center', fontFamily: 'Pretendard', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal' }}>
                                2022.03.10 부로 인증되었습니다.
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="step-content">
                        <div className="progress-indicator">
                            <div className="progress-step completed"></div>
                            <div className="progress-step completed"></div>
                            <div className="progress-step active"></div>
                            <div className="progress-step"></div>
                        </div>
                        <div className="step-description">
                            <p>계정 보안을 위한</p>
                            <p>비밀번호를 설정하세요</p>
                        </div>
                        <div className="step-description-sub">
                            <p>비밀번호를 설정하세요.</p>
                        </div>
                        <div className='step-description-small'>
                            <p>비밀번호 설정</p>
                        </div>
                        <div className='standard-input-field'>
                             <input
                                 type="password"
                                 placeholder="비밀번호 입력 (영문+숫자 8자 이상)"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                             />
                         </div>
                         <div className='standard-input-field'>
                             <input
                                 type="password"
                                 placeholder="비밀번호 확인"
                                 value={passwordConfirm}
                                 onChange={(e) => setPasswordConfirm(e.target.value)}
                             />
                        </div>
                        {(() => {
                            const hasAnyInput = password.trim() !== '' || passwordConfirm.trim() !== '';
                            if (!hasAnyInput) return null;
                            if (!isValidPassword(password)) {
                                return <div className='input-error-text'>비밀번호는 영문, 숫자를 혼용해 8자 이상으로 설정하세요.</div>;
                            }
                            if (passwordConfirm.trim() === '') {
                                return <div className='input-error-text'>비밀번호를 한번 더 입력해 확인해주세요.</div>;
                            }
                            if (password !== passwordConfirm) {
                                return <div className='input-error-text'>비밀번호가 일치하지 않습니다.</div>;
                            }
                            return null;
                        })()}
                    </div>
                );
            case 6:
                return (
                    <div>
                        <div>
                            <div style={{
                                borderRadius: '28.5px',
                                background: '#F76241',
                                display: 'flex',
                                width: '57px',
                                height: '57px',
                                padding: '20px 17px',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                flexShrink: '0',
                                margin: '330px auto 16px'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
                                    <path d="M8.16137 15.0385C7.90176 15.2944 7.48474 15.2944 7.22514 15.0385L0.975385 8.87736C0.438962 8.34854 0.438962 7.48306 0.975385 6.95424C1.50109 6.43599 2.34554 6.43599 2.87124 6.95424L7.69325 11.7079L19.1288 0.434491C19.6545 -0.0837587 20.4989 -0.0837579 21.0246 0.434492C21.561 0.963311 21.561 1.82879 21.0246 2.35761L8.16137 15.0385Z" fill="#FFFDFC"/>
                                </svg>
                            </div>
                            <p style={{
                                color: '#140805',
                                textAlign: 'center',
                                fontFamily: 'Pretendard',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: '600',
                                lineHeight: 'normal',
                                textTransform: 'capitalize',
                                margin: '0 0 8px'
                            }}>
                                회원가입 완료!
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (showTermsPage) {
        return (
            <div className="terms-page-container">
                <div className="terms-header">
                    <button className="back-button" onClick={handleBackToRegister}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                            <path d="M8.81641 1L1.99822 8.5L8.81641 16" stroke="#140805" strokeWidth="2"/>
                        </svg>
                    </button>
                    <div className="header-title">{getTermsContent(currentTermsType).title}</div>
                </div>
                <div className="terms-content">
                    <h1 className="terms-subtitle">{getTermsContent(currentTermsType).subtitle}</h1>
                    <div className="terms-text-content">
                        <pre>{getTermsContent(currentTermsType).content}</pre>
                    </div>
                </div>
                <div className="terms-footer">
                    <button className="terms-agree-button" onClick={handleBackToRegister}>
                        동의합니다.
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`register-page-container`}>
                { currentStep !== 6 && (
                 <div className="header">
                    <button className="back-button" onClick={handleBackClick}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                             <path d="M8.81641 1L1.99822 8.5L8.81641 16" stroke="#140805" strokeWidth="2"/>
                         </svg>
                     </button>
                    <div className="header-title">{currentStep === 2 || currentStep === 3 || currentStep === 4 ? '학생 이메일 인증' : currentStep === 5? '비밀번호 설정' : '서비스 약관 동의'}</div>
                 </div>
             )}
            <div className="main-content">
                {renderStep()}
            </div>
                         {currentStep && (
                <div className="bottom-button">
                    {currentStep === 4 ? (
                        <button 
                            className="next-button active"
                            onClick={() => setCurrentStep(5)}
                        >
                            대학교 인증 확인
                        </button>
                    ) : (
                        currentStep === 1 ? (
                            (consents.terms && consents.privacy && consents.marketing && consents.thirdParty) ? (
                                <button 
                                    className="next-button active"
                                    onClick={handleNext}
                                >
                                    다음으로
                                </button>
                            ) : null
                        ) : currentStep === 2 ? (
                            isValidEmail(email) ? (
                                <button
                                    className="next-button active"
                                    onClick={handleSendVerificationCode}
                                    disabled={isVerificationLoading}
                                >
                                    {isVerificationLoading ? '전송 중...' : '인증 코드 전송'}
                                </button>
                            ) : null
                        ) : (
                            currentStep === 5 ? (
                                (isValidPassword(password) && passwordConfirm.trim() !== '' && password === passwordConfirm) ? (
                                    <button 
                                        className="next-button active"
                                        onClick={handleNext}
                                    >
                                        다음으로
                                    </button>
                                ) : null
                            ) : currentStep === 6 ? (
                                <button 
                                    className="next-button active"
                                    onClick={handleNext}
                                >
                                    로그인 하기
                                </button>
                            ) : (
                                <button 
                                    className={`next-button ${isNextButtonActive() ? 'active' : ''}`}
                                    onClick={handleNext}
                                    disabled={!isNextButtonActive()}
                                >
                                    {currentStep === 3 ? '입력 완료' : '다음으로'}
                                </button>
                            )
                        )
                    )}
                 </div>
             )}
        </div>
    );
}

export default RegisterPage;
