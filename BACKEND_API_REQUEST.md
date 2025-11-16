# 🚨 지원서 제출 API 요청

## 📋 현재 상황

### 문제점
프론트엔드에서 **모집글 지원 기능 UI는 완성**되었으나, **백엔드 API 연동이 되지 않아** 전체 플로우가 작동하지 않는 상태입니다.

### 영향도
- **CRITICAL**: 모집글 → 지원 → 승인 → 프로젝트 전환 플로우 전체가 차단됨
- 사용자가 지원서를 작성해도 데이터가 저장되지 않음
- 팀장이 지원자 목록을 조회해도 아무도 표시되지 않음

### 현재 연동 상태
```
✅ 1. 모집글 생성 (POST /api/recruitments)
❌ 2. 지원서 제출 (MISSING)  ← 여기가 막혀있음!
✅ 3. 지원자 목록 조회 (GET /api/recruitments/{id}/applications)
✅ 4. 지원자 승인 (POST /api/applications/{id}/approve)
✅ 5. 프로젝트 전환 (POST /api/projects/from-recruitment/{id})
```

---

## 🎯 필요한 API

### 엔드포인트
```
POST /api/recruitments/{recruitmentId}/applications
```

또는

```
POST /api/applications
```

### Request

#### Headers
```http
Content-Type: application/json
Authorization: Bearer {token}
```

#### Path Parameters
- `recruitmentId` (UUID): 지원할 모집글 ID

#### Request Body
```json
{
  "introduction": "안녕하세요. 저는 3년차 프론트엔드 개발자입니다...",
  "portfolio_project_ids": [
    "project-uuid-1",
    "project-uuid-2"
  ]
}
```

**필드 설명:**
- `introduction` (string, required): 자기소개 (500자 이내)
- `portfolio_project_ids` (array of UUID, optional): 선택한 포트폴리오 프로젝트 ID 목록

### Response

#### Success (201 Created)
```json
{
  "application_id": "uuid",
  "recruitment_id": "uuid",
  "user_id": "uuid",
  "introduction": "안녕하세요...",
  "portfolio_projects": [
    {
      "project_id": "uuid",
      "title": "프로젝트명",
      "description": "설명"
    }
  ],
  "status": "pending",
  "created_at": "2025-01-16T12:00:00Z",
  "updated_at": "2025-01-16T12:00:00Z"
}
```

#### Error Cases

**400 Bad Request**
```json
{
  "error": "INVALID_INPUT",
  "message": "자기소개는 필수 항목입니다."
}
```

**401 Unauthorized**
```json
{
  "error": "UNAUTHORIZED",
  "message": "로그인이 필요합니다."
}
```

**404 Not Found**
```json
{
  "error": "RECRUITMENT_NOT_FOUND",
  "message": "모집글을 찾을 수 없습니다."
}
```

**409 Conflict**
```json
{
  "error": "ALREADY_APPLIED",
  "message": "이미 지원한 모집글입니다."
}
```

---

## 🔗 기존 API와의 연동

### 1. GET /api/recruitments/{recruitmentId}/applications (기존)
이미 구현되어 있는 "지원자 목록 조회" API와 연동됩니다.

**프론트엔드 사용처:**
- File: `/src/services/recruitment.js` - `getRecruitmentApplicants()`
- Component: `/src/components/ApplicantListSlide.js`

**기대 동작:**
- 새로 만든 `POST /applications` API로 지원서를 제출하면
- `GET /recruitments/{id}/applications`에서 해당 지원서가 조회되어야 함

### 2. POST /api/applications/{applicationId}/approve (기존)
이미 구현되어 있는 "지원자 승인" API와 연동됩니다.

**프론트엔드 사용처:**
- File: `/src/services/recruitment.js` - `approveApplicant()`
- Component: `/src/components/ApplicantListSlide.js`

**기대 동작:**
- `POST /applications` API로 생성된 application_id가
- `POST /applications/{id}/approve`에서 승인 가능해야 함

---

## 📱 프론트엔드 현황

### 데이터 수집 UI (완성됨)

**1. 지원하기 버튼**
- File: `/src/pages/RecruitmentViewPage/RecruitmentViewPage.js` (Line 221)
- Action: 모집글 상세 페이지에서 "지원하기" 버튼 클릭

**2. 자기소개 작성**
- File: `/src/pages/ProjectApply/ProjectApply.js`
- Input: `text` state (자기소개 내용)
- Max length: 500자

**3. 포트폴리오 프로젝트 선택**
- File: `/src/pages/ProjectApply/ProjectApplySelect.js`
- Input: `selected` Set (선택된 프로젝트 ID 목록)
- Multiple selection 가능

**4. 지원 완료**
- File: `/src/pages/ProjectApply/ProjectApplyComplete.js`
- 현재: 완료 메시지만 표시 (실제 제출 없음)

### 프론트엔드 통합 계획

API가 준비되면 다음과 같이 통합할 예정입니다:

