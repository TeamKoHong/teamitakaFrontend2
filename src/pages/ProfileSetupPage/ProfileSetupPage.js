import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/DesignSystem/Button/Button';
import ProgressIndicator from '../../components/auth/ProgressIndicator';
import styles from './ProfileSetupPage.module.scss';

// 임시 학교 데이터
const SCHOOL_OPTIONS = [
    { id: 1, name: '서울대학교' },
    { id: 2, name: '연세대학교' },
    { id: 3, name: '고려대학교' },
    { id: 4, name: '카이스트' },
    { id: 5, name: '포스텍' },
    { id: 6, name: '성균관대학교' },
    { id: 7, name: '한양대학교' },
    { id: 8, name: '중앙대학교' },
    { id: 9, name: '경희대학교' },
    { id: 10, name: '이화여자대학교' },
];

/**
 * 프로필 설정 페이지 (학교 선택)
 */
function ProfileSetupPage() {
    const navigate = useNavigate();
    const { registration, updateUser, user } = useAuth();

    const [school, setSchool] = useState('');
    const [studentId, setStudentId] = useState('');
    const [major, setMajor] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 본인인증 미완료 시 이전 단계로 리다이렉트
    React.useEffect(() => {
        if (!registration?.phoneVerified) {
            navigate('/phone-verify');
        }
    }, [registration, navigate]);

    // 학교 검색 필터
    const filteredSchools = SCHOOL_OPTIONS.filter(s =>
        s.name.includes(searchQuery)
    );

    // 학교 선택
    const handleSelectSchool = (schoolName) => {
        setSchool(schoolName);
        setSearchQuery(schoolName);
        setIsDropdownOpen(false);
    };

    // 뒤로가기
    const handleBack = () => {
        navigate(-1);
    };

    // 완료 버튼 클릭
    const handleComplete = () => {
        // 사용자 정보 업데이트
        if (updateUser && user) {
            updateUser({
                ...user,
                school,
                studentId: studentId || null,
                major: major || null
            });
        }

        // 환영 페이지로 이동
        navigate('/welcome');
    };

    const isFormValid = school.trim().length > 0;

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
                        <path d="M8.81641 1L1.99822 8.5L8.81641 16" stroke="#140805" strokeWidth="2" />
                    </svg>
                </button>
                <h1 className={styles.headerTitle}>프로필 설정</h1>
                <div className={styles.headerSpacer} />
            </div>

            {/* 메인 컨텐츠 */}
            <div className={styles.content}>
                <ProgressIndicator currentStep={4} totalSteps={5} />

                <div className={styles.description}>
                    <p>학교 정보를</p>
                    <p>입력해주세요.</p>
                </div>

                {/* 학교 선택 */}
                <div className={styles.formSection}>
                    <label className={styles.label}>학교 <span className={styles.required}>*</span></label>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="학교를 검색해주세요"
                            className={styles.searchInput}
                        />
                        {isDropdownOpen && filteredSchools.length > 0 && (
                            <ul className={styles.dropdown}>
                                {filteredSchools.map(s => (
                                    <li
                                        key={s.id}
                                        onClick={() => handleSelectSchool(s.name)}
                                        className={styles.dropdownItem}
                                    >
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 학번 (선택) */}
                <div className={styles.formSection}>
                    <label className={styles.label}>학번 <span className={styles.optional}>(선택)</span></label>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="예: 20231234"
                        className={styles.textInput}
                    />
                </div>

                {/* 학과 (선택) */}
                <div className={styles.formSection}>
                    <label className={styles.label}>학과 <span className={styles.optional}>(선택)</span></label>
                    <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="예: 컴퓨터공학과"
                        className={styles.textInput}
                    />
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className={styles.bottomButton}>
                <Button
                    fullWidth
                    disabled={!isFormValid}
                    onClick={handleComplete}
                >
                    가입 완료
                </Button>
            </div>
        </div>
    );
}

export default ProfileSetupPage;
