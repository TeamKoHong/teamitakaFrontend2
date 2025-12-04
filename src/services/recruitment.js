import { getApiConfig } from './auth';

/**
 * Creates a new recruitment
 * @param {Object} recruitmentData - Recruitment data
 * @param {string} recruitmentData.title - Recruitment title (required)
 * @param {string} recruitmentData.description - Recruitment description (required)
 * @param {number} [recruitmentData.max_applicants] - Maximum number of applicants (optional)
 * @param {string} [recruitmentData.photo] - Photo URL or data URL (optional)
 * @param {string} [recruitmentData.recruitment_start] - Start date YYYY-MM-DD (optional)
 * @param {string} [recruitmentData.recruitment_end] - End date YYYY-MM-DD (optional)
 * @param {string} [recruitmentData.project_type] - Project type: 'course' or 'side' (optional)
 * @returns {Promise<Object>} Created recruitment
 */
export const createRecruitment = async (recruitmentData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recruitmentData),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Backend error response:', errorData);
        const err = new Error(errorData.error || 'Failed to create recruitment');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Uploads a recruitment image
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} Upload result with photo_url
 */
export const uploadRecruitmentImage = async (imageFile) => {
    const { API_BASE_URL } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (imageFile.size > MAX_SIZE) {
        const err = new Error('파일 크기는 5MB를 초과할 수 없습니다.');
        err.code = 'FILE_TOO_LARGE';
        throw err;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
        const err = new Error('허용되지 않는 파일 형식입니다. (jpeg, png, webp만 가능)');
        err.code = 'INVALID_FILE_TYPE';
        throw err;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await fetch(`${API_BASE_URL}/api/upload/recruitment-image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || 'Failed to upload image');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    const result = await res.json();
    return result.data.photo_url;
};

/**
 * Gets a recruitment by ID
 * @param {string} recruitmentId - Recruitment UUID
 * @returns {Promise<Object>} Recruitment data
 */
export const getRecruitment = async (recruitmentId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('로그인이 필요합니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}`, {
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
        const err = new Error('모집글을 찾을 수 없습니다.');
        err.code = 'NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || 'Failed to fetch recruitment');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Gets applicants for a recruitment
 * @param {string} recruitmentId - Recruitment UUID
 * @returns {Promise<Object>} Applicants data
 */
export const getRecruitmentApplicants = async (recruitmentId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}/applications`, {
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

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to fetch applicants');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Approves an applicant
 * @param {string} applicationId - Application UUID
 * @returns {Promise<Object>} Approval result
 */
export const approveApplicant = async (applicationId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/applications/${applicationId}/approve`, {
        method: 'POST',
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

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to approve applicant');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Submits an application to a recruitment
 * @param {string} recruitmentId - Recruitment UUID
 * @param {Object} applicationData - Application data
 * @param {string} applicationData.introduction - Self-introduction (required, 1-500 chars)
 * @param {Array<string>} [applicationData.portfolio_project_ids] - Portfolio project IDs (optional)
 * @returns {Promise<Object>} Created application
 */
export const submitApplication = async (recruitmentId, applicationData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('로그인이 필요합니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/applications/${recruitmentId}`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
    });

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.message || '지원서 제출에 실패했습니다.');
        err.code = data.error || 'SERVER_ERROR';
        err.statusCode = res.status;
        throw err;
    }

    return data.data;
};

/**
 * Converts recruitment to project
 * @param {string} recruitmentId - Recruitment UUID
 * @returns {Promise<Object>} Created project
 */
export const convertToProject = async (recruitmentId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/projects/from-recruitment/${recruitmentId}`, {
        method: 'POST',
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

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.error || 'Failed to convert to project');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Gets user's own recruitments
 * @param {Object} options - Query options
 * @param {number} [options.limit=10] - Maximum number of results
 * @param {number} [options.offset=0] - Pagination offset
 * @returns {Promise<Object>} User's recruitments { success, items, page }
 */
export const getMyRecruitments = async ({ limit = 10, offset = 0 } = {}) => {
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

    const res = await fetch(`${API_BASE_URL}/api/recruitments/mine?${qs}`, {
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`
        },
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
 * Updates a recruitment
 * @param {string} recruitmentId - Recruitment UUID
 * @param {Object} recruitmentData - Updated recruitment data
 * @param {string} [recruitmentData.title] - Recruitment title (optional)
 * @param {string} [recruitmentData.description] - Recruitment description (optional)
 * @param {number} [recruitmentData.max_applicants] - Maximum number of applicants (optional)
 * @param {string} [recruitmentData.photo] - Photo URL or data URL (optional)
 * @param {string} [recruitmentData.recruitment_start] - Start date YYYY-MM-DD (optional)
 * @param {string} [recruitmentData.recruitment_end] - End date YYYY-MM-DD (optional)
 * @param {string} [recruitmentData.project_type] - Project type: 'course' or 'side' (optional)
 * @returns {Promise<Object>} Updated recruitment
 */
export const updateRecruitment = async (recruitmentId, recruitmentData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('로그인이 필요합니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}`, {
        method: 'PUT',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recruitmentData),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('권한이 없습니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('모집글을 찾을 수 없습니다.');
        err.code = 'NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Update recruitment error:', errorData);
        const err = new Error(errorData.error || '모집글 수정에 실패했습니다.');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};

/**
 * Deletes a recruitment
 * @param {string} recruitmentId - Recruitment UUID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteRecruitment = async (recruitmentId) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
        const err = new Error('로그인이 필요합니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    const res = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}`, {
        method: 'DELETE',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('권한이 없습니다.');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 404) {
        const err = new Error('모집글을 찾을 수 없습니다.');
        err.code = 'NOT_FOUND';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        console.error('🚨 Delete recruitment error:', errorData);
        const err = new Error(errorData.error || '모집글 삭제에 실패했습니다.');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};
