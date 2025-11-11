import React from 'react';
import './DebugBadge.scss';

/**
 * DebugBadge Component
 *
 * Shows server/UI project counts and sync status in development mode.
 * Useful for verifying data consistency during development.
 *
 * @param {Object} props
 * @param {number} props.serverCount - Number of projects from server
 * @param {number} props.uiCount - Number of projects displayed in UI
 * @param {boolean} props.isConsistent - Whether server and UI are in sync
 * @param {Function} props.onClick - Optional click handler to view details
 */
const DebugBadge = ({ serverCount, uiCount, isConsistent, onClick }) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const statusIcon = isConsistent ? '✓' : '⚠';
  const statusText = isConsistent ? 'in-sync' : 'mismatch';
  const statusClass = isConsistent ? 'status-ok' : 'status-warning';

  return (
    <div
      className={`debug-badge ${statusClass}`}
      onClick={onClick}
      role={onClick ? 'button' : 'status'}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="badge-header">
        <span className="badge-icon">{statusIcon}</span>
        <span className="badge-label">Data Sync</span>
      </div>
      <div className="badge-counts">
        <span className="count-item">
          <span className="count-label">S:</span>
          <span className="count-value">{serverCount}</span>
        </span>
        <span className="count-divider">/</span>
        <span className="count-item">
          <span className="count-label">UI:</span>
          <span className="count-value">{uiCount}</span>
        </span>
      </div>
      <div className="badge-status">{statusText}</div>
    </div>
  );
};

export default DebugBadge;
