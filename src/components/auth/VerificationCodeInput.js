import React from 'react';
import styles from './VerificationCodeInput.module.scss';

/**
 * 인증번호 입력 컴포넌트
 * @param {Object} props
 * @param {string} props.value - 입력된 인증번호
 * @param {Function} props.onChange - 변경 콜백
 * @param {string} props.formatted - 포맷된 남은 시간 (MM:SS)
 * @param {boolean} props.isExpired - 타이머 만료 여부
 * @param {Function} props.onResend - 재전송 버튼 클릭 콜백
 * @param {string} props.error - 에러 메시지
 * @param {string} props.successMessage - 성공 메시지
 */
const VerificationCodeInput = ({
    value,
    onChange,
    formatted,
    isExpired,
    onResend,
    error,
    successMessage
}) => {
    const handleChange = (e) => {
        const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
        onChange(newValue);
    };

    return (
        <div className={styles.container}>
            {successMessage && (
                <p className={styles.successMessage}>{successMessage}</p>
            )}

            <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
                <input
                    type="tel"
                    inputMode="numeric"
                    value={value}
                    onChange={handleChange}
                    placeholder="인증번호 6자리"
                    maxLength={6}
                    className={styles.input}
                    autoComplete="one-time-code"
                />
                <span className={`${styles.timer} ${isExpired ? styles.expired : ''}`}>
                    {formatted}
                </span>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <p className={styles.resendText}>
                인증 문자를 받지 못하셨나요?{' '}
                <button
                    type="button"
                    onClick={onResend}
                    className={styles.resendButton}
                >
                    다시 보내기
                </button>
            </p>
        </div>
    );
};

export default VerificationCodeInput;
