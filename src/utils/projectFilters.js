/**
 * Project Filtering and Sorting Utilities
 *
 * Standardized rules for filtering and sorting projects to ensure consistency
 * between server data and UI display.
 */

/**
 * Check if a project is in "completed" status
 * Single source of truth for completion filter
 *
 * @param {Object} project - Project object
 * @returns {boolean} - True if project status is COMPLETED
 */
export function isCompleted(project) {
  return project.status === 'COMPLETED' || project.status === 'completed';
}

/**
 * Check if a project evaluation is pending
 *
 * @param {Object} project - Project object
 * @returns {boolean} - True if evaluation is pending
 */
export function isEvaluationPending(project) {
  return project.evaluation_status === 'PENDING';
}

/**
 * Check if a project evaluation is completed or not required
 *
 * @param {Object} project - Project object
 * @returns {boolean} - True if evaluation is completed or not required
 */
export function isEvaluationCompleted(project) {
  return (
    project.evaluation_status === 'COMPLETED' ||
    project.evaluation_status === 'NOT_REQUIRED'
  );
}

/**
 * Sort projects by end date (descending - newest first)
 *
 * @param {Array} projects - Array of projects
 * @returns {Array} - Sorted array (new array, doesn't mutate original)
 */
export function sortByEndDateDesc(projects) {
  return [...projects].sort((a, b) => {
    const dateA = a.end_date ? new Date(a.end_date) : new Date(0);
    const dateB = b.end_date ? new Date(b.end_date) : new Date(0);
    return dateB - dateA; // Descending (newest first)
  });
}

/**
 * Sort projects by end date (ascending - oldest first)
 *
 * @param {Array} projects - Array of projects
 * @returns {Array} - Sorted array (new array, doesn't mutate original)
 */
export function sortByEndDateAsc(projects) {
  return [...projects].sort((a, b) => {
    const dateA = a.end_date ? new Date(a.end_date) : new Date(0);
    const dateB = b.end_date ? new Date(b.end_date) : new Date(0);
    return dateA - dateB; // Ascending (oldest first)
  });
}

/**
 * Filter and sort completed projects - standardized pipeline
 *
 * @param {Array} projects - Raw projects from server
 * @param {Object} options - Filter/sort options
 * @param {string} options.sortOrder - 'desc' (default) or 'asc'
 * @returns {Object} - Filtered and sorted projects by evaluation status
 */
export function processCompletedProjects(projects, options = {}) {
  const { sortOrder = 'desc' } = options;

  // Filter only completed projects
  const completedProjects = projects.filter(isCompleted);

  // Sort by end date
  const sorted = sortOrder === 'asc'
    ? sortByEndDateAsc(completedProjects)
    : sortByEndDateDesc(completedProjects);

  // Split by evaluation status
  const pending = sorted.filter(isEvaluationPending);
  const completed = sorted.filter(isEvaluationCompleted);

  return {
    all: sorted,
    pending,
    completed
  };
}

/**
 * Get filter rule description for logging
 *
 * @param {string} filterType - Type of filter applied
 * @returns {string} - Human-readable filter description
 */
export function getFilterRuleDescription(filterType) {
  switch (filterType) {
    case 'completed':
      return 'status === "COMPLETED"';
    case 'evaluation-pending':
      return 'evaluation_status === "PENDING"';
    case 'evaluation-completed':
      return 'evaluation_status in ["COMPLETED", "NOT_REQUIRED"]';
    default:
      return filterType;
  }
}
