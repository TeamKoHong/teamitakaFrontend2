import { supabase } from '../config/supabase';

// API 기본 URL과 인증 헤더를 설정하는 헬퍼 함수
export const getApiConfig = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    if (!API_BASE_URL) {
        throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
    }

    // Supabase Edge Function인지 확인
    const isSupabaseFunction = API_BASE_URL.includes('supabase.co/functions');

    const headers = {
        'Content-Type': 'application/json',
    };

    // Supabase Edge Function인 경우 apikey 헤더 추가
    if (isSupabaseFunction) {
        const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
        if (!supabaseAnonKey) {
            throw new Error('REACT_APP_SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.');
        }
        headers['apikey'] = supabaseAnonKey;
        headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
    }

    return { API_BASE_URL, headers };
};

// 이메일 인증 코드 전송 (Supabase OTP 사용)
export const sendVerificationCode = async (email, retryCount = 0) => {
    try {
        // 이메일 형식 검증
        if (!email || !isValidEmail(email)) {
            throw new Error('올바른 이메일 형식이 아닙니다.');
        }

        console.log(`📧 이메일 인증 요청 시도 ${retryCount + 1}: ${email}`);

        // 🧪 [개발용] 테스트 이메일 우회 로직
        if (email === 'test@email.com') {
            console.log('🧪 테스트 이메일 감지: Supabase 요청을 우회합니다.');
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: '인증 코드가 전송되었습니다. (테스트 모드)' };
        }

        // Supabase OTP 발송
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true,  // Supabase에 임시 사용자 생성 후 OTP 발송
            }
        });

        if (error) {
            console.error('Supabase OTP 발송 오류:', error);

            // Rate limit 에러 처리
            if (error.message.toLowerCase().includes('rate limit') ||
                error.message.toLowerCase().includes('too many')) {
                const customError = new Error('요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.');
                customError.code = 'RATE_LIMITED';
                customError.statusCode = 429;
                throw customError;
            }

            // 이메일 관련 에러 처리
            if (error.message.toLowerCase().includes('invalid email')) {
                const customError = new Error('유효하지 않은 이메일 형식입니다.');
                customError.code = 'INVALID_EMAIL';
                customError.statusCode = 400;
                throw customError;
            }

            throw new Error(error.message || '인증번호 전송에 실패했습니다.');
        }

        console.log(`✅ 이메일 인증 코드 전송 성공 (Supabase OTP): ${email}`);
        return { success: true, message: '인증 코드가 전송되었습니다.' };

    } catch (error) {
        console.error('이메일 발송 오류:', error);

        // 재시도 로직 (statusCode가 없는 일반 에러만 재시도)
        if (!error.statusCode && retryCount < 2) {
            console.log(`🔄 재시도 중... (${retryCount + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return sendVerificationCode(email, retryCount + 1);
        }

        // statusCode가 있으면 그대로 throw (UI에서 처리)
        if (error.statusCode) {
            throw error;
        }

        throw new Error(error.message || '인증번호 전송에 실패했습니다.');
    }
};

// 이메일 형식 검증 함수
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 네트워크 에러 판단 함수
const isNetworkError = (error) => {
    return error.name === 'TypeError' ||
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch');
};

// 로딩 상태 관리 함수들
export const createLoadingState = () => ({
    isLoading: false,
    error: null,
    retryCount: 0
});

export const setLoading = (state, isLoading) => ({
    ...state,
    isLoading,
    error: isLoading ? null : state.error
});

export const setError = (state, error) => ({
    ...state,
    isLoading: false,
    error,
    retryCount: state.retryCount + 1
});

export const clearError = (state) => ({
    ...state,
    error: null,
    retryCount: 0
});

// React Hook 사용 예시 (useState와 useEffect 필요)
// import React, { useState } from 'react'; // 파일 상단에 추가 필요
/*
export const useEmailVerification = () => {
    const [state, setState] = React.useState(createLoadingState());
    
    const sendCode = async (email) => {
        setState(setLoading(state, true));
        try {
            const result = await sendVerificationCode(email);
            setState(clearError(state));
            return result;
        } catch (error) {
            setState(setError(state, error.message));
            throw error;
        }
    };
    
    const verifyCode = async (email, code) => {
        setState(setLoading(state, true));
        try {
            const result = await verifyCode(email, code);
            setState(clearError(state));
            return result;
        } catch (error) {
            setState(setError(state, error.message));
            throw error;
        }
    };
    
    const resendCode = async (email) => {
        setState(setLoading(state, true));
        try {
            const result = await resendVerificationCode(email);
            setState(clearError(state));
            return result;
        } catch (error) {
            setState(setError(state, error.message));
            throw error;
        }
    };
    
    return {
        ...state,
        sendCode,
        verifyCode,
        resendCode,
        clearError: () => setState(clearError(state))
    };
};
*/

// 인증 코드 검증 (Supabase OTP 사용)
export const verifyCode = async (email, code) => {
    try {
        if (!email || !code) {
            throw new Error('이메일과 인증 코드가 필요합니다.');
        }

        console.log(`🔐 인증 코드 검증 (Supabase OTP): ${email}`);

        // 🧪 [개발용] 테스트 이메일 우회 로직
        if (email === 'test@email.com') {
            console.log('🧪 테스트 이메일 감지: Supabase 검증을 우회합니다.');
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: '인증 성공 (테스트 모드)', accessToken: 'test-token' };
        }

        // Supabase OTP 검증
        const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: code,
            type: 'email',
        });

        if (error) {
            console.error('Supabase OTP 검증 오류:', error);

            // 만료된 토큰
            if (error.message.toLowerCase().includes('expired')) {
                throw new Error('인증번호가 만료되었습니다. 다시 요청해주세요.');
            }

            // 잘못된 토큰
            if (error.message.toLowerCase().includes('invalid') ||
                error.message.toLowerCase().includes('incorrect')) {
                throw new Error('인증번호가 일치하지 않습니다.');
            }

            throw new Error(error.message || '인증번호 확인에 실패했습니다.');
        }

        // accessToken 저장 (signOut 전에)
        const accessToken = data.session?.access_token;

        // Supabase 세션 정리 (실제 회원가입은 Render 백엔드에서 처리)
        await supabase.auth.signOut();

        console.log(`✅ 인증 코드 검증 성공 (Supabase OTP): ${email}`);
        return { success: true, message: '인증 성공', accessToken };

    } catch (error) {
        console.error('인증 코드 검증 오류:', error);
        throw new Error(error.message || '인증번호 확인에 실패했습니다.');
    }
};

// 인증 상태 확인
export const checkVerificationStatus = async (email) => {
    try {
        const { API_BASE_URL, headers } = getApiConfig();

        const response = await fetch(`${API_BASE_URL}/api/auth/status?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || '인증 상태 확인에 실패했습니다.');
    }
};

