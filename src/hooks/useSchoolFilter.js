/**
 * 학교별 콘텐츠 필터링 훅
 * 배열 데이터를 현재 사용자 학교 기준으로 필터링
 */
import { useCallback } from 'react';
import { useSchoolFilterContext, FILTER_MODES } from '../contexts/SchoolFilterContext';
import { isSameUniversity } from '../constants/schools';

/**
 * 학교별 필터링 기능을 제공하는 훅
 * @returns {Object} 필터링 관련 함수와 상태
 */
export const useSchoolFilter = () => {
    const {
        filterMode,
        setFilterMode,
        toggleFilterMode,
        userUniversity,
        canUseSchoolFilter,
        isSchoolMode,
    } = useSchoolFilterContext();

    /**
     * 아이템이 현재 사용자 학교와 같은지 확인
     * @param {string} itemUniversity - 아이템의 학교명
     * @returns {boolean}
     */
    const isSchoolMatch = useCallback((itemUniversity) => {
        if (!userUniversity || !itemUniversity) return false;
        return isSameUniversity(itemUniversity, userUniversity);
    }, [userUniversity]);

    /**
     * 배열을 학교 기준으로 필터링
     * @param {Array} items - 필터링할 배열
     * @param {string} universityKey - 학교 정보가 들어있는 키 (기본: 'university')
     * @returns {Array} - 필터링된 배열
     */
    const filterBySchool = useCallback((items, universityKey = 'university') => {
        if (!Array.isArray(items)) return [];

        // 전체 모드이거나 학교 필터 사용 불가능한 경우 전체 반환
        if (!isSchoolMode) {
            return items;
        }

        // 교내 모드: 같은 학교만 필터링
        return items.filter(item => {
            const itemUniversity = item?.[universityKey];
            // 학교 정보가 없는 아이템은 전체 모드에서만 표시
            if (!itemUniversity) return false;
            return isSchoolMatch(itemUniversity);
        });
    }, [isSchoolMode, isSchoolMatch]);

    /**
     * 필터 적용된 아이템 수 계산
     * @param {Array} items - 원본 배열
     * @param {string} universityKey - 학교 정보 키
     * @returns {Object} - { total, schoolOnly }
     */
    const getFilterStats = useCallback((items, universityKey = 'university') => {
        if (!Array.isArray(items)) return { total: 0, schoolOnly: 0 };

        const total = items.length;
        const schoolOnly = items.filter(item => {
            const itemUniversity = item?.[universityKey];
            return itemUniversity && isSchoolMatch(itemUniversity);
        }).length;

        return { total, schoolOnly };
    }, [isSchoolMatch]);

    return {
        // 상태
        filterMode,
        isSchoolMode,
        userUniversity,
        canUseSchoolFilter,

        // 액션
        setFilterMode,
        toggleFilterMode,

        // 필터링 함수
        filterBySchool,
        isSchoolMatch,
        getFilterStats,

        // 상수
        FILTER_MODES,
    };
};

export default useSchoolFilter;
