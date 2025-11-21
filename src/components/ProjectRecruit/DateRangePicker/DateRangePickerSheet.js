// src/components/ProjectRecruit/DateRangePicker/DateRangePickerSheet.js
import React, { useState } from 'react';
import BottomSheet from '../../Common/BottomSheet';
import DateRangePicker from './DateRangePicker';
import './DateRangePickerSheet.scss';

export default function DateRangePickerSheet({
  open,
  onDismiss,
  onComplete,
  initialStart = null,
  initialEnd = null,
  maxRangeWeeks = 2,
}) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const handleDateSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleComplete = () => {
    if (startDate && endDate) {
      onComplete(startDate, endDate);
      onDismiss();
    }
  };

  const handleCancel = () => {
    // Reset to initial values on cancel
    setStartDate(initialStart);
    setEndDate(initialEnd);
    onDismiss();
  };

  const bothSelected = startDate && endDate;

  return (
    <BottomSheet
      open={open}
      onDismiss={handleCancel}
      className="date-range-picker-sheet"
      blocking={false}
    >
      <div className="picker-sheet-container">
        {/* Header */}
        <div className="picker-sheet-header">
          <h3 className="picker-sheet-title">모집 기간을 선택해주세요.</h3>
          <button
            className={`complete-btn ${!bothSelected ? 'disabled' : ''}`}
            onClick={handleComplete}
            disabled={!bothSelected}
            aria-label="완료"
          >
            완료
          </button>
        </div>

        {/* Calendar */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
          maxRangeWeeks={maxRangeWeeks}
        />
      </div>
    </BottomSheet>
  );
}
