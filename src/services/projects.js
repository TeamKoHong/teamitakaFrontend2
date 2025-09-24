import { getApiConfig } from './auth';

export const getMyProjects = async ({ status = 'ongoing', limit = 10, offset = 0 } = {}) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');
    const qs = new URLSearchParams({ status, limit: String(limit), offset: String(offset) }).toString();
    const res = await fetch(`${API_BASE_URL}/api/projects/mine?${qs}`, {
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
    return res.json(); // { success, items, page }
};
