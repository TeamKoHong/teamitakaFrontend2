import { getApiConfig } from './auth';
import { notifyLoginExpired } from '../components/Common/ToastHost';

const authHeaders = () => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');
    return { API_BASE_URL, headers: { ...headers, Authorization: `Bearer ${token}` } };
};

export const getSummary = async () => {
    const { API_BASE_URL, headers } = authHeaders();
    const res = await fetch(`${API_BASE_URL}/api/dashboard/summary`, { headers });
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

export const getMyProjects = async ({ status = 'ongoing', limit = 5, offset = 0 } = {}) => {
    const { API_BASE_URL, headers } = authHeaders();
    const url = `${API_BASE_URL}/api/projects/mine?status=${encodeURIComponent(status)}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers });
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

export const getTodos = async ({ status = 'open', limit = 5, offset = 0 } = {}) => {
    const { API_BASE_URL, headers } = authHeaders();
    const url = `${API_BASE_URL}/api/todos?status=${encodeURIComponent(status)}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers });
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

export const getNotifications = async ({ unread = true, limit = 5, offset = 0 } = {}) => {
    const { API_BASE_URL, headers } = authHeaders();
    const url = `${API_BASE_URL}/api/notifications?unread=${unread ? 'true' : 'false'}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers });
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

export const getUpcomingSchedules = async ({ days = 7, limit = 5, offset = 0 } = {}) => {
    const { API_BASE_URL, headers } = authHeaders();
    const url = `${API_BASE_URL}/api/schedules/upcoming?days=${days}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers });
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
