import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from '../../components/auth/ProgressIndicator';
import CarrierSelect from '../../components/auth/CarrierSelect';
import SSNInput from '../../components/auth/SSNInput';
import TermsBottomSheet from '../../components/auth/TermsBottomSheet';
import Button from '../../components/DesignSystem/Button/Button';
import { formatPhoneNumber, requestPhoneVerification } from '../../services/phoneVerify';
import styles from './PhoneVerifyPage.module.scss';

/**
 * 휴대폰 본인인증 - 정보 입력 페이지
 */
function PhoneVerifyPage() {
    const navigate = useNavigate();

    // 폼 상태
    const [carrier, setCarrier] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [genderCode, setGenderCode] = useState('');
    const [name, setName] = useState('');

    // UI 상태
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 폼 유효성 검사
    const isFormValid = carrier && phone.length >= 13 && birthDate.length === 6 &&
        genderCode.length === 1 && name.trim().length >= 2;

    // 휴대폰 번호 변경
    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    // 뒤로가기
    const handleBack = () => {
        navigate(-1);
    };

    // 본인인증 버튼 클릭 -> 약관 바텀시트 열기
    const handleVerifyClick = () => {
        if (isFormValid) {
            setIsTermsOpen(true);
        }
    };

    // 약관 동의 완료 -> SMS 발송 요청
    const handleTermsAgree = async () => {
        setIsTermsOpen(false);
        setIsLoading(true);
        setError('');

        try {
            const formData = { carrier, phone, birthDate, genderCode, name };
            await requestPhoneVerification(formData);

            // 인증번호 입력 페이지로 이동
            navigate('/phone-verify/code', {
                state: { formData }
            });
        } catch (err) {
            if (err.code === 'ALREADY_REGISTERED') {
                setError('이미 가입된 번호입니다. 로그인해주세요.');
            } else {
                setError(err.message || '오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                        <path d="M8.81641 1L1.99822 8.5L8.81641 16" stroke="#140805" strokeWidth="2" />
                    </svg>
                </button>
                <h1 className={styles.headerTitle}>본인 인증</h1>
                <div className={styles.headerSpacer} />
            </div>

            {/* 메인 컨텐츠 */}
            <div className={styles.content}>
                <ProgressIndicator currentStep={2} totalSteps={5} />

                <div className={styles.description}>
                    <p>본인 확인을 위해</p>
                    <p>전화번호를 입력해주세요.</p>
                </div>

                {/* 휴대전화번호 */}
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
                            />
                        </div>
                    </div>
                </div>

                {/* 주민등록번호 */}
                <div className={styles.formSection}>
                    <label className={styles.label}>주민등록번호</label>
                    <SSNInput
                        birthDate={birthDate}
                        genderCode={genderCode}
                        onBirthDateChange={setBirthDate}
                        onGenderCodeChange={setGenderCode}
                    />
                </div>

                {/* 이름 */}
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

                {/* 에러 메시지 */}
                {error && (
                    <div className={styles.errorMessage}>{error}</div>
                )}

                {/* Firebase reCAPTCHA 컨테이너 (invisible) */}
                <div id="recaptcha-container"></div>

                {/* 내 명의 휴대전화가 아니에요 */}
                <button className={styles.notMyPhoneLink}>
                    내 명의 휴대전화가 아니에요
                </button>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isFormValid || isLoading}
                    onClick={handleVerifyClick}
                    isLoading={isLoading}
                >
                    본인인증
                </Button>
            </div>

            {/* 약관 동의 바텀시트 */}
            <TermsBottomSheet
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                onAgree={handleTermsAgree}
            />
        </div>
    );
}

export default PhoneVerifyPage;
