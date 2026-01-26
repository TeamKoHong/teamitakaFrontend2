/**
 * 학교 이메일 도메인 매핑
 * 회원가입 시 입력한 학교 이메일로 학교명을 자동 감지
 */

export const SCHOOL_EMAIL_DOMAINS = {
    // 서울권
    'snu.ac.kr': '서울대학교',
    'yonsei.ac.kr': '연세대학교',
    'korea.ac.kr': '고려대학교',
    'skku.edu': '성균관대학교',
    'hanyang.ac.kr': '한양대학교',
    'cau.ac.kr': '중앙대학교',
    'khu.ac.kr': '경희대학교',
    'ewha.ac.kr': '이화여자대학교',
    'sogang.ac.kr': '서강대학교',
    'hufs.ac.kr': '한국외국어대학교',
    'uos.ac.kr': '서울시립대학교',
    'sungshin.ac.kr': '성신여자대학교',
    'duksung.ac.kr': '덕성여자대학교',
    'dongguk.edu': '동국대학교',
    'hongik.ac.kr': '홍익대학교',
    'konkuk.ac.kr': '건국대학교',
    'kw.ac.kr': '광운대학교',
    'sejong.ac.kr': '세종대학교',
    'ssu.ac.kr': '숭실대학교',
    'sm.ac.kr': '숙명여자대학교',

    // 과학기술 특성화
    'kaist.ac.kr': '카이스트',
    'postech.ac.kr': '포스텍',
    'gist.ac.kr': '지스트',
    'unist.ac.kr': '유니스트',
    'dgist.ac.kr': '디지스트',

    // 지방 거점
    'pusan.ac.kr': '부산대학교',
    'knu.ac.kr': '경북대학교',
    'jnu.ac.kr': '전남대학교',
    'jbnu.ac.kr': '전북대학교',
    'cnu.ac.kr': '충남대학교',
    'chungbuk.ac.kr': '충북대학교',
    'kangwon.ac.kr': '강원대학교',
    'gnu.ac.kr': '경상대학교',
    'jejunu.ac.kr': '제주대학교',

    // 인천/경기
    'inha.ac.kr': '인하대학교',
    'ajou.ac.kr': '아주대학교',
    'kgu.ac.kr': '경기대학교',
    'inu.ac.kr': '인천대학교',

    // 기타 주요 대학
    'dgu.ac.kr': '동국대학교',
    'catholic.ac.kr': '가톨릭대학교',
    'kookmin.ac.kr': '국민대학교',
    'dankook.ac.kr': '단국대학교',
    'soongsil.ac.kr': '숭실대학교',
    'mju.ac.kr': '명지대학교',
    'sangmyung.kr': '상명대학교',
};

/**
 * 이메일 주소에서 학교명 추출
 * @param {string} email - 학교 이메일 주소
 * @returns {string|null} - 학교명 또는 null
 */
export const getSchoolFromEmail = (email) => {
    if (!email || typeof email !== 'string') return null;

    const atIndex = email.indexOf('@');
    if (atIndex === -1) return null;

    const domain = email.slice(atIndex + 1).toLowerCase();

    // 직접 매핑 확인
    if (SCHOOL_EMAIL_DOMAINS[domain]) {
        return SCHOOL_EMAIL_DOMAINS[domain];
    }

    // 서브도메인 처리 (예: mail.snu.ac.kr -> snu.ac.kr)
    const parts = domain.split('.');
    if (parts.length > 2) {
        const mainDomain = parts.slice(-3).join('.');
        if (SCHOOL_EMAIL_DOMAINS[mainDomain]) {
            return SCHOOL_EMAIL_DOMAINS[mainDomain];
        }
        // ac.kr 또는 edu 도메인
        const altDomain = parts.slice(-2).join('.');
        if (altDomain === 'ac.kr' || altDomain === 'edu') {
            const schoolDomain = parts.slice(-3).join('.');
            if (SCHOOL_EMAIL_DOMAINS[schoolDomain]) {
                return SCHOOL_EMAIL_DOMAINS[schoolDomain];
            }
        }
    }

    return null;
};

/**
 * 이메일 도메인 유효성 검사
 * @param {string} email - 학교 이메일 주소
 * @returns {boolean} - 유효한 학교 이메일인지 여부
 */
export const isValidSchoolEmail = (email) => {
    return getSchoolFromEmail(email) !== null;
};
