/**
 * 본인인증 API 서비스 (Firebase Phone Auth 연동)
 */
import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { verifyPhoneAuth } from './phoneAuth';

const TEST_PHONE = '+821012345678';
const TEST_CODE = '123456';
const REGISTERED_PHONE = '010-0000-0000';

let confirmationResult = null;

// 휴대폰 번호 포맷팅
export const formatPhoneNumber = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
};

// E.164 형식 변환
const toE164Format = (phone) => {
    const cleaned = phone.replace(/-/g, '');
    if (cleaned.startsWith('010')) return '+82' + cleaned.substring(1);
    return cleaned.startsWith('+82') ? cleaned : '+82' + cleaned;
};

/**
 * reCAPTCHA 초기화 (중복 및 충돌 방지)
 */
const setupRecaptcha = () => {
    // 1. 기존 인스턴스가 있다면 먼저 완전히 정리
    if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.clear();
        } catch (e) {
            console.warn('⚠️ RecaptchaVerifier clear failed:', e);
        }
        window.recaptchaVerifier = null;
    }

    // 2. 컨테이너 엘리먼트 확인
    const container = document.getElementById('recaptcha-container');
    if (!container) {
        console.error('❌ recaptcha-container element not found');
        return null;
    }

    // 3. 인스턴스 새로 생성 (재전송 시 안정성을 위해 invisible 모드 권장)
    try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible', 
            callback: () => console.log('✅ reCAPTCHA solved'),
            'expired-callback': () => {
                console.log('⚠️ reCAPTCHA expired');
                cleanupRecaptcha();
            }
        });
        return window.recaptchaVerifier;
    } catch (e) {
        console.error('❌ RecaptchaVerifier creation failed:', e);
        return null;
    }
};

// reCAPTCHA 정리
export const cleanupRecaptcha = () => {
    if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
    }
};

// SMS 발송 요청
export const requestPhoneVerification = async (formData) => {
    if (formData.phone === REGISTERED_PHONE) {
        const error = new Error('이미 가입된 번호입니다.');
        error.code = 'ALREADY_REGISTERED';
        throw error;
    }

    if (!formData.carrier || !formData.phone || !formData.birthDate ||
        !formData.genderCode || !formData.name) {
        throw new Error('모든 필드를 입력해주세요.');
    }

    const formattedPhone = toE164Format(formData.phone);
    
    // 테스트 모드 처리
    if (process.env.REACT_APP_ENABLE_TEST_MODE === 'true' && formattedPhone === TEST_PHONE) {
        confirmationResult = {
            confirm: async (code) => {
                if (code === TEST_CODE) return { user: { uid: 'test-uid', getIdToken: async () => 'test-token' } };
                throw new Error('인증 코드가 올바르지 않습니다.');
            }
        };
        return { success: true, message: '인증번호가 전송되었습니다. (테스트)' };
    }

    try {
        const appVerifier = setupRecaptcha();
        if (!appVerifier) throw new Error('reCAPTCHA 초기화 실패. 페이지를 새로고침 해주세요.');

        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        confirmationResult = result;
        return { success: true, message: '인증번호가 전송되었습니다.' };
    } catch (err) {
        cleanupRecaptcha();
        let userMessage = 'SMS 전송에 실패했습니다.';
        if (err.code === 'auth/too-many-requests') userMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
        const error = new Error(userMessage);
        error.code = err.code;
        throw error;
    }
};

// 인증번호 확인
export const verifyCode = async (code, formData = {}) => {
    if (!confirmationResult) throw new Error('인증번호를 먼저 요청해주세요.');
    try {
        const credential = await confirmationResult.confirm(code);
        const idToken = await credential.user.getIdToken();
        const response = await verifyPhoneAuth(idToken);
        confirmationResult = null;
        return {
            success: true,
            ci: response.user?.ci || 'CI_' + Date.now(),
            name: formData.name || response.user?.name,
            phone: formData.phone || credential.user.phoneNumber,
            token: response.token
        };
    } catch (err) {
        let userMessage = err.code === 'auth/code-expired' ? '만료된 코드입니다.' : '인증번호가 올바르지 않습니다.';
        throw new Error(userMessage);
    }
};

// 인증번호 재전송
export const resendVerificationCode = async (formData) => {
    cleanupRecaptcha();
    confirmationResult = null;
    return requestPhoneVerification(formData);
};