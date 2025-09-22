// API 기본 URL과 인증 헤더를 설정하는 헬퍼 함수
const getApiConfig = () => {
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

// 이메일 인증 코드 전송
export const sendVerificationCode = async (emailData) => {
    try {
        const { API_BASE_URL, headers } = getApiConfig();
        
        // 이메일 인증을 위한 데이터에 action 필드 추가
        const requestData = {
            ...emailData,
            action: 'send-verification'
        };
        
        const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
};

// 인증 코드 검증
export const verifyCode = async (verificationData) => {
    try {
        const { API_BASE_URL, headers } = getApiConfig();
        
        // 코드 검증을 위한 데이터에 action 필드 추가
        const requestData = {
            ...verificationData,
            action: 'verify-code'
        };
        
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
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
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
};

// 인증 코드 재전송
export const resendVerificationCode = async (emailData) => {
    try {
        const { API_BASE_URL, headers } = getApiConfig();
        
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
            method: 'POST',
            headers,
            body: JSON.stringify(emailData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
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
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
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
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
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
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
};
