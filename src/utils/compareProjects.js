/**
 * Project List Comparison Utility
 *
 * Compares server-side projects with UI-rendered projects to detect mismatches.
 * Helps ensure data consistency and catch filtering/sorting bugs.
 */

/**
 * Normalize date string to YYYY-MM-DD format for comparison
 * @param {string} dateStr - Date string in various formats
 * @returns {string} - Normalized date string
 */
function normalizeDate(dateStr) {
  if (!dateStr) return '';
  // Remove time component and normalize to YYYY-MM-DD
  return dateStr.replace(/\./g, '-').slice(0, 10);
}

/**
 * Compare two project lists and detect mismatches
 *
 * @param {Array} serverProjects - Raw projects from server API response
 * @param {Array} uiProjects - Projects currently displayed in UI
 * @param {Object} options - Comparison options
 * @param {string} options.filterRule - Description of the filter rule applied
 * @returns {Object} - Comparison report with mismatches and statistics
 */
export function compareProjectLists(serverProjects, uiProjects, options = {}) {
  const { filterRule = 'evaluation_status in [COMPLETED, NOT_REQUIRED]' } = options;

  const report = {
    serverCount: serverProjects.length,
    uiCount: uiProjects.length,
    filterRule,
    mismatches: {
      duplicateIds: [],
      missingFromUI: [],
      extraInUI: [],
      fieldMismatches: []
    },
    isConsistent: true
  };

  // Build ID maps
  const serverMap = new Map();
  const uiMap = new Map();

  serverProjects.forEach(p => {
    if (serverMap.has(p.project_id)) {
      report.mismatches.duplicateIds.push({
        source: 'server',
        id: p.project_id,
        title: p.title
      });
    }
    serverMap.set(p.project_id, p);
  });

  uiProjects.forEach(p => {
    if (uiMap.has(p.project_id)) {
      report.mismatches.duplicateIds.push({
        source: 'ui',
        id: p.project_id,
        title: p.title
      });
    }
    uiMap.set(p.project_id, p);
  });

  // Check for missing items (in server but not in UI)
  serverProjects.forEach(serverProj => {
    if (!uiMap.has(serverProj.project_id)) {
      report.mismatches.missingFromUI.push({
        id: serverProj.project_id,
        title: serverProj.title,
        status: serverProj.status,
        evaluation_status: serverProj.evaluation_status
      });
    }
  });

  // Check for extra items (in UI but not in server)
  uiProjects.forEach(uiProj => {
    if (!serverMap.has(uiProj.project_id)) {
      report.mismatches.extraInUI.push({
        id: uiProj.project_id,
        title: uiProj.title,
        status: uiProj.status,
        evaluation_status: uiProj.evaluation_status
      });
    }
  });

  // Check for field mismatches (same ID, different fields)
  serverProjects.forEach(serverProj => {
    const uiProj = uiMap.get(serverProj.project_id);
    if (!uiProj) return; // Already captured as missing

    const fieldDiffs = [];

    // Compare critical fields
    if (serverProj.title !== uiProj.title) {
      fieldDiffs.push({
        field: 'title',
        server: serverProj.title,
        ui: uiProj.title
      });
    }

    if (serverProj.status !== uiProj.status) {
      fieldDiffs.push({
        field: 'status',
        server: serverProj.status,
        ui: uiProj.status
      });
    }

    if (serverProj.evaluation_status !== uiProj.evaluation_status) {
      fieldDiffs.push({
        field: 'evaluation_status',
        server: serverProj.evaluation_status,
        ui: uiProj.evaluation_status
      });
    }

    // Compare dates (normalized)
    const serverStart = normalizeDate(serverProj.start_date);
    const uiStart = normalizeDate(uiProj.start_date);
    if (serverStart !== uiStart) {
      fieldDiffs.push({
        field: 'start_date',
        server: serverStart,
        ui: uiStart
      });
    }

    const serverEnd = normalizeDate(serverProj.end_date);
    const uiEnd = normalizeDate(uiProj.end_date);
    if (serverEnd !== uiEnd) {
      fieldDiffs.push({
        field: 'end_date',
        server: serverEnd,
        ui: uiEnd
      });
    }

    // Compare description (allow null/undefined/empty equivalence)
    const serverDesc = serverProj.description || '';
    const uiDesc = uiProj.description || '';
    if (serverDesc !== uiDesc) {
      fieldDiffs.push({
        field: 'description',
        server: serverDesc.slice(0, 50) + (serverDesc.length > 50 ? '...' : ''),
        ui: uiDesc.slice(0, 50) + (uiDesc.length > 50 ? '...' : '')
      });
    }

    if (fieldDiffs.length > 0) {
      report.mismatches.fieldMismatches.push({
        id: serverProj.project_id,
        title: serverProj.title,
        diffs: fieldDiffs
      });
    }
  });

  // Determine overall consistency
  report.isConsistent = (
    report.mismatches.duplicateIds.length === 0 &&
    report.mismatches.missingFromUI.length === 0 &&
    report.mismatches.extraInUI.length === 0 &&
    report.mismatches.fieldMismatches.length === 0
  );

  return report;
}

/**
 * Log comparison report to console
 *
 * @param {Object} report - Report from compareProjectLists()
 * @param {string} label - Label for the console group
 */
export function logComparisonReport(report, label = 'Project Comparison') {
  console.group(`🔍 ${label}`);

  console.log(`Filter Rule: ${report.filterRule}`);
  console.log(`Server Count: ${report.serverCount} | UI Count: ${report.uiCount}`);
  console.log(`Consistent: ${report.isConsistent ? '✅' : '❌'}`);

  if (!report.isConsistent) {
    // Log duplicate IDs
    if (report.mismatches.duplicateIds.length > 0) {
      console.warn(`⚠️ Duplicate IDs (${report.mismatches.duplicateIds.length}):`);
      console.table(report.mismatches.duplicateIds);
    }

    // Log missing items
    if (report.mismatches.missingFromUI.length > 0) {
      console.warn(`⚠️ Missing from UI (${report.mismatches.missingFromUI.length}):`);
      console.table(report.mismatches.missingFromUI);
    }

    // Log extra items
    if (report.mismatches.extraInUI.length > 0) {
      console.warn(`⚠️ Extra in UI (${report.mismatches.extraInUI.length}):`);
      console.table(report.mismatches.extraInUI);
    }

    // Log field mismatches
    if (report.mismatches.fieldMismatches.length > 0) {
      console.warn(`⚠️ Field Mismatches (${report.mismatches.fieldMismatches.length}):`);
      report.mismatches.fieldMismatches.forEach(mismatch => {
        console.group(`Project: ${mismatch.title} (ID: ${mismatch.id})`);
        console.table(mismatch.diffs);
        console.groupEnd();
      });
    }
  } else {
    console.log('✅ All checks passed - Server and UI are in sync');
  }

  console.groupEnd();
}
