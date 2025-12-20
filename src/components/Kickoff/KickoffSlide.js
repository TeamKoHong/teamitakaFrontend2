import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import './KickoffSlide.scss';
import DefaultHeader from '../Common/DefaultHeader';
import DateRangePickerSheet from '../ProjectRecruit/DateRangePicker/DateRangePickerSheet';

export default function KickoffSlide({ open, onClose, onComplete }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const isValidRange = useMemo(() => {
    if (!start || !end) return false;
    return new Date(start) <= new Date(end);
  }, [start, end]);

  const isReady = Boolean(title.trim()) && isValidRange;

  // Format dates for display
  const formattedDateRange = useMemo(() => {
    if (!start || !end) return '';
    const startFormatted = dayjs(start).format('YYYY.MM.DD');
    const endFormatted = dayjs(end).format('YYYY.MM.DD');
    return `${startFormatted} - ${endFormatted}`;
  }, [start, end]);

  const handleDateRangeSelect = (startDate, endDate) => {
    setStart(dayjs(startDate).format('YYYY-MM-DD'));
    setEnd(dayjs(endDate).format('YYYY-MM-DD'));
  };

  const handleNext = () => {
    if (!isReady) return;
    
    if (onComplete) {
      onComplete({ title, desc, start, end });
    }
  };

  return (
    <>
      <div className={`kickoff-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`kickoff-panel ${open ? "open" : ""}`}>
        <DefaultHeader title="프로젝트 킥오프" onBack={onClose} />
        
        <div className="kickoff-content">
        <div className="kickoff-title">프로젝트 킥오프</div>
          <div className="section">
            <div className="label">제목</div>
            <div className={`field ${title ? 'field--active' : ''}`}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 15))}
                placeholder="프로젝트 제목을 입력해주세요."
                maxLength={15}
              />
            </div>
          </div>

          {/* 프로젝트 진행 기간 */}
          <div className="section">
            <div className="label">프로젝트 진행 기간</div>
            <button
              type="button"
              className={`field date-picker-btn ${start && end ? 'field--active' : ''}`}
              onClick={() => {
                console.log('🔍 날짜 선택 버튼 클릭');
                setDatePickerOpen(true);
              }}
            >
              <span className="date-picker-text">
                {formattedDateRange || '프로젝트 진행 기간을 설정해주세요.'}
              </span>
            </button>
          </div>

          {/* 프로젝트 설명 또는 다짐 */}
          <div className="section">
            <div className="label">프로젝트 설명 또는 다짐</div>
            <div className={`field ${desc ? 'field--active' : ''}`}>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="협상의 기술 중간고사 팀플입니다."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="kickoff-footer">
          <button
            className={`kickoff-button ${isReady ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!isReady}
          >
            프로젝트 시작하기!
          </button>
        </div>
      </div>

      {/* Date Range Picker Bottom Sheet */}
      <DateRangePickerSheet
        open={datePickerOpen}
        onDismiss={() => setDatePickerOpen(false)}
        onComplete={handleDateRangeSelect}
        initialStart={start ? new Date(start) : null}
        initialEnd={end ? new Date(end) : null}
        maxRangeWeeks={12}
        title="프로젝트 진행 기간을 선택해주세요."
      />
    </>
  );
}

