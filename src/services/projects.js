import { getApiConfig } from './auth';

/**
 * Creates a new project
 * @param {Object} projectData - Project data
 * @param {string} projectData.title - Project title (required)
 * @param {string} projectData.description - Project description (required)
 * @param {string} [projectData.recruitment_id] - Recruitment UUID (optional)
 * @param {string} [projectData.start_date] - Start date YYYY-MM-DD (optional)
 * @param {string} [projectData.end_date] - End date YYYY-MM-DD (optional)
 * @param {string} [projectData.status] - Status (optional, default: "예정")
 * @param {string} [projectData.role] - User role (optional)
 * @returns {Promise<Object>} Created project
 */
export const createProject = async (projectData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to create project');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

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

/**
 * Fetches project details by ID
 * @param {string} projectId - Project UUID
 * @returns {Promise<Object>} Project details
 */
export const fetchProjectDetails = async (projectId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to fetch project details');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};
