# 백엔드 API 수정 요청서 - 프로젝트 상세 정보

## 📋 요청 개요

**작성일**: 2025-01-23
**요청자**: 프론트엔드 팀
**대상 API**: `GET /api/projects/mine`
**우선순위**: 🔴 High (완료된 프로젝트 상세 정보 표시 기능 차단 중)

---

## 🎯 요청 배경

현재 **완료된 프로젝트 탭**에서 프로젝트를 클릭하면 평가 상세 페이지로 이동하는데, 다음 정보들이 표시되지 않고 있습니다:

- ❌ 프로젝트 이름
- ❌ 프로젝트 기간
- ❌ 팀원 아바타
- ❌ 회의 일정

**원인**: API 응답에 필요한 필드가 누락되어 있음

**사용자 경로**:
```
완료된 프로젝트 목록 (http://localhost:3000/project-management?tab=completed)
  ↓ 프로젝트 클릭
평가 상세 페이지 (/evaluation/project/:projectId)
  ↓ 현재 상태
❌ 프로젝트 정보 표시 안 됨 (undefined)
```

---

## 🔍 현재 API 응답 구조

### 엔드포인트
```
GET https://teamitakabackend.onrender.com/api/projects/mine?status=completed&limit=10&offset=0
Authorization: Bearer {token}
```

### 현재 응답 (실제)
```json
{
  "success": true,
  "items": [
    {
      "project_id": "uuid-123",
      "title": "팀이타카 프로젝트",
      "description": "프로젝트 설명",
      "status": "COMPLETED",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-12-31T00:00:00Z",
      "evaluation_status": "PENDING"
      // ❌ members 필드 없음
      // ❌ meeting_schedule 필드 없음
    }
  ],
  "page": {
    "total": 25,
    "limit": 10,
    "offset": 0
  }
}
```

---

## ✅ 요청 사항: API 응답에 필드 추가

### 1️⃣ `members` 배열 추가 (필수)

**설명**: 프로젝트에 참여한 팀원 정보 배열

**필드 구조**:
```typescript
members: Array<{
  id: string;           // 팀원 고유 ID
  name: string;         // 팀원 이름
  avatar: string;       // 프로필 이미지 URL (https://... 형식)
  position?: string;    // 역할/직책 (선택사항)
}>
```

**예시 데이터**:
```json
"members": [
  {
    "id": "user-001",
    "name": "김철수",
    "avatar": "https://teamitakabackend.onrender.com/uploads/avatars/user-001.jpg",
    "position": "프론트엔드 개발자"
  },
  {
    "id": "user-002",
    "name": "이영희",
    "avatar": "https://teamitakabackend.onrender.com/uploads/avatars/user-002.jpg",
    "position": "백엔드 개발자"
  }
]
```

**사용 목적**:
- 프로젝트 상세 페이지에서 팀원 아바타 리스트 표시
- 팀원 평가 페이지에서 평가 대상자 선택 UI
- 완료된 팀원 표시 (체크 마크)

**프론트엔드 코드 참조**:
- `src/utils/projectTransform.js` (Lines 60-62) - 아바타 추출
- `src/components/ProjectManagement/CompletedComponent/CompletedProjectCard.js` (Line 19) - 현재 더미 데이터 사용 중

---

### 2️⃣ `meeting_schedule` 필드 추가 (권장)

**설명**: 프로젝트의 고정 회의 일정

**필드 구조**:
```typescript
meeting_schedule: string | null;  // 회의 일정 문자열 또는 null
```

**예시 데이터**:
```json
"meeting_schedule": "매주 월요일 14:00"
```

```json
"meeting_schedule": null  // 회의 일정이 없는 경우
```

**사용 목적**:
- 프로젝트 상세 페이지에서 회의 정보 표시
- 프로젝트 카드에서 주요 정보 제공

