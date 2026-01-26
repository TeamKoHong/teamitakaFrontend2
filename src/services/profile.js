import { apiFetch } from './api';

/**
 * 프로필 상세 정보 조회
 * @returns {Promise<Object>} 프로필 상세 정보
 */
export const getProfileDetail = async () => {
    try {
        const res = await apiFetch('/api/profile/detail');

        if (!res.ok) {
            // API 미구현 시 Mock 데이터 반환
            console.log('📊 [Mock] 프로필 상세 정보 반환');
            return {
                success: true,
                data: {
                    currentProjects: 2,
                    totalTeamExperience: 5,
                    tags: ['브랜딩', 'UXUI'],
                    activityType: {
                        type: '활동티미',
                        description: '활동적이고 긍정적인',
                    },
                    skills: {
                        노력: 80,
                        업무능력: 75,
                        성장: 90,
                        소통: 85,
                        의지: 70,
                    },
                    feedback: {
                        positive: ['책임감이 강해요', '소통을 잘해요', '피드백을 잘 수용해요'],
                        negative: ['일정 관리가 필요해요', '문서화 습관이 필요해요'],
                    },
                    projects: [],
                    totalProjects: 5,
                },
            };
        }

        return res.json();
    } catch (err) {
        // 네트워크 오류 등의 경우 Mock 데이터 반환
        console.log('📊 [Mock] 네트워크 오류로 프로필 상세 정보 Mock 반환');
        return {
            success: true,
            data: {
                currentProjects: 2,
                totalTeamExperience: 5,
                tags: ['브랜딩', 'UXUI'],
                activityType: {
                    type: '활동티미',
                    description: '활동적이고 긍정적인',
                },
                skills: {
                    노력: 80,
                    업무능력: 75,
                    성장: 90,
                    소통: 85,
                    의지: 70,
                },
                feedback: {
                    positive: ['책임감이 강해요', '소통을 잘해요', '피드백을 잘 수용해요'],
                    negative: ['일정 관리가 필요해요', '문서화 습관이 필요해요'],
                },
                projects: [],
                totalProjects: 5,
            },
        };
    }
};

/**
 * 대학 인증 정보 조회
 * @returns {Promise<Object>} 인증 정보
 */
export const getVerificationInfo = async () => {
    try {
        const res = await apiFetch('/api/profile/verification');

        if (!res.ok) {
            // API 미구현 시 Mock 데이터 반환
            console.log('🎓 [Mock] 대학 인증 정보 반환');
            return {
                success: true,
                data: {
                    isVerified: true,
                    verifiedAt: '2024-03-10',
                    university: '홍익대학교',
                    department: '디자인학부',
                    username: '김조형',
                    status: '인증 완료',
                },
            };
        }

        return res.json();
    } catch (err) {
        // 네트워크 오류 등의 경우 Mock 데이터 반환
        console.log('🎓 [Mock] 네트워크 오류로 대학 인증 정보 Mock 반환');
        return {
            success: true,
            data: {
                isVerified: true,
                verifiedAt: '2024-03-10',
                university: '홍익대학교',
                department: '디자인학부',
                username: '김조형',
                status: '인증 완료',
            },
        };
    }
};
