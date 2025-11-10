/**
 * 날짜 문자열을 "YYYY.MM.DD" 형식으로 변환
 * @param {string} dateString - ISO 날짜 문자열 (예: "2025-01-23")
 * @returns {string} - 변환된 날짜 문자열 (예: "2025.01.23")
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return dateString.replace(/-/g, '.').slice(0, 10);
}

/**
 * 시작일과 종료일을 "YYYY.MM.DD - YYYY.MM.DD" 형식으로 반환
 * @param {string} startDate - 시작일 (ISO 형식)
 * @param {string} endDate - 종료일 (ISO 형식)
 * @returns {string} - 날짜 범위 문자열
 */
export function formatDateRange(startDate, endDate) {
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }
  return formattedStart || formattedEnd || '';
}
