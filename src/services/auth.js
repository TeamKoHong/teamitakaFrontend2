export const sendVerificationCode = async (emailData) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://teamitaka-backend-732827775376.us-central1.run.app';
        const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
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
        throw new Error(error.message || '인증번호 전송에 실패했습니다.');
    }
};

export const verifyCode = async (verificationData) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://teamitaka-backend-732827775376.us-central1.run.app';
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
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://teamitaka-backend-732827775376.us-central1.run.app';
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
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://teamitaka-backend-732827775376.us-central1.run.app';
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