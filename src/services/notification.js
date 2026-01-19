import { getApiConfig } from './auth';

/**
 * Fetches notifications for a specific project
 * @param {string} projectId - Project UUID
 * @returns {Promise<Array>} List of notifications
 */
export async function fetchProjectNotifications(projectId) {
    try {
        const { API_BASE_URL, headers } = getApiConfig();
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/notifications`, {
            method: 'GET',
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // 404 means no notifications found, return empty array
            if (response.status === 404) {
                return [];
            }
            const errorData = await response.json();
            throw new Error(errorData.error || '알림 조회에 실패했습니다.');
        }

        const result = await response.json();
        return result.data || result || [];
    } catch (error) {
        console.error('알림 조회 오류:', error);
        // Return empty array on error to prevent UI crash, but log error
        return [];
    }
}
