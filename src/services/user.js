import { getApiConfig } from './auth';

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
