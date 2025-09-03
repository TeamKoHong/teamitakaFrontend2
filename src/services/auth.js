export const sendVerificationCode = async (emailData) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        
        if (!API_BASE_URL) {
            throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
        }
        
        console.log('Sending data to backend:', emailData); // 디버깅용 로그
        
        const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        console.log('Response status:', response.status); // 디버깅용 로그

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: '응답을 파싱할 수 없습니다.' }));
            console.error('Backend error details:', errorData); // 디버깅용 로그
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Full error:', error); // 디버깅용 로그
        throw new Error(error.message || '인증번호 전송에 실패했습니다.');
    }
};

export const verifyCode = async (verificationData) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        
        if (!API_BASE_URL) {
            throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verificationData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || '인증번호 확인에 실패했습니다.');
    }
};

export const checkVerificationStatus = async (email) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        
        if (!API_BASE_URL) {
            throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/status?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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

export const resendVerificationCode = async (emailData) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        
        if (!API_BASE_URL) {
            throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || '인증번호 재전송에 실패했습니다.');
    }
};

export const registerUser = async (userData) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        
        if (!API_BASE_URL) {
            throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
        }
        
        console.log('Sending registration data:', userData);
        
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        console.log('Registration response status:', response.status);

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

export const loginUser = async (loginData) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        
        if (!API_BASE_URL) {
            throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
        }
        
        console.log('Sending login data:', { email: loginData.email });
        
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        console.log('Login response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: '응답을 파싱할 수 없습니다.' }));
            console.error('Login error details:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.token) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }

        return result;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || '로그인에 실패했습니다.');
    }
};

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

export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const refreshToken = async () => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const currentToken = localStorage.getItem('authToken');
        
        if (!API_BASE_URL) {
            throw new Error('REACT_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
        }
        
        if (!currentToken) {
            throw new Error('저장된 토큰이 없습니다.');
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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