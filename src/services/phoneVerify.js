/**
 * 본인인증 API 서비스 (Firebase Phone Auth 연동)
 * 
 * 기존 Mock API를 Firebase Phone Auth로 교체
 */

import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { verifyPhoneAuth } from './phoneAuth';

// 설정
const TEST_PHONE = '+821012345678'; // 테스트 전화번호
const TEST_CODE = '123456'; // 테스트 인증코드
const REGISTERED_PHONE = '010-0000-0000'; // 이미 가입된 번호

// 전역 상태 (confirmationResult 저장용)
let confirmationResult = null;

/**
 * 휴대폰 번호 포맷팅 (010-XXXX-XXXX)
 * @param {string} value - 입력값
 * @returns {string} - 포맷팅된 번호
 */
export const formatPhoneNumber = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
};

/**
 * 휴대폰 번호를 E.164 형식으로 변환
 * @param {string} phone - 010-1234-5678 형식
 * @returns {string} - +821012345678 형식
 */
const toE164Format = (phone) => {
    const cleaned = phone.replace(/-/g, '');
    if (cleaned.startsWith('010')) {
        return '+82' + cleaned.substring(1);
    }
    if (cleaned.startsWith('+82')) {
        return cleaned;
    }
    return '+82' + cleaned;
};

/**
 * reCAPTCHA 초기화
 */
const setupRecaptcha = () => {
    // 1. 기존 인스턴스가 있다면 정리 (재전송 시 안정성 확보)
    if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.clear();
        } catch (e) {
            console.error("reCAPTCHA clear error:", e);
        }
        window.recaptchaVerifier = null;
    }

    // 2. recaptcha-container 엘리먼트 존재 확인
    const container = document.getElementById('recaptcha-container');
    if (!container) {
        // container가 없으면 임시로 body에 생성하거나 에러 처리
        console.error('reCAPTCHA container not found');
    }

    // 3. 인스턴스 새로 생성
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible', // 'normal'보다 'invisible'이 재전송 시 사용자 경험에 좋습니다.
        callback: () => {
            console.log('✅ reCAPTCHA 검증 완료');
        },
        'expired-callback': () => {
            console.log('⚠️ reCAPTCHA 만료됨');
            cleanupRecaptcha();
        }
    });

    return window.recaptchaVerifier;
};

/**
 * reCAPTCHA 정리
 */
export const cleanupRecaptcha = () => {
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
    }
};

/**
 * 본인인증 SMS 요청 (Firebase Phone Auth)
 * @param {Object} formData - 폼 데이터
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const requestPhoneVerification = async (formData) => {
    // 이미 가입된 번호 체크 (실제로는 백엔드에서 확인)
    if (formData.phone === REGISTERED_PHONE) {
        const error = new Error('이미 가입된 번호입니다.');
        error.code = 'ALREADY_REGISTERED';
        throw error;
    }

    // 필수 필드 검증
    if (!formData.carrier || !formData.phone || !formData.birthDate ||
        !formData.genderCode || !formData.name) {
        const error = new Error('모든 필드를 입력해주세요.');
        error.code = 'MISSING_FIELDS';
        throw error;
    }

    const formattedPhone = toE164Format(formData.phone);
    console.log('📱 SMS 발송 요청:', formattedPhone);

    // 🧪 테스트 모드 (개발 환경)
    if (process.env.REACT_APP_ENABLE_TEST_MODE === 'true' && formattedPhone === TEST_PHONE) {
        console.log('🧪 테스트 모드: 가짜 SMS 전송');

        // 테스트용 가짜 confirmationResult
        confirmationResult = {
            confirm: async (code) => {
                if (code === TEST_CODE) {
                    return {
                        user: {
                            uid: 'test-user-' + Date.now(),
                            phoneNumber: formattedPhone,
                            getIdToken: async () => 'dev-test-token-' + Date.now()
                        }
                    };
                } else {
                    throw new Error('인증 코드가 올바르지 않습니다.');
                }
            }
        };

        return {
            success: true,
            message: '인증번호가 전송되었습니다. (테스트: 123456)'
        };
    }

    // 🔥 Firebase Phone Auth
    try {
        const appVerifier = setupRecaptcha();
        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        confirmationResult = result;

        console.log('✅ Firebase SMS 전송 완료');

        return {
            success: true,
            message: '인증번호가 전송되었습니다.'
        };
    } catch (err) {
        console.error('❌ Firebase SMS 전송 실패:', err);
        cleanupRecaptcha();

        // 에러 처리
        let userMessage = 'SMS 전송에 실패했습니다.';
        if (err.code === 'auth/invalid-phone-number') {
            userMessage = '올바르지 않은 전화번호 형식입니다.';
        } else if (err.code === 'auth/too-many-requests') {
            userMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
        } else if (err.code === 'auth/invalid-app-credential') {
            userMessage = '인증 설정 오류입니다. 관리자에게 문의해주세요.';
        }

        const error = new Error(userMessage);
        error.code = err.code;
        throw error;
    }
};

/**
 * 인증번호 확인 (Firebase + 백엔드)
 * @param {string} code - 6자리 인증번호
 * @param {Object} formData - 원본 폼 데이터
 * @returns {Promise<{success: boolean, ci: string, name: string, phone: string}>}
 */
export const verifyCode = async (code, formData = {}) => {
    if (!confirmationResult) {
        throw new Error('인증번호를 먼저 요청해주세요.');
    }

    try {
        console.log('🔐 인증 코드 확인 중...');

        // Firebase 인증 코드 확인
        const credential = await confirmationResult.confirm(code);
        const idToken = await credential.user.getIdToken();

        console.log('✅ Firebase 인증 완료');

        // 백엔드 API로 검증 & 사용자 정보 획득
        const response = await verifyPhoneAuth(idToken);

        console.log('✅ 백엔드 인증 완료:', response);

        // confirmationResult 정리
        confirmationResult = null;

        return {
            success: true,
            ci: response.user?.ci || 'CI_' + Date.now(),
            name: formData.name || response.user?.name || '사용자',
            phone: formData.phone || credential.user.phoneNumber,
            token: response.token,
            user: response.user
        };
    } catch (err) {
        console.error('❌ 인증 확인 실패:', err);

        let userMessage = '인증번호가 일치하지 않습니다.';
        if (err.code === 'auth/invalid-verification-code') {
            userMessage = '인증번호가 올바르지 않습니다.';
        } else if (err.code === 'auth/code-expired') {
            userMessage = '인증번호가 만료되었습니다. 다시 받아주세요.';
        }

        const error = new Error(userMessage);
        error.code = err.code || 'INVALID_CODE';
        throw error;
    }
};

/**
 * 인증번호 재전송
 * @param {Object} formData - 폼 데이터
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resendVerificationCode = async (formData) => {
    // reCAPTCHA 정리 후 재요청
    cleanupRecaptcha();
    confirmationResult = null;

    // 새로운 SMS 전송
    return requestPhoneVerification(formData);
};
