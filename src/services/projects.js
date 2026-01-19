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

/**
 * Fetches project members by project ID
 * @param {string} projectId - Project UUID
 * @returns {Promise<Object>} Project members list
 */
export const fetchProjectMembers = async (projectId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members`, {
        method: 'GET',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('RESOURCE_NOT_FOUND');
        err.code = 'RESOURCE_NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to fetch project members');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Fetches project meetings by project ID
 * @param {string} projectId - Project UUID
 * @returns {Promise<Object>} Meeting list with items and total
 */
export const getProjectMeetings = async (projectId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/meetings`, {
        method: 'GET',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('RESOURCE_NOT_FOUND');
        err.code = 'RESOURCE_NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to fetch meetings');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    const result = await res.json();
    return result.data || result; // { items: [...], total: number }
};

/**
 * Creates a new meeting record
 * @param {string} projectId - Project UUID
 * @param {Object} meetingData - Meeting data
 * @param {string} meetingData.title - Meeting title (required)
 * @param {string} meetingData.content - Meeting content (required)
 * @param {string} [meetingData.meeting_date] - Meeting date YYYY-MM-DD (optional, defaults to today)
 * @returns {Promise<Object>} Created meeting data
 */
export const createMeeting = async (projectId, meetingData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/meetings`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(meetingData),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 400) {
        const errorData = await res.json();
        const err = new Error(errorData.message || '제목과 회의 날짜는 필수입니다');
        err.code = 'VALIDATION_ERROR';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to create meeting');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    const result = await res.json();
    return result.data || result;
};

/**
 * Fetches project schedules by project ID
 * @param {string} projectId - Project UUID
 * @returns {Promise<Array>} Schedule list
 */
export const getProjectSchedules = async (projectId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/schedule/project/${projectId}`, {
        method: 'GET',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('RESOURCE_NOT_FOUND');
        err.code = 'RESOURCE_NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to fetch schedules');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    const result = await res.json();
    // 백엔드 응답이 배열이면 그대로, 객체면 data 추출
    return Array.isArray(result) ? result : (result.data || result);
};

/**
 * Updates project member roles and tasks
 * @param {string} projectId - Project UUID
 * @param {Array} members - Array of members to update
 * @param {string} members[].user_id - User UUID
 * @param {string} [members[].role] - Role ('팀장' or '팀원')
 * @param {string} [members[].task] - Task description
 * @returns {Promise<Object>} Update result
 */
export const updateProjectMembers = async (projectId, members) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members`, {
        method: 'PUT',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ members }),
    });

    if (res.status === 401) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 403) {
        const errorData = await res.json();
        const err = new Error(errorData.message || '팀장만 멤버 역할을 수정할 수 있습니다');
        err.code = 'NOT_PROJECT_LEADER';
        throw err;
    }

    if (res.status === 404) {
        const errorData = await res.json();
        const err = new Error(errorData.message || '해당 멤버를 찾을 수 없습니다');
        err.code = 'MEMBER_NOT_FOUND';
        throw err;
    }

    if (res.status === 400) {
        const errorData = await res.json();
        const err = new Error(errorData.message || '유효성 검사 실패');
        err.code = 'VALIDATION_ERROR';
        err.errors = errorData.errors;
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to update members');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Fetches project todos
 * @param {string} projectId - Project UUID
 * @returns {Promise<Object>} Todo list with items and total
 */
export const getProjectTodos = async (projectId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/todo`, {
        method: 'GET',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('RESOURCE_NOT_FOUND');
        err.code = 'RESOURCE_NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to fetch todos');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Updates a todo (status or content)
 * @param {string} projectId - Project UUID
 * @param {string} todoId - Todo UUID
 * @param {Object} updateData - Update data
 * @param {string} [updateData.status] - Todo status ("COMPLETED" or "PENDING")
 * @param {string} [updateData.title] - Todo title
 * @returns {Promise<Object>} Updated todo data
 */
export const updateProjectTodo = async (projectId, todoId, updateData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/todo/${todoId}`, {
        method: 'PUT',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('RESOURCE_NOT_FOUND');
        err.code = 'RESOURCE_NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to update todo');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Creates a new todo for a project
 * @param {string} projectId - Project UUID
 * @param {string} content - Todo content
 * @returns {Promise<Object>} Created todo data
 */
export const createProjectTodo = async (projectId, content) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    // content 유효성 검사
    if (!content || !content.trim()) {
        const err = new Error('내용을 입력해주세요');
        err.code = 'VALIDATION_ERROR';
        throw err;
    }

    const requestBody = { title: content.trim() };
    
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/todo`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 400) {
        const errorData = await res.json().catch(() => ({ message: '유효성 검사 실패' }));
        const err = new Error(errorData.message || '유효성 검사 실패');
        err.code = 'VALIDATION_ERROR';
        err.errors = errorData.errors;
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('RESOURCE_NOT_FOUND');
        err.code = 'RESOURCE_NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to create todo');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Fetches project activity logs (completed todos by team members)
 * @param {string} projectId - Project UUID
 * @param {number} [limit=5] - Number of items to fetch (default: 5)
 * @param {number} [offset=0] - Number of items to skip (default: 0)
 * @returns {Promise<Object>} Activity logs with pagination info
 */
export const getProjectActivityLogs = async (projectId, limit = 5, offset = 0) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const qs = new URLSearchParams({ 
        limit: String(limit), 
        offset: String(offset) 
    }).toString();

    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/activity-log?${qs}`, {
        method: 'GET',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    // 404는 활동 로그가 없거나 엔드포인트가 아직 구현되지 않은 경우로 처리
    // 조용히 빈 결과를 반환
    if (res.status === 404) {
        return {
            activity_logs: [],
            total: 0,
            limit,
            offset
        };
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || errorData.error || 'Failed to fetch activity logs');
        err.code = errorData.error?.code || 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};