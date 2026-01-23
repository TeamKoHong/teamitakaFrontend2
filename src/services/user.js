import { getApiConfig } from './auth';
import { notifyLoginExpired } from '../components/Common/GlobalToastSystem';

export const getMe = async () => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');
    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: { ...headers, Authorization: `Bearer ${token}` },
    });
    if (res.status === 401 || res.status === 403) {
        notifyLoginExpired();
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 프로필 이미지 업로드
 * @param {File} imageFile - 업로드할 이미지 파일
 * @returns {Promise<{success: boolean, data: {photo_url: string}}>}
 */
export const uploadProfileImage = async (imageFile) => {
    const { API_BASE_URL } = getApiConfig();
    const token = localStorage.getItem('authToken');
    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    // 파일 유효성 검사
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP만 가능)');
    }
    if (imageFile.size > maxSize) {
        throw new Error('이미지 크기는 5MB 이하여야 합니다.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await fetch(`${API_BASE_URL}/api/upload/profile-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });

    if (res.status === 401 || res.status === 403) {
        notifyLoginExpired();
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};

/**
 * 프로필 업데이트
 * @param {Object} profileData - 업데이트할 프로필 데이터
 * @returns {Promise<Object>} 업데이트된 사용자 정보
 */
export const updateProfile = async (profileData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');
    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: { ...headers, Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
    });

    if (res.status === 401 || res.status === 403) {
        notifyLoginExpired();
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }
    if (!res.ok) {
        const err = new Error('SERVER_ERROR');
        err.code = 'SERVER_ERROR';
        throw err;
    }
    return res.json();
};
