# 백엔드 API 이슈 및 요청사항

**작성일**: 2025-01-09
**작성자**: Frontend Team
**우선순위**: High

---

## 1. 로그인 API 응답 형식 불일치 (해결 완료 - 프론트 임시 대응)

### 📍 API Endpoint
`POST /api/auth/login`

### ❌ 현재 응답 형식
```json
{
  "message": "✅ 로그인 성공!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ✅ 권장 응답 형식
```json
{
  "success": true,
  "message": "로그인 성공",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "role": "user",
    "name": "홍길동",
    "profileImage": "https://..."
  }
}
```

### 📝 설명
- **현재**: 로그인 성공 시 `token`만 반환하고 `user` 객체를 반환하지 않음
- **문제점**: 프론트엔드에서 JWT를 수동으로 디코딩해서 사용자 정보 추출 중
- **임시 해결**: 프론트엔드에서 `decodeJWT()` 함수로 토큰 페이로드 추출
- **요청사항**: 로그인 응답에 `user` 객체 포함 (JWT에서 추출한 정보와 추가 프로필 정보)

### 🔧 백엔드 수정 예시
```javascript
// controllers/authController.js (예시)
const loginResult = {
  success: true,
  message: "로그인 성공",
  token: token,
  user: {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    profileImage: user.profile_image
  }
};
res.status(200).json(loginResult);
```

---

## 2. 🚨 프로젝트 목록 조회 API SQL 오류 (긴급)

### 📍 API Endpoint
`GET /api/projects/mine`

### ❌ 현재 오류
```json
{
  "success": false,
  "message": "내 프로젝트 조회 실패",
  "error": "Named replacement \":user_id\" has no entry in the replacement map."
}
```

### 📝 설명
- **문제점**: SQL 쿼리에서 `:user_id` 파라미터를 바인딩하지 못함
- **추측 원인**: JWT 토큰에서 `user_id` 추출 실패 또는 SQL 쿼리 파라미터 바인딩 오류
- **영향**: 로그인 후 사용자의 프로젝트 목록을 불러올 수 없음

### 🔍 확인 필요 사항
1. JWT 미들웨어에서 `req.user.userId` 또는 `req.userId`가 제대로 설정되는지 확인
2. SQL 쿼리 파라미터 바인딩 문법 확인 (e.g., Sequelize, Knex, raw query 등)
3. 콘솔 로그로 `user_id` 값이 제대로 추출되는지 확인

### 🔧 백엔드 확인 예시
```javascript
// middleware/authMiddleware.js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = {
  userId: decoded.userId,  // ← 이 값이 제대로 설정되는지 확인
  email: decoded.email,
  role: decoded.role
};

// controllers/projectController.js
const userId = req.user.userId;  // ← undefined가 아닌지 확인
console.log('User ID:', userId);

// SQL 쿼리 (예시)
const projects = await db.query(
  'SELECT * FROM projects WHERE user_id = :user_id',
  { replacements: { user_id: userId } }  // ← 파라미터 바인딩 확인
);
```

---

## 3. 미구현 API 엔드포인트

### 📍 API Endpoints (404 Not Found)

#### 1) `GET /api/dashboard/summary`
- **용도**: 대시보드 요약 정보 (프로젝트 수, 알림, 통계 등)
- **우선순위**: Medium
- **권장 응답 형식**:
```json
{
  "success": true,
  "data": {
    "projectCount": 5,
    "notifications": 3,
    "pendingApplications": 2,
    "recentActivities": [...]
  }
}
```

#### 2) `GET /api/auth/me`
- **용도**: 현재 로그인한 사용자 정보 조회 (프로필, 설정 등)
- **우선순위**: High
- **권장 응답 형식**:
```json
{
  "success": true,
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user",
    "profileImage": "https://...",
    "bio": "안녕하세요",
    "skills": ["React", "Node.js"],
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 4. API 응답 표준화 권장사항

모든 API 응답을 일관된 형식으로 통일하면 프론트엔드 에러 핸들링이 용이합니다.

### ✅ 성공 응답
```json
{
  "success": true,
  "message": "작업 성공",
  "data": { ... }
}
```

### ❌ 실패 응답
```json
{
  "success": false,
  "message": "사용자 친화적인 오류 메시지",
  "error": "개발자용 상세 오류 메시지",
  "code": "ERROR_CODE"
}
```

### 📝 HTTP 상태 코드 권장
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청 (클라이언트 오류)
- `401`: 인증 실패 (토큰 없음/만료)
- `403`: 권한 없음
- `404`: 리소스 없음
- `409`: 충돌 (이메일 중복 등)
- `500`: 서버 오류

---

## 5. 우선순위 및 타임라인

| 이슈 | 우선순위 | 예상 소요시간 | 담당자 |
|-----|---------|-------------|--------|
| `/api/projects/mine` SQL 오류 수정 | 🚨 긴급 | 1-2시간 | |
| `/api/auth/me` 구현 | High | 2-3시간 | |
| `/api/auth/login` 응답에 user 추가 | Medium | 1시간 | |
| `/api/dashboard/summary` 구현 | Medium | 3-4시간 | |

---

## 6. 테스트 계정 정보

프론트엔드 테스트에 사용 중인 계정:
- **이메일**: `sjwoo1999@korea.ac.kr`
- **비밀번호**: (슬랙 DM으로 공유)

---

## 7. 참고 자료

### 프론트엔드 임시 해결 코드
- **파일**: `src/services/auth.js`
- **함수**: `decodeJWT()`, `loginUser()`
- **커밋**: f30e605 "fix: decode JWT to extract user info"

### 백엔드 저장소
- **URL**: https://github.com/TeamKoHong/teamitakaBackend
- **배포 URL**: https://teamitakabackend.onrender.com

---

## 8. 질문 및 논의사항

1. API 응답 표준화에 대한 백엔드 팀 의견은?
2. `/api/projects/mine` 오류 재현 가능한지? (JWT 토큰 필요 시 제공 가능)
3. 향후 API 개발 시 API 문서(Swagger/Postman) 공유 가능한지?

---

**연락처**: Frontend Team - 슬랙 채널 #teamitaka-frontend