// 인증 코드 재전송 (Supabase OTP 사용)
export const resendVerificationCode = async (email) => {
    console.log(`🔄 인증 코드 재전송: ${email}`);
    // sendVerificationCode와 동일한 로직 사용
    return sendVerificationCode(email);
};

// 사용자 등록
export const registerUser = async (userData) => {
    try {
        const { API_BASE_URL, headers } = getApiConfig();

        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: '응답을 파싱할 수 없습니다.' }));
            console.error('Registration error details:', errorData);
            console.error('Response status:', response.status);
            console.error('Response headers:', Object.fromEntries(response.headers.entries()));
            throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.token) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }

        return result;
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error(error.message || '회원가입에 실패했습니다.');
    }
};

// 로그인 에러 메시지 매핑 (사용자 친화적 요약)
const mapLoginErrorMessage = (status, errorData) => {
    const code = (errorData && (errorData.code || errorData.error)) || '';
    const message = errorData && errorData.message;

    // 우선순위: 상태코드 → 표준 에러코드 → 서버 메시지 → 기본 메시지
    if (status === 400 || code === 'VALIDATION_ERROR') {
        return '입력하신 정보를 다시 확인해주세요.';
    }
    if (status === 401 || code === 'INVALID_CREDENTIALS') {
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    if (status === 403 || code === 'EMAIL_NOT_VERIFIED') {
        return '이메일 인증이 완료되지 않았습니다. 받은 메일함을 확인해주세요.';
    }
    if (status === 404) {
        if (code === 'USER_NOT_FOUND') {
            return '해당 이메일로 가입된 계정을 찾을 수 없습니다.';
        }
        if (code === 'NOT_FOUND') {
            return '로그인 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.';
        }
        return '요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }
    if (status === 429 || code === 'RATE_LIMITED') {
        return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    }
    if (status >= 500 || code === 'SERVER_ERROR') {
        return '서버 오류로 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
    }
    return message || '로그인에 실패했습니다.';
};

// 사용자 로그인
export const loginUser = async (loginData) => {
    try {
        const { API_BASE_URL, headers } = getApiConfig();

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: '응답을 파싱할 수 없습니다.' }));
            console.error('Login error details:', errorData);
            const friendly = mapLoginErrorMessage(response.status, errorData);
            const err = new Error(friendly);
            err.code = (errorData && (errorData.code || errorData.error)) || `HTTP_${response.status}`;
            throw err;
        }

        const result = await response.json();

        // 성공인데 토큰이 없는 경우 명시적 오류 처리
        if (result && result.success && !result.token) {
            const err = new Error('로그인 토큰을 받지 못했습니다. 잠시 후 다시 시도하거나 문의해주세요.');
            err.code = 'MISSING_TOKEN';
            throw err;
        }

        // 백엔드가 success: true, token, user를 반환
        if (result.token && result.user) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }

        return result;
    } catch (error) {
        console.error('Login error:', error);
        if (isNetworkError(error)) {
            const err = new Error('네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해주세요.');
            err.code = 'NETWORK_ERROR';
            throw err;
        }
        throw new Error(error.message || '로그인에 실패했습니다.');
    }
};

// 로그아웃
export const logoutUser = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('로그아웃에 실패했습니다.');
    }
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
    try {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            return null;
        }

        return {
            token,
            user: JSON.parse(userStr)
        };
    } catch (error) {
        console.error('Get current user error:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return null;
    }
};

// 인증 상태 확인
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
};

// 인증 토큰 가져오기
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// 토큰 갱신
export const refreshToken = async () => {
    try {
        const { API_BASE_URL, headers } = getApiConfig();
        const currentToken = localStorage.getItem('authToken');

        if (!currentToken) {
            throw new Error('저장된 토큰이 없습니다.');
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                ...headers,
                'Authorization': `Bearer ${currentToken}`
            },
        });

        if (!response.ok) {
            logoutUser();
            throw new Error('토큰 갱신에 실패했습니다.');
        }

        const result = await response.json();

        if (result.token) {
            localStorage.setItem('authToken', result.token);
        }

        return result;
    } catch (error) {
        console.error('Token refresh error:', error);
        logoutUser();
        throw new Error(error.message || '토큰 갱신에 실패했습니다.');
    }
};