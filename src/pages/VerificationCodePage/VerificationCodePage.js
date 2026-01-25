import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DefaultHeader from '../../components/Common/DefaultHeader';
import StepIndicator from '../../components/DesignSystem/Feedback/StepIndicator';
import VerificationCodeInput from '../../components/auth/VerificationCodeInput';
import Button from '../../components/DesignSystem/Button/Button';
import useTimer from '../../hooks/useTimer';
import { verifyCode, resendVerificationCode } from '../../services/phoneVerify';
import { MAX_VERIFICATION_ATTEMPTS } from '../../types/auth';
import styles from './VerificationCodePage.module.scss';

/**
 * 휴대폰 본인인증 - 인증번호 입력 페이지
 */
function VerificationCodePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setRegistration } = useAuth();
    const formData = location.state?.formData || {};

    // 타이머 Hook
    const { formatted, isExpired, reset: resetTimer } = useTimer(180);

    // 상태
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('인증번호가 전송되었습니다');
    const [attemptCount, setAttemptCount] = useState(0);

    // 폼 유효성
    const isCodeValid = code.length === 6;

    // 뒤로가기
    const handleBack = () => {
        navigate(-1);
    };

    // 인증번호 확인
    const handleVerify = async () => {
        if (!isCodeValid || isExpired || isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await verifyCode(code, formData);

            if (result.success) {
                // AuthContext에 인증 정보 저장
                setRegistration({
                    phoneVerified: true,
                    verifiedName: result.name,
                    verifiedPhone: result.phone,
                    ci: result.ci
                });

                // 다음 단계 (이메일 연동)로 이동 - step 2부터 시작하도록 state 전달
                navigate('/register', { state: { step: 2 } });
            }
        } catch (err) {
            const newAttemptCount = attemptCount + 1;
            setAttemptCount(newAttemptCount);

            if (newAttemptCount >= MAX_VERIFICATION_ATTEMPTS) {
                setError('인증 시도 횟수를 초과했습니다. 인증번호를 다시 받아주세요.');
            } else {
                setError(err.message || '인증번호가 일치하지 않습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 인증번호 재전송
    const handleResend = async () => {
        setIsLoading(true);
        setError('');

        try {
            await resendVerificationCode(formData);
            resetTimer();
            setAttemptCount(0);
            setCode('');
            setSuccessMessage('인증번호가 재전송되었습니다');
        } catch (err) {
            setError(err.message || '재전송에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <DefaultHeader title="본인 인증" onBack={handleBack} />

            {/* 메인 컨텐츠 */}
            <div className={styles.content}>
                <StepIndicator currentStep={2} totalSteps={5} />

                <div className={styles.description}>
                    <p>문자로 전송된</p>
                    <p>인증번호를 입력해주세요.</p>
                </div>

                {/* 인증번호 입력 */}
                <div className={styles.formSection}>
                    <VerificationCodeInput
                        value={code}
                        onChange={setCode}
                        formatted={formatted}
                        isExpired={isExpired}
                        onResend={handleResend}
                        error={error}
                        successMessage={successMessage}
                    />
                </div>

                {/* Firebase reCAPTCHA 컨테이너 */}
                <div id="recaptcha-container"></div>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isCodeValid || isExpired || isLoading || attemptCount >= MAX_VERIFICATION_ATTEMPTS}
                    onClick={handleVerify}
                    isLoading={isLoading}
                >
                    확인
                </Button>
            </div>
        </div>
    );
}

export default VerificationCodePage;
