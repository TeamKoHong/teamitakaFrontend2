import React from 'react';
import { PiCaretDownFill } from 'react-icons/pi';
import './EvaluationAlert.scss';

const EvaluationAlert = ({ pendingCount, sortBy, onSortChange }) => {
  if (pendingCount === 0) return null;

  return (
    <div className="evaluation-alert">
      <p className="alert-text">
        팀원 평가가 이뤄지지 않은<br />
        프로젝트가 <span className="highlight-count">{pendingCount}개</span> 있어요!
      </p>

      <div className="sort-dropdown-wrapper">
        <select
          className="sort-dropdown"
          value={sortBy}
          onChange={onSortChange}
        >
          <option value="latest">최신순</option>
          <option value="date">완료 날짜순</option>
          <option value="rating">평점순</option>
        </select>
        <PiCaretDownFill className="dropdown-icon" />
      </div>
    </div>
  );
};

export default EvaluationAlert;
