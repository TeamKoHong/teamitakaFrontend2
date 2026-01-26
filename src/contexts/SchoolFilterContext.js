/**
 * 학교별 콘텐츠 필터링 Context
 * 에브리타임 스타일로 교내/전체 콘텐츠 전환
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'schoolFilterMode';

const SchoolFilterContext = createContext(null);

/**
 * 필터 모드
 * - 'school': 교내 콘텐츠만 표시
 * - 'all': 전체 콘텐츠 표시
 */
export const FILTER_MODES = {
    SCHOOL: 'school',
    ALL: 'all',
};

export const SchoolFilterProvider = ({ children }) => {
    const { user } = useAuth();
    const [filterMode, setFilterModeState] = useState(FILTER_MODES.ALL);

    // 사용자 학교 정보
    const userUniversity = user?.university || null;

    // localStorage에서 설정 복원
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && Object.values(FILTER_MODES).includes(saved)) {
                // 학교 정보가 없으면 강제로 전체 모드
                if (!userUniversity && saved === FILTER_MODES.SCHOOL) {
                    setFilterModeState(FILTER_MODES.ALL);
                } else {
                    setFilterModeState(saved);
                }
            }
        } catch (error) {
            console.error('Failed to load school filter mode:', error);
        }
    }, [userUniversity]);

    // 필터 모드 변경
    const setFilterMode = useCallback((mode) => {
        // 학교 정보가 없으면 교내 모드 불가
        if (mode === FILTER_MODES.SCHOOL && !userUniversity) {
            console.warn('교내 필터를 사용하려면 학교 인증이 필요합니다.');
            return;
        }

        setFilterModeState(mode);
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch (error) {
            console.error('Failed to save school filter mode:', error);
        }
    }, [userUniversity]);

    // 토글 (교내 ↔ 전체)
    const toggleFilterMode = useCallback(() => {
        const nextMode = filterMode === FILTER_MODES.SCHOOL
            ? FILTER_MODES.ALL
            : FILTER_MODES.SCHOOL;
        setFilterMode(nextMode);
    }, [filterMode, setFilterMode]);

    // 교내 필터 사용 가능 여부
    const canUseSchoolFilter = !!userUniversity;

    // 현재 교내 모드인지
    const isSchoolMode = filterMode === FILTER_MODES.SCHOOL && canUseSchoolFilter;

    const value = {
        filterMode,
        setFilterMode,
        toggleFilterMode,
        userUniversity,
        canUseSchoolFilter,
        isSchoolMode,
        FILTER_MODES,
    };

    return (
        <SchoolFilterContext.Provider value={value}>
            {children}
        </SchoolFilterContext.Provider>
    );
};

export const useSchoolFilterContext = () => {
    const context = useContext(SchoolFilterContext);
    if (!context) {
        throw new Error('useSchoolFilterContext must be used within a SchoolFilterProvider');
    }
    return context;
};

export default SchoolFilterContext;