**프론트엔드 코드 참조**:
- `src/utils/projectTransform.js` (Line 47) - 회의 시간 변환
- `src/components/RatingProjectPage/ProjectInfoCard.js` - 회의 시간 UI 표시

---

## 📊 수정 후 예상 응답

```json
{
  "success": true,
  "items": [
    {
      "project_id": "uuid-123",
      "title": "팀이타카 프로젝트",
      "description": "프로젝트 설명",
      "status": "COMPLETED",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-12-31T00:00:00Z",
      "evaluation_status": "PENDING",

      // ✅ 추가된 필드
      "members": [
        {
          "id": "user-001",
          "name": "김철수",
          "avatar": "https://teamitakabackend.onrender.com/uploads/avatars/user-001.jpg",
          "position": "프론트엔드 개발자"
        },
        {
          "id": "user-002",
          "name": "이영희",
          "avatar": "https://teamitakabackend.onrender.com/uploads/avatars/user-002.jpg",
          "position": "백엔드 개발자"
        }
      ],

      // ✅ 추가된 필드
      "meeting_schedule": "매주 월요일 14:00"
    }
  ],
  "page": {
    "total": 25,
    "limit": 10,
    "offset": 0
  }
}
```

---

## 🔄 Before / After 비교

### 프론트엔드 UI 영향

| 정보 | 현재 (Before) | 수정 후 (After) |
|------|--------------|----------------|
| **프로젝트 이름** | ✅ 표시됨 (`title` 사용) | ✅ 표시됨 |
| **프로젝트 기간** | ✅ 표시됨 (`start_date`, `end_date` 사용) | ✅ 표시됨 |
| **팀원 아바타** | ❌ 더미 데이터 (하드코딩) | ✅ 실제 아바타 표시 |
| **회의 일정** | ❌ 빈 문자열 | ✅ 실제 일정 표시 |
| **D-day 뱃지** | ✅ 표시됨 (계산) | ✅ 표시됨 |

### 코드 영향

**현재 (더미 데이터 사용)**:
```javascript
// CompletedProjectCard.js Line 19
const memberAvatars = project.members || DEFAULT_AVATARS;  // 더미 데이터 fallback

// projectTransform.js Lines 60-62
const avatars = members
  .filter(member => member && member.avatar)
  .map(member => member.avatar);  // members가 undefined → 빈 배열
```

**수정 후 (실제 데이터 사용)**:
```javascript
// API 응답에서 실제 members 배열 받음
const avatars = members
  .filter(member => member && member.avatar)
  .map(member => member.avatar);  // ✅ 실제 아바타 URL 배열 반환
```

---

## 🗄️ 데이터베이스 구조 확인 필요 사항

백엔드 팀에서 확인이 필요한 사항:

1. **프로젝트-팀원 관계**
   - 프로젝트와 팀원 간의 관계 테이블 존재 여부 (`project_members` 테이블?)
   - 팀원 정보 테이블에 `avatar` 컬럼 존재 여부
   - JOIN 쿼리로 한 번에 가져올 수 있는지 여부

2. **회의 일정 저장**
   - `meeting_schedule` 컬럼이 프로젝트 테이블에 있는지?
   - 회의 일정 형식 (자유 텍스트 vs 구조화된 데이터)

3. **아바타 이미지**
   - 아바타 이미지 저장 방식 (파일 시스템? S3? DB?)
   - URL 생성 방식 (상대 경로 → 절대 URL 변환 필요 여부)

---

## 🚀 구현 가이드

### 백엔드 예상 구현 (참고용)

