/**
 * 학교별 콘텐츠 필터링 Context
 * 로그인 사용자: 자동으로 교내 콘텐츠만 표시
 * 비로그인 사용자: 전체 콘텐츠 표시
 */
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const SchoolFilterContext = createContext(null);

export const SchoolFilterProvider = ({ children }) => {
    const { user } = useAuth();

    // 사용자 학교 정보
    const userUniversity = user?.university || null;

    // 교내 필터 사용 가능 여부 (학교 정보가 있으면 자동 적용)
    const canUseSchoolFilter = !!userUniversity;

    // 로그인 사용자면 자동으로 교내 모드
    const isSchoolMode = canUseSchoolFilter;

    const value = {
        userUniversity,
        canUseSchoolFilter,
        isSchoolMode,
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
