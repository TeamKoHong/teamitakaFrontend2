import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultHeader from '../../components/Common/DefaultHeader';
import StepIndicator from '../../components/DesignSystem/Feedback/StepIndicator';
import CarrierSelect from '../../components/auth/CarrierSelect';
import SSNInput from '../../components/auth/SSNInput';
import TermsBottomSheet from '../../components/auth/TermsBottomSheet';
import Button from '../../components/DesignSystem/Button/Button';
import styles from './PhoneVerifyPage.module.scss';
import { useSmsAuth } from '../../hooks/useSmsAuth';

/**
 * 휴대폰 본인인증 - 정보 입력 페이지
 * (Legacy UI Structure with New SMS Backend Logic)
 */
function PhoneVerifyPage() {
    const navigate = useNavigate();

    // SMS Auth Hook Integration
    const {
        phone,
        code,
        step,
        timer,
        isLoading: isSmsLoading,
        error: smsError,
        handlePhoneChange,
        handleCodeChange,
        sendSms,
        verifySms,
    } = useSmsAuth();

    // Legacy Form States
    const [carrier, setCarrier] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [genderCode, setGenderCode] = useState('');
    const [name, setName] = useState('');

    // UI States
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    // Form Validation
    const isBasicFormValid = carrier && phone.length >= 12 && birthDate.length === 6 &&
        genderCode.length === 1 && name.trim().length >= 2;

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Handle Back
    const handleBack = () => {
        navigate(-1);
    };

    // Bottom Button Action Types
    const handleMainButtonClick = () => {
        if (step === 'INPUT_PHONE') {
            // Open Terms Sheet
            if (isBasicFormValid) {
                setIsTermsOpen(true);
            }
        } else if (step === 'INPUT_CODE') {
            // Verify Code
            verifySms();
        } else if (step === 'VERIFIED') {
            // Proceed to Next Page (Register Step 2)
            navigate('/register', {
                state: {
                    step: 2,
                    formData: {
                        name,
                        phone,
                        birthDate,
                        genderCode,
                        carrier // Pass carrier just in case
                    }
                }
            });
        }
    };

    // Terms Agreement -> Send SMS
    const handleTermsAgree = async () => {
        setIsTermsOpen(false);
        await sendSms();
    };

    // Button Text Logic
    const getButtonText = () => {
        if (step === 'INPUT_PHONE') return '본인인증';
        if (step === 'INPUT_CODE') return '인증번호 확인';
        if (step === 'VERIFIED') return '다음';
        return '본인인증';
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <DefaultHeader title="본인 인증" onBack={handleBack} />

            {/* Main Content */}
            <div className={styles.content}>
                <StepIndicator currentStep={1} totalSteps={5} />

                <div className={styles.description}>
                    <p>본인 확인을 위해</p>
                    <p>전화번호를 입력해주세요.</p>
                </div>

                {/* Phone Number Section */}
                <div className={styles.formSection}>
                    <label className={styles.label}>휴대전화번호</label>
                    <div className={styles.phoneRow}>
                        <div className={styles.carrierWrapper}>
                            <CarrierSelect
                                value={carrier}
                                onChange={setCarrier}
                            />
                        </div>
                        <div className={styles.phoneWrapper}>
                            <input
                                type="tel"
                                inputMode="numeric"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="010-0000-0000"
                                className={styles.phoneInput}
                                maxLength={13}
                                disabled={step !== 'INPUT_PHONE' && step !== 'INPUT_CODE'}
                            />
                        </div>
                    </div>
                </div>

                {/* Code Input (conditionally rendered for flow within page) */}
                {step !== 'INPUT_PHONE' && (
                    <div className={`${styles.formSection} ${styles.codeInputSection}`}>
                        <div className={styles.codeInputWrapper}>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="인증번호 4자리"
                                className={styles.phoneInput}
                                maxLength={4}
                                disabled={step === 'VERIFIED'}
                            />
                            {step === 'INPUT_CODE' && (
                                <span className={styles.timerBadge}>
                                    {formatTimer(timer)}
                                </span>
                            )}
                        </div>
                        {/* Status & Resend */}
                        {step === 'INPUT_CODE' && (
                            <div className={styles.statusMessage}>
                                인증번호가 전송되었습니다.
                                <button
                                    type="button"
                                    className={styles.resendLink}
                                    onClick={sendSms}
                                    disabled={timer > 150}
                                >
                                    다시 보내기
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/* SSN Section */}
                <div className={styles.formSection}>
                    <label className={styles.label}>주민등록번호</label>
                    <SSNInput
                        birthDate={birthDate}
                        genderCode={genderCode}
                        onBirthDateChange={setBirthDate}
                        onGenderCodeChange={setGenderCode}
                    />
                </div>

                {/* Name Section */}
                <div className={styles.formSection}>
                    <label className={styles.label}>이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력해주세요"
                        className={styles.nameInput}
                    />
                </div>

                {/* Error Message */}
                {smsError && (
                    <div className={styles.errorMessage}>{smsError}</div>
                )}

                {step === 'VERIFIED' && (
                    <div className={styles.successMessage}>인증이 완료되었습니다.</div>
                )}
            </div>

            {/* Bottom Button */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isBasicFormValid || isSmsLoading}
                    onClick={handleMainButtonClick}
                    isLoading={isSmsLoading}
                >
                    {getButtonText()}
                </Button>
            </div>

            {/* Terms Sheet */}
            <TermsBottomSheet
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                onAgree={handleTermsAgree}
            />
        </div>
    );
}

export default PhoneVerifyPage;