**1. Service 함수 추가**
```javascript
// src/services/recruitment.js

/**
 * Submits an application to a recruitment
 * @param {string} recruitmentId - Recruitment UUID
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} Created application
 */
export const submitApplication = async (recruitmentId, applicationData) => {
    const { API_BASE_URL, headers } = getApiConfig();
    const token = localStorage.getItem('authToken');

    const res = await fetch(`${API_BASE_URL}/api/recruitments/${recruitmentId}/applications`, {
        method: 'POST',
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
    });

    if (res.status === 401 || res.status === 403) {
        const err = new Error('UNAUTHORIZED');
        err.code = 'UNAUTHORIZED';
        throw err;
    }

    if (res.status === 409) {
        const err = new Error('이미 지원한 모집글입니다.');
        err.code = 'ALREADY_APPLIED';
        throw err;
    }

    if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || 'Failed to submit application');
        err.code = 'SERVER_ERROR';
        throw err;
    }

    return res.json();
};
```

**2. UI 컴포넌트 통합**
```javascript
// src/pages/ProjectApply/ProjectApplySelect.js

const handleSubmit = async () => {
    if (selected.size === 0) return;

    try {
        setLoading(true);
        await submitApplication(recruitmentId, {
            introduction: introductionText,
            portfolio_project_ids: [...selected]
        });
        navigate('/apply2/complete');
    } catch (error) {
        if (error.code === 'ALREADY_APPLIED') {
            alert('이미 지원한 모집글입니다.');
        } else {
            alert('지원 제출에 실패했습니다. 다시 시도해주세요.');
        }
    } finally {
        setLoading(false);
    }
};
```

---

## 💾 데이터베이스 스키마 제안

### applications 테이블
```sql
CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruitment_id UUID NOT NULL REFERENCES recruitments(recruitment_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    introduction TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recruitment_id, user_id) -- 한 사용자는 같은 모집글에 한 번만 지원 가능
);
```

### application_portfolios 테이블 (포트폴리오 연결)
```sql
CREATE TABLE application_portfolios (
    application_id UUID NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (application_id, project_id)
);
```

---

## ✅ 검증 체크리스트

백엔드 구현 완료 후 다음 항목들을 테스트해주세요:

### 기본 기능
- [ ] 로그인한 사용자가 모집글에 지원할 수 있음
- [ ] 자기소개 필수 검증 (빈 값 불가)
- [ ] 포트폴리오 프로젝트 ID 유효성 검증
- [ ] 같은 모집글에 중복 지원 방지 (409 Conflict)

### 권한 관리
- [ ] 비로그인 사용자 접근 차단 (401 Unauthorized)
- [ ] 본인이 작성한 모집글에는 지원 불가 처리
- [ ] 모집 마감된 글에는 지원 불가 처리

### 데이터 연동
- [ ] 제출한 지원서가 `GET /api/recruitments/{id}/applications`에서 조회됨
- [ ] User 정보 (name, profile_image) 포함하여 반환
- [ ] portfolio_projects 정보 포함하여 반환
- [ ] `POST /api/applications/{id}/approve`로 승인 가능

### 에러 처리
- [ ] 존재하지 않는 recruitment_id → 404
- [ ] 존재하지 않는 project_id (포트폴리오) → 400
- [ ] 잘못된 요청 형식 → 400

---

## 📅 우선순위 및 타임라인

### 우선순위
**🔴 CRITICAL - 최우선 작업**

전체 모집글 플로우가 이 API 하나 때문에 막혀있습니다.
- Step 1 (모집글 생성) ✅
- **Step 2 (지원) ❌ ← 여기**
- Step 3 (지원자 조회) ✅
- Step 4 (승인) ✅
- Step 5 (프로젝트 전환) ✅

### 예상 작업 범위
1. **데이터베이스 스키마 생성** (30분)
   - applications 테이블
   - application_portfolios 테이블 (M:N 관계)

2. **API 엔드포인트 구현** (2-3시간)
   - POST /api/recruitments/{id}/applications
   - 입력 검증 (자기소개 필수, 중복 지원 방지)
   - 권한 검증 (로그인, 본인 모집글 지원 방지)
   - 포트폴리오 프로젝트 연결

3. **기존 API 수정** (1시간)
   - GET /api/recruitments/{id}/applications
     - User 정보 포함 (이미 되어있을 가능성 높음)
     - portfolio_projects 정보 추가 (JOIN 필요)

4. **테스트** (1시간)
   - 단위 테스트
   - 통합 테스트
   - 프론트엔드 연동 테스트

**총 예상 시간: 4-6시간**

---

## 🤝 협업 방법

### 백엔드 작업
1. API 구현 완료 후 알려주세요
2. API 문서 또는 Swagger 업데이트
3. 테스트 데이터 생성 (선택사항)

### 프론트엔드 작업 (준비 완료 시)
1. `submitApplication()` 서비스 함수 추가
2. ProjectApplySelect.js 통합
3. 에러 핸들링 추가
4. 통합 테스트

### 통합 테스트 시나리오
1. 사용자 A가 모집글 작성
2. 사용자 B가 해당 모집글 조회
3. 사용자 B가 지원서 작성 및 제출
4. 사용자 A가 지원자 목록에서 B 확인
5. 사용자 A가 B 승인
6. 프로젝트 전환

---

## 📞 문의사항

이 API 구현에 대해 질문이나 논의사항이 있으면 알려주세요:
- 엔드포인트 경로 변경 필요 시
- 요청/응답 형식 수정 필요 시
- 추가 필드 필요 시
- 비즈니스 로직 검토 필요 시

프론트엔드에서는 API만 준비되면 바로 통합 가능한 상태입니다. 🚀

---

**작성일**: 2025-01-16
**작성자**: 프론트엔드 팀 (woo)
**문서 버전**: 1.0
