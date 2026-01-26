/**
 * 학교 필터 토글 컴포넌트
 * 에브리타임 스타일의 교내/전체 전환 세그먼트 컨트롤
 */
import React from 'react';
import { useSchoolFilter } from '../../../hooks/useSchoolFilter';
import { getShortSchoolName } from '../../../constants/schools';
import styles from './SchoolFilterToggle.module.scss';

const SchoolFilterToggle = ({ className = '' }) => {
    const {
        filterMode,
        setFilterMode,
        userUniversity,
        canUseSchoolFilter,
        FILTER_MODES,
    } = useSchoolFilter();

    // 학교 인증 안 된 경우 표시 안 함
    if (!canUseSchoolFilter) {
        return null;
    }

    const shortName = getShortSchoolName(userUniversity) || '교내';

    return (
        <div className={`${styles.toggleContainer} ${className}`}>
            <button
                type="button"
                className={`${styles.toggleButton} ${filterMode === FILTER_MODES.SCHOOL ? styles.active : ''}`}
                onClick={() => setFilterMode(FILTER_MODES.SCHOOL)}
            >
                {shortName}
            </button>
            <button
                type="button"
                className={`${styles.toggleButton} ${filterMode === FILTER_MODES.ALL ? styles.active : ''}`}
                onClick={() => setFilterMode(FILTER_MODES.ALL)}
            >
                전체
            </button>
        </div>
    );
};

export default SchoolFilterToggle;