```javascript
// 예시: Node.js/Express + Sequelize/Prisma
async function getMyProjects(userId, { status, limit, offset }) {
  const projects = await Project.findAll({
    where: {
      userId,
      status: status.toUpperCase()
    },
    include: [
      {
        model: ProjectMember,  // ← 추가: 팀원 정보 JOIN
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatar', 'position']  // ← avatar 포함
          }
        ]
      }
    ],
    attributes: [
      'project_id',
      'title',
      'description',
      'status',
      'start_date',
      'end_date',
      'evaluation_status',
      'meeting_schedule'  // ← 추가: 회의 일정
    ],
    limit,
    offset
  });

  // 응답 형식 변환
  return {
    success: true,
    items: projects.map(project => ({
      ...project.toJSON(),
      members: project.ProjectMembers.map(pm => ({
        id: pm.User.id,
        name: pm.User.name,
        avatar: pm.User.avatar ? getFullAvatarUrl(pm.User.avatar) : null,
        position: pm.User.position
      }))
    })),
    page: { total, limit, offset }
  };
}
```

---

## 📅 타임라인 제안

| 단계 | 예상 소요 시간 | 담당 |
|------|---------------|------|
| 1. 요구사항 검토 | 1일 | 백엔드 팀 |
| 2. DB 구조 확인 & 수정 | 1-2일 | 백엔드 팀 |
| 3. API 엔드포인트 수정 | 1일 | 백엔드 팀 |
| 4. 테스트 & 배포 | 1일 | 백엔드 팀 |
| 5. 프론트엔드 통합 테스트 | 0.5일 | 프론트엔드 팀 |
| **총 예상 기간** | **4-5일** | |

---

## ✅ 체크리스트

백엔드 팀 확인 사항:

- [ ] `members` 배열 추가 가능 여부 확인
- [ ] `avatar` URL 형식 결정 (상대 경로 vs 절대 URL)
- [ ] `meeting_schedule` 필드 추가 가능 여부 확인
- [ ] 기존 API 호출에 영향 없는지 확인 (하위 호환성)
- [ ] 성능 영향 검토 (JOIN 쿼리 추가)
- [ ] API 문서 업데이트

프론트엔드 팀 확인 사항:

- [x] 필요한 필드 명세 작성
- [x] 데이터 변환 로직 구현 완료 (`projectTransform.js`)
- [x] 더미 데이터 fallback 구현 완료
- [ ] API 수정 후 통합 테스트
- [ ] UI 검증

---

## 📞 연락처

**프론트엔드 팀 담당자**: [담당자 이름]
**질문/피드백**: [이슈 트래커 또는 슬랙 채널]

---

## 🔗 관련 리소스

**프론트엔드 코드 참조**:
- `src/utils/projectTransform.js` - 데이터 변환 로직
- `src/components/ProjectManagement/CompletedComponent/CompletedComponent.js` - API 호출 부분
- `src/services/projects.js` - `getMyProjects()` 서비스 함수

**백엔드 엔드포인트**:
- Base URL: `https://teamitakabackend.onrender.com`
- Endpoint: `GET /api/projects/mine`
- Query params: `status`, `limit`, `offset`

---

## 💡 대안 검토

만약 한 번에 모든 필드를 추가하기 어렵다면, **단계별 구현**을 제안합니다:

### Phase 1 (필수) - members 배열만 먼저
```json
{
  "members": [
    { "id": "...", "name": "...", "avatar": "..." }
  ]
}
```

### Phase 2 (권장) - meeting_schedule 추가
```json
{
  "meeting_schedule": "매주 월요일 14:00"
}
```

---

## 📝 참고사항

1. **아바타 기본값**:
   - 아바타가 없는 사용자의 경우 `avatar: null` 반환 권장
   - 프론트엔드에서 기본 아바타 이미지로 대체 처리

2. **회의 일정 형식**:
   - 자유 텍스트 형식 권장 (예: "매주 월요일 14:00", "격주 금요일 오후 3시")
   - 향후 구조화된 형식으로 변경 가능 (별도 협의 필요)

3. **성능 고려사항**:
   - `members` 배열이 너무 클 경우 페이지네이션 또는 제한 고려
   - 필요시 별도 엔드포인트 분리 가능 (`GET /api/projects/:id/members`)

---

**작성일**: 2025-01-23
**문서 버전**: 1.0
**상태**: 🔴 리뷰 대기 중
