import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultHeader from '../../components/Common/DefaultHeader';
import StepIndicator from '../../components/DesignSystem/Feedback/StepIndicator';
import SSNInput from '../../components/auth/SSNInput';
import Button from '../../components/DesignSystem/Button/Button';
import styles from './PhoneVerifyPage.module.scss';
import { SmsAuthForm } from '../../components/auth/SmsAuthForm';

/**
 * 휴대폰 본인인증 - 정보 입력 페이지
 * @desc Firebase Auth 제거 및 SmsAuthForm 통합
 */
function PhoneVerifyPage() {
    const navigate = useNavigate();

    // 폼 상태
    const [birthDate, setBirthDate] = useState('');
    const [genderCode, setGenderCode] = useState('');
    const [name, setName] = useState('');
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    // 유효성 검사 (주민번호, 이름)
    const isFormValid = birthDate.length === 6 &&
        genderCode.length === 1 && name.trim().length >= 2 && isPhoneVerified;

    // 뒤로가기
    const handleBack = () => {
        navigate(-1);
    };

    // 본인인증 완료 처리
    const handleVerificationSuccess = () => {
        setIsPhoneVerified(true);
    };

    // 다음 단계로 이동
    const handleNextClick = () => {
        if (isFormValid) {
            console.log('Verification Complete. Proceeding to next step...');
            navigate('/'); // TODO: Update this to the actual next step route
        }
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <DefaultHeader title="본인 인증" onBack={handleBack} />

            {/* 메인 컨텐츠 */}
            <div className={styles.content}>
                <StepIndicator currentStep={1} totalSteps={5} />

                <div className={styles.description}>
                    <p>본인 확인을 위해</p>
                    <p>전화번호를 입력해주세요.</p>
                </div>

                {/* 휴대전화번호 (New SmsAuthForm) */}
                <div className={styles.formSection}>
                    <SmsAuthForm onVerificationSuccess={handleVerificationSuccess} />
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

                {/* 내 명의 휴대전화가 아니에요 */}
                <button className={styles.notMyPhoneLink}>
                    내 명의 휴대전화가 아니에요
                </button>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isFormValid}
                    onClick={handleNextClick}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}

export default PhoneVerifyPage;
