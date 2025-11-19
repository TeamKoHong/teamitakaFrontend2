import { getApiConfig } from './auth';

/**
 * Maps frontend evaluation field names to backend Review model fields
 *
 * Frontend → Backend:
 * - participation → effort
 * - communication → communication
 * - responsibility → commitment
 * - collaboration → reflection
 * - individualAbility → ability
 * - overallRating (0-5) → overall_rating (1-5)
 * - roleDescription → role_description
 * - encouragementMessage → comment
 */
function mapEvaluationData(evaluationData, projectId, reviewerId, revieweeId) {
  const { categoryRatings, overallRating, roleDescription, encouragementMessage } = evaluationData;

  return {
    project_id: projectId,
    reviewer_id: reviewerId,
    reviewee_id: revieweeId,
    role_description: roleDescription || '',
    ability: categoryRatings.individualAbility,
    effort: categoryRatings.participation,
    commitment: categoryRatings.responsibility,
    communication: categoryRatings.communication,
    reflection: categoryRatings.collaboration,
    overall_rating: Math.max(1, overallRating), // Convert 0-5 to 1-5 (0 becomes 1)
    comment: encouragementMessage || '',
  };
}

/**
 * Submits team member evaluation to backend
 * @param {string} projectId - Project UUID
 * @param {string} reviewerId - Reviewer user UUID
 * @param {string} revieweeId - Reviewee user UUID
 * @param {object} evaluationData - Frontend evaluation data
 * @returns {Promise<object>} Created review
 */
export async function submitEvaluation(projectId, reviewerId, revieweeId, evaluationData) {
  try {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const mappedData = mapEvaluationData(evaluationData, projectId, reviewerId, revieweeId);

    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mappedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '평가 제출에 실패했습니다.');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('평가 제출 오류:', error);
    throw error;
  }
}

/**
 * Fetches all reviews for a project
 * @param {string} projectId - Project UUID
 * @returns {Promise<Array>} List of reviews
 */
export async function fetchProjectReviews(projectId) {
  try {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}/api/reviews/project/${projectId}`, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '평가 조회에 실패했습니다.');
    }

    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error('평가 조회 오류:', error);
    throw error;
  }
}

/**
 * Fetches project team members
 * @param {string} projectId - Project UUID
 * @returns {Promise<Array>} List of project members
 */
export async function fetchProjectMembers(projectId) {
  try {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members`, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '팀원 조회에 실패했습니다.');
    }

    const members = await response.json();
    return members;
  } catch (error) {
    console.error('팀원 조회 오류:', error);
    throw error;
  }
}

/**
 * Determines evaluation targets and their completion status
 * @param {string} projectId - Project UUID
 * @param {string} currentUserId - Current user UUID
 * @returns {Promise<object>} Evaluation targets with status
 */
export async function fetchEvaluationTargets(projectId, currentUserId) {
  try {
    const [members, reviews] = await Promise.all([
      fetchProjectMembers(projectId),
      fetchProjectReviews(projectId),
    ]);

    // Filter out current user from evaluation targets
    const targets = members.filter(member => member.user_id !== currentUserId);

    // Check which members have been reviewed by current user
    const reviewedMemberIds = new Set(
      reviews
        .filter(review => review.reviewer_id === currentUserId)
        .map(review => review.reviewee_id)
    );

    // Map targets with completion status
    const targetsWithStatus = targets.map(member => ({
      id: member.user_id,
      name: member.User?.username || '알 수 없음',
      email: member.User?.email || '',
      role: member.role || '팀원',
      status: reviewedMemberIds.has(member.user_id) ? 'completed' : 'pending',
    }));

    // Get next pending member
    const nextPending = targetsWithStatus.find(target => target.status === 'pending');

    return {
      targets: targetsWithStatus,
      nextPendingMember: nextPending || null,
      allCompleted: targetsWithStatus.every(target => target.status === 'completed'),
    };
  } catch (error) {
    console.error('평가 대상 조회 오류:', error);
    throw error;
  }
}
