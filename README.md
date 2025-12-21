# Teamitaka Frontend

> 티미타카 - 팀 프로젝트 매칭·관리·평가 플랫폼

**React 기반 프론트엔드 애플리케이션**으로, 팀 프로젝트의 전체 라이프사이클(모집 → 매칭 → 관리 → 평가)을 지원합니다.

## 💡 핵심 가치

**"혼자서는 할 수 없는 일을, 함께라면 가능하게"**

- 🎯 **쉬운 팀 빌딩**: 3단계로 완성하는 모집글, 관심사 기반 매칭
- 📊 **체계적 관리**: 일정, 회의록, 작업 관리를 하나의 플랫폼에서
- 👥 **투명한 평가**: 상호 평가로 팀워크 능력 가시화
- 📱 **모바일 최적화**: 언제 어디서나 팀 프로젝트 관리

## 🆕 최근 업데이트 (2025-12-21)

### E2E 테스트 인프라 개선
- 🧪 **setup_api 기능**: 테스트 전 API 호출로 필요 데이터 자동 생성
- ⏭️ **skip_if 조건부 스킵**: 런타임 상태 기반 테스트 스킵 (false negative 방지)
- 🔧 **createTestApplication()**: 테스트용 지원서 자동 생성/재사용
- 📊 **테스트 결과 개선**: M03+M06 24/35 통과 (20→24, +4 테스트)

### 수정된 파일
| 위치 | 파일 | 변경 내용 |
|------|------|-----------|
| E2E | `test-config.ts` | applicationId 필드 및 setter 추가 |
| E2E | `test-executor.ts` | SetupApiCall 인터페이스, API 헬퍼 함수 추가 |
| E2E | `test-runner.spec.ts` | evaluateSkipCondition, setup_api/skip_if 처리 |
| E2E | `m06-application.json` | M06-F02 테스트에 setup_api 추가 |
| E2E | `m03-notifications.json` | M03-F01-03에 skip_if 추가 |
| Frontend | `ProjectApplyComplete.js` | localStorage fallback (E2E 테스트 지원) |

---

## 🆕 이전 업데이트 (2025-12-18)

### Recruitment 지원 Flow 개선
- ✨ **API 연동 수정**: 프로젝트 선택 API 필드명 호환성 처리 (`items` || `projects`)
- 🔧 **지원서 제출 오류 수정**: Backend 인증 오류 해결 (`req.user.userId` 사용)
- 📝 **포트폴리오 선택 옵션화**: 완료된 프로젝트 없이도 지원 가능하도록 개선
- 🎨 **UI 레이아웃 수정**: 모집 중인 프로젝트 슬라이드 Header 겹침 이슈 해결

### 수정된 파일
| 위치 | 파일 | 변경 내용 |
|------|------|-----------|
| Frontend | `ProjectApplySelect.js` | API 호환성, 선택사항 처리 |
| Frontend | `RecruitingProject.scss` | Header 간격 조정 (71px) |
| Backend | `applicationController.js` | user_id 접근 오류 수정 |

---

## 🆕 이전 업데이트 (2025-11-24)

### 모집글 생성 status 필드 추가 및 백엔드 동기화
- ✨ **status 필드 추가**: 모집글 생성 시 백엔드 ENUM 값 전송 (`ACTIVE`, `CLOSED`, `FILLED`)
- 🔄 **백엔드 동기화**: 데이터베이스 제약 조건 오류(`recruitments_status_check`) 해결
- 🛡️ **기본값 설정**: 새 모집글은 자동으로 `ACTIVE` (활성) 상태로 생성
- 📝 **타입 안전성**: TypeScript 주석으로 허용 값 명시 (`"ACTIVE" | "CLOSED" | "FILLED"`)

### 모집글 수정/삭제 기능 구현 완료
- ✅ **삭제 기능**: 작성자 본인만 모집글 삭제 가능 (권한 검증 포함)
- 📝 **수정 준비**: `updateRecruitment()` API 함수 구현 완료 (수정 페이지 연동 대기)
- 🔐 **권한 관리**: JWT 토큰 기반 소유자 검증 및 에러 처리
- 🎯 **UX 개선**: 삭제 확인 다이얼로그, 상세 에러 메시지, 자동 페이지 이동
- 🛡️ **백엔드 연동**: `DELETE /api/recruitments/:id`, `PUT /api/recruitments/:id` 지원

### Firebase 전화번호 인증 통합 완료
- ✨ **Firebase Phone Authentication**: SMS 기반 전화번호 인증 시스템 구축
- 📱 **실제 SMS 인증**: Firebase를 통한 실제 전화번호 인증 지원
- 🧪 **테스트 모드**: 개발/배포 환경에서 SMS 없이 테스트 가능 (010-1234-5678 / 123456)
- 🔐 **백엔드 통합**: Firebase ID Token → JWT 토큰 발급 완벽 연동
- ✅ **신규 사용자 자동 생성**: 전화번호 기반 자동 회원가입
- 🛡️ **reCAPTCHA 보안**: Bot 방지 및 안정적인 인증 플로우

### RecruitmentPage API 통합 및 Hashtags 표시 완료
- ✨ **API 통합**: `getAllRecruitments()` 실제 백엔드 API 연동 완료
- 🏷️ **해시태그 표시**: 모집글 리스트 아이템에 키워드(Hashtags) 동적 표시
- ⚡ **상태 관리 개선**: 로딩 상태, 빈 데이터 상태 처리 구현
- 🎯 **Mock 데이터 제거**: 정적 mock data 대신 실시간 API 데이터 사용
- 🎨 **UX 개선**: 클릭 이벤트, 호버 효과, 2줄 말줄임 등 사용성 향상

### 팀원 평가 페이지 개선 (2025-11-23)
- ✨ **프로젝트 정보 표시 안정화** - 이름, 기간, 회의 시간 정확하게 표시
- 🚀 **데이터 전달 최적화** - location.state 기반으로 불필요한 API 호출 제거
- 🎨 **완료 뱃지 디자인 개선** - 회색 배경(#5E5E5E) + 주황색 체크(#F76241)
- 🖼️ **아바타 폴백 처리** - null 값 대응 기본 SVG 아이콘 자동 표시

### 시스템 및 UI/UX 개선
- 🍞 **Global Toast System** - `ToastHost`를 싱글톤 패턴의 `GlobalToastSystem`으로 리팩토링하여 안정성 및 HMR 지원 강화
- 🖱️ **스크롤 경험 개선** - 완료된 프로젝트 목록의 스크롤 이슈 해결 및 레이아웃 최적화
- ✨ **선택 피드백 강화** - 팀원 평가 시 선택된 대상에 대한 시각적 피드백(오렌지 보더) 추가
- 📱 **반응형 디자인 고도화** - `CompletedComponent`에 CSS Custom Properties 기반의 정교한 반응형 시스템 적용

### 컴포넌트 개선
- 🔧 **Button 컴포넌트** - `layout` prop 추가 (center, navigation 레이아웃)
- 📊 **데이터 변환 유틸리티** - `projectTransform.js` 추가로 API 데이터 변환 표준화
- 📝 **백엔드 API 문서** - 프로젝트 필드 요청 사항 문서화

## 📊 개발 현황 Dashboard

> **최종 업데이트**: 2025-12-20

### 📈 전체 요약

```
┌────────────────────────────────────────────────────────────────────┐
│  📦 총 페이지: 31개     │  🟢 완료 58%  🟡 진행 29%  🔴 대기 13%   │
├────────────────────────────────────────────────────────────────────┤
│  📡 API 연동: 73%       │  ✅ 8개 완전연동  ⚠️ 3개 Mock/부분       │
├────────────────────────────────────────────────────────────────────┤
│  🧩 핵심 기능 완료      │  인증, 모집글 CRUD, 지원서, 평가 시스템   │
│  ⏳ 개발 진행 중        │  프로필 편집, 캘린더, 검색, 알림          │
└────────────────────────────────────────────────────────────────────┘
```

### 🎯 기능별 구현 현황

| 카테고리 | 완료 | 진행 | 대기 | 진행률 |
|---------|------|------|------|--------|
| **인증/온보딩** | 4 | 0 | 1 | `████████░░` 80% |
| **모집글** | 7 | 0 | 0 | `██████████` **100%** |
| **지원/매칭** | 7 | 1 | 1 | `███████░░░` 78% |
| **프로젝트 관리** | 3 | 2 | 2 | `████░░░░░░` 43% |
| **평가 시스템** | 5 | 1 | 0 | `████████░░` 83% |
| **프로필/기타** | 3 | 1 | 3 | `████░░░░░░` 43% |

### 🔌 API 서비스 현황

| Service | 함수 | 상태 | 진행률 |
|---------|------|------|--------|
| **auth.js** | 12 | ✅ 완전 연동 | `██████████` 100% |
| **recruitment.js** | 13 | ✅ 완전 연동 | `██████████` 100% |
| **projects.js** | 3 | ✅ 완전 연동 | `██████████` 100% |
| **evaluation.js** | 4 | ✅ 완전 연동 | `██████████` 100% |
| **rating.js** | 7 | ⚠️ 부분 (더미 3개) | `██████░░░░` 57% |
| **profile.js** | 2 | ⚠️ Mock fallback | `█░░░░░░░░░` Mock |

### 🚨 우선순위 작업

| 우선순위 | 항목 | 상태 | 비고 |
|---------|------|------|------|
| 🚨 P0 | 프로젝트 권한 검증 | 미구현 | 보안 취약 |
| 🚨 P0 | rating.js API 연동 | 더미 사용 | 즉시 |
| ✅ ~P0~ | 모집글 수정/삭제 | **완료** | 2025-11-24 |
| ⚠️ P1 | 캘린더 일정 연동 | 더미 7개 | 1주 |
| ⚠️ P1 | 북마크 API 연동 | 부분 | 1-2주 |
| 🔧 P2 | 검색 기능 | 미구현 | 2주 |
| 🔧 P3 | console.log 정리 | 209개 | 지속 |

### 📋 개발 로드맵

**Phase 1 - 핵심 기능** (즉시)
- [ ] 프로젝트 권한 검증 API
- [ ] rating.js 실제 API 교체
- [x] 모집글 수정/삭제 ✅

**Phase 2 - 주요 기능** (1-2주)
- [ ] 캘린더 일정 API 연동
- [ ] 북마크/지원내역 API 연동
- [ ] 프로필 편집 기능

**Phase 3 - UX 개선** (2-3주)
- [/] Alert → Toast 교체 (진행중)
- [ ] 검색 기능 구현
- [ ] 알림 시스템

> 📄 **상세 분석**: [DESIGN_IMPLEMENTATION_ANALYSIS.md](./DESIGN_IMPLEMENTATION_ANALYSIS.md) | [BACKEND_PROJECT_API_REQUEST.md](./BACKEND_PROJECT_API_REQUEST.md)

---

## ✨ 주요 기능

### 🎯 프로젝트 모집 & 매칭
- **모집글 목록 조회**: 실시간 API 기반 모집글 탐색
  - 카테고리별 필터링 (전체, 마케팅, 디자인, 브랜딩, IT, 서비스)
  - 키워드(Hashtags) 동적 표시로 빠른 정보 파악
  - 로딩 상태 및 빈 데이터 처리
  - 조회수 기반 "Best" 뱃지 자동 표시 (100회 이상)
- **모집글 작성**: 3단계 플로우로 손쉬운 프로젝트 모집글 작성
  - 1단계: 기본 정보 (제목, 기간, 유형)
  - 2단계: 상세 정보 (설명, 키워드)
  - 3단계: 대표 이미지 업로드
- **모집글 관리**: 작성자 전용 수정/삭제 기능
  - ✅ **삭제 기능**: 작성자 본인만 삭제 가능 (JWT 권한 검증)
  - 📝 **수정 준비**: API 함수 구현 완료 (수정 페이지 연동 대기)
  - 🛡️ **보안**: 소유자 검증, 에러 처리, 자동 페이지 이동
  - 🎯 **UX**: 삭제 확인 다이얼로그, 상세 에러 메시지
- **지원서 제출**: 3단계 플로우로 간편한 지원
  - 1단계: 자기소개 작성 (300자)
  - 2단계: 포트폴리오 프로젝트 선택 (완료된 프로젝트)
  - 3단계: 제출 완료
- **지원 관리**: 지원자 확인 및 승인/거절
- **팀 매칭**: 관심사 기반 팀원 추천 및 매칭

### 📊 프로젝트 관리
- **프로젝트 대시보드**: 진행 중인 프로젝트 한눈에 관리
- **일정 관리**: 캘린더 기반 프로젝트 일정 관리
- **회의록**: 팀 미팅 기록 및 공유
- **팀원 관리**: 팀원 역할 및 권한 관리

- **상호 평가**: 프로젝트 종료 후 팀원 간 평가
  - 3단계 평가 플로우 (카테고리 평가 → 종합 평가 → 완료)
  - 프로젝트 정보 자동 표시 (이름, 기간, 회의 시간, D-day)
  - 완료된 팀원 시각적 표시 (회색 배경 + 주황색 체크)
- **평가 현황**: 보낸/받은 평가 상태 확인
- **키워드 기반**: 긍정/부정 키워드로 빠른 평가
- **프로필 통합**: 평가 결과를 프로필에 자동 반영
- **UI 개선**: Figma 디자인 시스템 적용, 직관적인 평가 플로우
- **데이터 최적화**: location.state 기반 데이터 전달로 성능 개선

### 🔐 사용자 인증
- **이메일 인증**: SendGrid 기반 이메일 인증 (180초 유효)
- **전화번호 인증**: Firebase Phone Auth + SMS 인증
  - 실제 전화번호 SMS 인증 (Firebase)
  - 개발/배포 환경 테스트 모드 (010-1234-5678 / 123456)
  - 백엔드 JWT 토큰 발급 연동
  - 신규 사용자 자동 회원가입
- **JWT 인증**: 안전한 토큰 기반 인증
- **온보딩**: 신규 사용자 가이드

### 📱 모바일 최적화
- **모바일 우선 디자인**: 반응형 UI/UX (320px~)
- **하단 네비게이션**: 직관적인 모바일 내비게이션 (고정형, 콘텐츠 가림 방지)
- **터치 최적화**: 스와이프, 탭 등 모바일 제스처 지원
- **상단 네비게이션**: 표준화된 헤더 및 뒤로가기 로직 적용

## 🛠 Tech Stack

### Core
- **React 18**: 최신 React 기능 활용 (Concurrent Features)
- **React Router DOM 7**: 선언적 라우팅 및 Data APIs
- **Redux Toolkit**: 상태 관리 (RTK Query 포함)

### Styling
- **SASS (SCSS)**: 모듈화된 스타일링, 변수 및 믹스인 활용
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원 (Mobile-First)

### UI Libraries
- **Swiper**: 터치 기반 슬라이더 컴포넌트
- **React Icons**: 다양한 아이콘 세트 (Ionicons, Font Awesome 등)

### Authentication & Backend
- **Firebase**: Phone Authentication (SMS 인증)
- **JWT**: 토큰 기반 인증 및 세션 관리

### Development & Testing
- **Jest**: 단위 테스트 프레임워크
- **React Testing Library**: 컴포넌트 테스트
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅

## 📋 요구 사항

### 필수 요구 사항
- **Node.js**: 20 LTS 권장 (React Router DOM 7 호환)
- **npm**: 10+
- **Git**: 버전 관리

### 버전 확인
```bash
node -v   # v20.x.x
npm -v    # 10.x.x
git --version
```

### 권장 개발 환경
- **OS**: macOS, Windows, Linux
- **에디터**: VS Code (권장 확장: ESLint, Prettier, ES7+ React/Redux)
- **브라우저**: Chrome (React DevTools 설치 권장)

## 🚀 빠른 시작

### 1. 저장소 복제

```bash
git clone https://github.com/TeamKoHong/teamitakaFrontend2.git
cd teamitakaFrontend2
```

### 2. 의존성 설치

```bash
# npm ci 사용 (package-lock.json 기반, 더 빠르고 안정적)
npm ci

# 또는 npm install
npm install
```

**⏱ 예상 시간**: 2-3분 (네트워크 속도에 따라 다름)

### 3. 환경변수 설정

```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local
```

기본값으로 배포된 백엔드 서버(`https://teamitakabackend.onrender.com`)가 설정됩니다.

**로컬 백엔드 연동 시** `.env.local` 수정:
```bash
REACT_APP_API_BASE_URL=http://localhost:8080
```

**자세한 환경 설정**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) 참고

### 4. 개발 서버 실행

```bash
npm start
```

**확인 사항**:
- ✅ 브라우저가 자동으로 `http://localhost:3000` 열림
- ✅ 화면 상단에 **"개발 모드"** 배너 표시
- ✅ 콘솔에 컴파일 성공 메시지 출력

**문제 발생 시**: [문제 해결 섹션](#-문제-해결-faq) 참고

## 📜 Scripts

### 개발 관련
```bash
npm start        # 개발 서버 실행 (포트: 3000)
npm run build    # 프로덕션 빌드 (build/ 디렉터리)
```

### 테스트
```bash
npm test         # 테스트 실행 (watch 모드)
npm test -- --coverage  # 테스트 커버리지 확인
```

### 코드 품질
```bash
npm run lint     # ESLint 실행 (있는 경우)
npm run format   # Prettier 실행 (있는 경우)
```

## 📁 디렉터리 구조

```
src/
├── components/        # 재사용 가능한 UI 컴포넌트
│   ├── Common/       # 공통 컴포넌트
│   │   ├── Header.js
│   │   ├── BottomNav/
│   │   └── AlertModal/
│   ├── Home/         # 메인 페이지 컴포넌트
│   └── ...
├── pages/            # 라우트 단위 페이지
│   ├── LoginPage/
│   ├── RegisterPage/
│   ├── RecruitmentPage/
│   ├── RecruitmentViewPage/
│   ├── ProjectApply/       # 지원서 제출 플로우
│   │   ├── ProjectApply.js          # 1단계: 자기소개
│   │   ├── ProjectApplySelect.js    # 2단계: 포트폴리오 선택
│   │   └── ProjectApplyComplete.js  # 3단계: 완료
│   ├── ProjectDetailPage/
│   └── ...
├── services/         # API 호출 로직
│   ├── auth.js       # 인증 API (login, register, verify)
│   ├── recruitment.js # 모집글 API (CRUD, applicants)
│   ├── projects.js   # 프로젝트 API
│   └── rating.js     # 평가 API
├── contexts/         # React Context
│   └── AuthContext.js
├── utils/            # 유틸리티 함수
│   ├── dateFormatters.js     # 날짜/시간 포맷팅
│   ├── calculateProgress.js  # 진행률 계산
│   ├── projectTransform.js   # API 데이터 → UI 형식 변환
│   └── ...
├── styles/           # 글로벌 스타일, SCSS 변수
├── constants/        # 상수 정의
│   └── routes.js     # 라우트 경로 상수
└── App.js            # 루트 컴포넌트
```

## 🗺 주요 라우트

### 인증 & 메인
- `/` - 온보딩 페이지 (3초 후 자동 이동)
- `/login` - 로그인
- `/register` - 회원가입 (이메일 인증)
- `/main` - 메인 대시보드
- `/my` - 마이페이지

### 📱 회원가입 플로우 (휴대폰 본인인증)

신규 회원가입 시 다음 5단계 플로우를 거칩니다:

```
/login (회원가입 버튼)
    ↓
/phone-verify (휴대폰 본인인증 - 정보 입력)
    ↓
/phone-verify/code (SMS 인증번호 입력)
    ↓
/register (이메일 계정 연동)
    ↓
/profile-setup (학교 정보 입력) ← 현재 미연결
    ↓
/welcome (가입 완료)
    ↓
/main
```

| 단계 | 경로 | 설명 | 페이지 |
|------|------|------|--------|
| 1 | `/phone-verify` | 통신사, 휴대폰 번호, 주민번호 앞자리, 이름 입력 | `PhoneVerifyPage` |
| 2 | `/phone-verify/code` | SMS 인증번호 6자리 입력 (3분 제한) | `VerificationCodePage` |
| 3 | `/register` | 이메일/비밀번호 설정, 약관 동의 | `RegisterPage` |
| 4 | `/profile-setup` | 학교, 학번, 학과 입력 | `ProfileSetupPage` |
| 5 | `/welcome` | 가입 완료 환영 메시지 | `WelcomePage` |

> ⚠️ **주의**: 현재 RegisterPage → ProfileSetupPage 연결이 누락되어 있습니다.
> RegisterPage 완료 시 `/login`으로 이동하며, 추후 `/profile-setup`으로 연결 필요.

### 모집글
- `/recruit` - 모집글 작성 (1단계: 기본 정보)
- `/recruit/detail` - 모집글 작성 (2단계: 상세 정보)
- `/recruit/image` - 모집글 작성 (3단계: 이미지)
- `/recruit/preview` - 모집글 미리보기
- `/recruit/publish` - 모집글 게시
- `/recruit/publish/done` - 게시 완료
- `/recruitment` - 모집글 목록
- `/recruitment/:id` - 모집글 상세

### 지원
- `/apply2` - 지원서 작성 (1단계: 자기소개)
- `/apply2/select` - 지원서 작성 (2단계: 포트폴리오 선택)
- `/apply2/complete` - 지원서 제출 완료

### 프로젝트
- `/project-management` - 프로젝트 관리 목록
- `/project/:id` - 프로젝트 상세
- `/project/:id/member` - 팀원 관리
- `/project/:id/proceedings` - 회의록
- `/project/:id/calender` - 일정 관리

### 평가
- `/evaluation/management` - 평가 관리
- `/evaluation/project/:projectId` - 프로젝트 평가
- `/evaluation/team-member/:projectId/:memberId` - 팀원 평가
- `/evaluation/status/:projectId` - 평가 현황
- `/evaluation/status/:projectId/given` - 보낸 평가
- `/evaluation/status/:projectId/received` - 받은 평가

### 기타
- `/team-matching` - 팀 매칭
- `/search` - 검색
- `/team` - 팀 정보
- `/bookmark` - 북마크한 모집글

**전체 라우트 정의**: [src/constants/routes.js](src/constants/routes.js) 참고

## 🔧 환경 변수

### 필수 환경 변수

```bash
# 백엔드 API 서버 주소
REACT_APP_API_BASE_URL=https://teamitakabackend.onrender.com

# 환경 구분
REACT_APP_ENV=development
```

### 선택적 환경 변수

```bash
# SASS 경고 메시지 비활성화
SASS_DEPRECATION_WARNINGS=false
```

### Firebase 설정 (전화번호 인증)

```bash
# Firebase Web App Configuration (프론트엔드용)
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Phone Auth Test Mode (개발 및 배포 환경 테스트용)
REACT_APP_ENABLE_TEST_MODE=true
```

**테스트 모드 사용**:
- `REACT_APP_ENABLE_TEST_MODE=true` 설정 시 테스트 전화번호 사용 가능
- 테스트 전화번호: `010-1234-5678`
- 테스트 인증 코드: `123456`
- 실제 SMS 없이 개발/배포 환경에서 테스트 가능

### 환경별 설정

**개발 환경** (`.env.local`):
```bash
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_ENV=development
```

**프로덕션** (Vercel 환경 변수):
```bash
REACT_APP_API_BASE_URL=https://teamitakabackend.onrender.com
REACT_APP_ENV=production
```

**⚠️ 중요 사항**:
- `.env*` 파일은 `.gitignore`에 포함됨 (**커밋 금지**)
- 환경 변수 변경 후 개발 서버 **재시작 필수**
- 템플릿은 `.env.example` 참고
- 민감 정보(API 키 등)는 절대 커밋하지 말 것

**자세한 설정**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

## 📡 API 사용 예시

### 이메일 인증

```javascript
import { sendVerificationCode, verifyCode, resendVerificationCode } from './services/auth';

// 1. 인증번호 전송
try {
  await sendVerificationCode('user@example.com');
  console.log('인증번호가 이메일로 전송되었습니다.');
} catch (error) {
  if (error.code === 'ALREADY_VERIFIED') {
    console.error('이미 인증된 이메일입니다.');
  } else {
    console.error('전송 실패:', error.message);
  }
}

// 2. 인증번호 확인
try {
  const result = await verifyCode('user@example.com', '123456');
  console.log('인증 성공:', result);
} catch (error) {
  if (error.code === 'INVALID_CODE') {
    console.error('잘못된 인증번호입니다.');
  } else if (error.code === 'EXPIRED') {
    console.error('인증번호가 만료되었습니다.');
  }
}

// 3. 인증번호 재전송
try {
  await resendVerificationCode('user@example.com');
  console.log('인증번호가 재전송되었습니다.');
} catch (error) {
  console.error('재전송 실패:', error.message);
}
```

### 전화번호 인증 (Firebase Phone Auth)

```javascript
import { auth } from './config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { verifyPhoneAuth } from './services/phoneAuth';

// 1. reCAPTCHA 초기화
const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',  // 'invisible' 또는 'normal'
      callback: () => {
        console.log('✅ reCAPTCHA 검증 완료');
      }
    });
  }
};

// 2. 전화번호 형식 변환 (010-xxxx-xxxx → +8210xxxxxxxx)
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/-/g, '');
  if (cleaned.startsWith('010')) {
    return '+82' + cleaned.substring(1);
  }
  return '+82' + cleaned;
};

// 3. SMS 인증 코드 전송
try {
  const phoneNumber = '010-1234-5678';
  const formattedPhone = formatPhoneNumber(phoneNumber);  // +821012345678

  // reCAPTCHA 초기화
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier;

  // Firebase에서 SMS 전송
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    formattedPhone,
    appVerifier
  );

  console.log('✅ SMS 인증 코드 전송 완료');

  // confirmationResult를 저장해두고 사용자가 코드 입력하면 확인
} catch (error) {
  console.error('❌ SMS 전송 실패:', error);

  if (error.code === 'auth/invalid-phone-number') {
    console.error('올바르지 않은 전화번호 형식입니다.');
  } else if (error.code === 'auth/too-many-requests') {
    console.error('너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 4. 인증 코드 확인 및 백엔드 연동
try {
  const verificationCode = '123456';  // 사용자가 입력한 6자리 코드

  // Firebase에서 인증 코드 확인
  const credential = await confirmationResult.confirm(verificationCode);
  const idToken = await credential.user.getIdToken();

  console.log('✅ Firebase 인증 완료');
  console.log('🎫 ID Token 획득');

  // 백엔드 API 호출
  const response = await verifyPhoneAuth(idToken);

  console.log('✅ 백엔드 인증 완료:', response);

  // 응답 예시:
  // {
  //   success: true,
  //   message: "✅ 회원가입 및 로그인 성공!",
  //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  //   user: {
  //     userId: "de167dcb-9c97-4c88-a82a-47f6daf1b123",
  //     username: "u821012345678",
  //     email: "firebaseUid@phone.teamitaka.com",
  //     phoneNumber: "+821012345678",
  //     phoneVerified: true,
  //     role: "MEMBER"
  //   },
  //   isNewUser: true  // 신규 사용자 여부
  // }

  // JWT 토큰과 사용자 정보 저장
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));

  // 신규 사용자 환영 메시지
  if (response.isNewUser) {
    console.log('🎉 신규 회원 가입을 환영합니다!');
  }

} catch (error) {
  console.error('❌ 인증 실패:', error.message);

  if (error.message.includes('invalid-verification-code')) {
    console.error('인증 코드가 올바르지 않습니다.');
  }
}

// 🧪 테스트 모드 사용 (REACT_APP_ENABLE_TEST_MODE=true)
// 테스트 전화번호: 010-1234-5678
// 테스트 인증 코드: 123456
// 실제 SMS 없이 Firebase 인증 우회하여 백엔드 연동 테스트 가능
```

**Firebase Phone Auth 에러 처리**:

| 에러 코드 | 설명 | 해결 방법 |
|----------|------|----------|
| `auth/invalid-phone-number` | 올바르지 않은 전화번호 형식 | E.164 형식 확인 (+821012345678) |
| `auth/too-many-requests` | 너무 많은 시도 | 1-2시간 대기 또는 테스트 모드 사용 |
| `auth/invalid-app-credential` | Firebase 설정 오류 | Firebase Console 설정 확인 |
| `invalid-verification-code` | 잘못된 인증 코드 | 6자리 코드 재확인 |

### 모집글 관리

```javascript
import {
  createRecruitment,
  getRecruitment,
  uploadRecruitmentImage,
  updateRecruitment,
  deleteRecruitment
} from './services/recruitment';

// 1. 모집글 생성
try {
  const recruitment = await createRecruitment({
    title: '프론트엔드 개발자 모집',
    description: '함께 성장할 팀원을 찾습니다',
    project_type: 'side',  // 'course' or 'side'
    recruitment_start: '2025-01-20',
    recruitment_end: '2025-02-20',
    max_applicants: 5,  // 선택사항
    hashtags: ['React', 'TypeScript', 'Node.js'],  // ✨ 해시태그 (선택사항, 최대 5개)
    status: 'ACTIVE'  // ✨ 모집 상태: 'ACTIVE' (기본값) | 'CLOSED' | 'FILLED'
  });

  console.log('모집글 생성 성공:', recruitment.recruitment_id);
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    console.error('로그인이 필요합니다.');
  } else {
    console.error('생성 실패:', error.message);
  }
}

// 💡 해시태그 처리 규칙 (2025-01-17 추가):
// - # 기호는 자동으로 제거됨 ('#React' → 'React')
// - 중복 제거 및 최대 5개로 제한
// - 백엔드 commit ae37e1f에서 구현됨

// 💡 status 필드 (2025-11-24 추가):
// - 백엔드 ENUM 값: 'ACTIVE' (활성), 'CLOSED' (마감), 'FILLED' (충원 완료)
// - 기본값: 'ACTIVE' (생략 가능하지만 명시 권장)
// - 데이터베이스 제약 조건으로 인해 필수 필드

// 2. 모집글 조회 (인증 불필요)
try {
  const data = await getRecruitment(recruitmentId);

  // 기본 정보
  console.log('제목:', data.title);
  console.log('조회수:', data.views);  // 자동 증가

  // ✨ 해시태그 (2025-01-17 추가)
  // ⚠️ 주의: 필드명은 'name' (content 아님)
  const hashtags = data.Hashtags?.map(h => h.name) || [];
  console.log('해시태그:', hashtags);

  // 응답 예시:
  // {
  //   "recruitment_id": "...",
  //   "title": "프론트엔드 개발자 모집",
  //   "Hashtags": [
  //     { "hashtag_id": "...", "name": "React" },
  //     { "hashtag_id": "...", "name": "TypeScript" }
  //   ]
  // }
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.error('모집글을 찾을 수 없습니다.');
  }
}

// 3. 이미지 업로드 (5MB 제한)
try {
  const photoUrl = await uploadRecruitmentImage(imageFile);
  console.log('업로드 성공:', photoUrl);
} catch (error) {
  if (error.code === 'FILE_TOO_LARGE') {
    console.error('파일 크기는 5MB를 초과할 수 없습니다.');
  } else if (error.code === 'INVALID_FILE_TYPE') {
    console.error('허용되지 않는 파일 형식입니다. (jpeg, png, webp만 가능)');
  }
}

// 4. 모집글 목록 조회 (RecruitmentPage)
try {
  const recruitments = await getAllRecruitments();

  // API 응답을 컴포넌트 형식으로 변환
  const formatted = recruitments.map(post => ({
    id: post.recruitment_id,
    title: post.title,
    imageUrl: post.photo_url,
    views: post.views || 0,
    apply: post.applicant_count || 0,
    date: post.created_at?.substring(0, 10).replace(/-/g, '.').substring(2), // "2025-01-15" → "25.01.15"
    category: post.project_type === 'course' ? '수업' : '사이드',
    tags: post.Hashtags?.map(h => h.name) || [], // ✨ Hashtags 매핑
    isBest: (post.views || 0) > 100, // 조회수 100 이상
  }));

  console.log('모집글 목록:', formatted);

  // API 응답 예시:
  // [
  //   {
  //     "recruitment_id": "uuid",
  //     "title": "프론트엔드 개발자 모집",
  //     "photo_url": "https://...",
  //     "views": 150,
  //     "applicant_count": 5,
  //     "created_at": "2025-01-15T10:30:00Z",
  //     "project_type": "side",
  //     "Hashtags": [
  //       { "name": "React" },
  //       { "name": "TypeScript" }
  //     ]
  //   }
  // ]
} catch (error) {
  console.error('목록 조회 실패:', error.message);
}

// 💡 데이터 변환 참고사항:
// - Hashtags 필드는 대문자 H (Sequelize ORM 자동 변환)
// - Optional chaining (?.map) 필수 (빈 배열 대비)
// - 날짜 변환: ISO 8601 → "YY.MM.DD" 형식
// - project_type: "course" → "수업", 그 외 → "사이드"

// 5. 모집글 수정 (작성자 전용) ✨ 2025-11-24 추가
try {
  const updated = await updateRecruitment(recruitmentId, {
    title: '수정된 제목',
    description: '수정된 설명',
    project_type: 'course',
    recruitment_start: '2025-02-01',
    recruitment_end: '2025-02-15',
    max_applicants: 10,
    hashtags: ['Vue', 'Nuxt', 'Firebase']
  });

  console.log('모집글 수정 성공:', updated.recruitment_id);
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    console.error('로그인이 필요하거나 권한이 없습니다.');
  } else if (error.code === 'NOT_FOUND') {
    console.error('모집글을 찾을 수 없습니다.');
  } else {
    console.error('수정 실패:', error.message);
  }
}

// 6. 모집글 삭제 (작성자 전용) ✨ 2025-11-24 추가
try {
  if (window.confirm('정말 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.')) {
    await deleteRecruitment(recruitmentId);
    console.log('모집글 삭제 성공');
    // 삭제 후 목록 페이지로 이동
    navigate('/team-matching');
  }
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    console.error('로그인이 필요하거나 권한이 없습니다.');
  } else if (error.code === 'NOT_FOUND') {
    console.error('모집글을 찾을 수 없습니다.');
  } else {
    console.error('삭제 실패:', error.message);
  }
}

// 💡 수정/삭제 권한 검증:
// - JWT 토큰 기반 소유자 검증 (백엔드에서 user_id 비교)
// - 401/403: 권한 없음, 404: 모집글 없음
// - RecruitmentViewPage.js에서 isOwner 상태로 UI 조건부 렌더링
```

### 지원서 제출

```javascript
import {
  submitApplication,
  getMyProjects
} from './services/recruitment';

// 1. 나의 프로젝트 목록 가져오기 (포트폴리오용)
try {
  const result = await getMyProjects({
    status: 'completed',  // 완료된 프로젝트만
    limit: 20,
    offset: 0
  });

  const projects = result.projects.map(p => ({
    id: p.project_id,        // UUID 형식
    title: p.title,
    thumb: p.photo_url || null,
    description: p.description
  }));

  console.log('완료된 프로젝트:', projects.length);
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    console.error('로그인이 필요합니다.');
  }
}

// 2. 지원서 제출
try {
  const application = await submitApplication(recruitmentId, {
    introduction: '저는 프론트엔드 개발에 열정이 있습니다...',
    portfolio_project_ids: [
      'uuid-1234-5678-...',  // 선택한 프로젝트 ID들
      'uuid-abcd-efgh-...'
    ]
  });

  console.log('지원 성공:', application.application_id);
  // 완료 페이지로 이동
  navigate('/apply2/complete', {
    state: {
      applicationId: application.application_id,
      recruitmentId: application.recruitment_id
    }
  });

} catch (error) {
  // 8가지 에러 케이스 처리
  switch (error.code) {
    case 'ALREADY_APPLIED':
      console.error('이미 지원한 모집글입니다.');
      break;
    case 'SELF_APPLICATION':
      console.error('본인이 작성한 모집글에는 지원할 수 없습니다.');
      break;
    case 'RECRUITMENT_CLOSED':
      console.error('마감된 모집글입니다.');
      break;
    case 'INVALID_PORTFOLIO':
      console.error('유효하지 않은 포트폴리오 프로젝트가 포함되어 있습니다.');
      break;
    case 'UNAUTHORIZED':
      console.error('로그인이 필요합니다.');
      navigate('/login');
      break;
    case 'RECRUITMENT_NOT_FOUND':
      console.error('모집글을 찾을 수 없습니다.');
      break;
    case 'INVALID_INPUT':
      console.error(error.message || '입력 정보가 올바르지 않습니다.');
      break;
    default:
      console.error('지원서 제출에 실패했습니다.');
  }
}
```

### 에러 처리 패턴

```javascript
// 공통 에러 처리 함수
const handleApiError = (error) => {
  switch (error.code) {
    case 'UNAUTHORIZED':
      // 로그인 페이지로 리다이렉트
      navigate('/login');
      break;
    case 'NOT_FOUND':
      alert('요청한 리소스를 찾을 수 없습니다.');
      break;
    case 'SERVER_ERROR':
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      break;
    default:
      alert(error.message);
  }
};

// 사용 예시
try {
  const data = await getRecruitment(id);
  setPost(data);
} catch (error) {
  handleApiError(error);
}
```

## 👨‍💻 개발 가이드

### 코딩 원칙

**1. 테스트 주도 개발 (TDD)**
- 기능 추가 전 테스트부터 작성
- 실패 → 구현 → 통과 사이클
- 커버리지 80% 이상 유지 목표

**2. 단일 책임 원칙 (SRP)**
- 컴포넌트/서비스는 하나의 책임만
- 재사용성과 가독성 우선
- 함수는 한 가지 일만 수행

**3. 레이어 구조**
- `pages/` → `components/` → `services/` 단방향 의존
- 역방향 의존 금지
- 서비스 레이어는 비즈니스 로직만 포함

**4. 컴포넌트 설계**
- 함수형 컴포넌트 사용
- Custom Hooks로 로직 분리
- Props drilling 최소화 (Context 활용)

**5. API 데이터 변환**
- API 응답과 컴포넌트 형식 분리
- 변환 로직은 useEffect 내부 또는 별도 유틸리티 함수로 분리
- 명확한 매핑 테이블 문서화

### 데이터 변환 패턴 (RecruitmentPage 예시)

백엔드 API 응답을 프론트엔드 컴포넌트 형식으로 변환하는 표준 패턴입니다.

**API → Component 매핑 테이블**:

| API 필드 | 컴포넌트 필드 | 변환 로직 | 예시 |
|---------|-------------|-----------|------|
| `recruitment_id` | `id` | 그대로 사용 | `"uuid-..."` |
| `title` | `title` | 그대로 사용 | `"프론트엔드 개발자 모집"` |
| `photo_url` | `imageUrl` | 그대로 사용 | `"https://..."` |
| `views` | `views` | 기본값 0 | `150 \|\| 0` |
| `applicant_count` | `apply` | 기본값 0 | `5 \|\| 0` |
| `created_at` | `date` | ISO → "YY.MM.DD" | `"2025-01-15"` → `"25.01.15"` |
| `project_type` | `category` | 조건부 변환 | `"course"` → `"수업"`, 그 외 → `"사이드"` |
| `Hashtags` | `tags` | 배열 매핑 | `[{name: "React"}]` → `["React"]` |
| - | `isBest` | 계산 필드 | `views > 100` |

**변환 코드 예시**:
```javascript
// src/pages/RecruitmentPage/RecruitmentPage.js

useEffect(() => {
  const fetchRecruitments = async () => {
    const data = await getAllRecruitments();

    // API 응답을 컴포넌트 형식으로 변환
    const formatted = data.map(post => ({
      id: post.recruitment_id,
      title: post.title,
      imageUrl: post.photo_url,
      views: post.views || 0, // 기본값 처리
      apply: post.applicant_count || 0,
      date: post.created_at?.substring(0, 10).replace(/-/g, '.').substring(2), // 날짜 변환
      category: post.project_type === 'course' ? '수업' : '사이드', // 조건부 변환
      tags: post.Hashtags?.map(h => h.name) || [], // 배열 매핑 + Optional chaining
      isBest: (post.views || 0) > 100, // 계산 필드
    }));

    setRecruitments(formatted);
  };

  fetchRecruitments();
}, []);
```

**중요 사항**:
- ⚠️ **Hashtags 필드명**: 대문자 `H`로 시작 (Sequelize ORM 자동 변환)
- ✅ **Optional chaining 필수**: `post.Hashtags?.map()` (빈 배열 대비)
- ✅ **기본값 처리**: `|| 0`, `|| []` 사용하여 null/undefined 방어
- 📅 **날짜 변환**: `"2025-01-15T10:30:00Z"` → `"25.01.15"` 형식 통일

### 코딩 컨벤션

**파일명**:
- 컴포넌트: PascalCase (예: `UserProfile.js`)
- 유틸리티: camelCase (예: `formatDate.js`)
- 스타일: 컴포넌트명.scss (예: `UserProfile.scss`)

**변수명**:
```javascript
// ✅ 좋은 예시
const isLoading = true;
const userList = [...];
const fetchUserData = () => {...};

// ❌ 나쁜 예시
const flag = true;
const data = [...];
const func = () => {...};
```

**컴포넌트 구조**:
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Component.scss';

// 2. Component
export default function Component() {
  // 2-1. Hooks
  const navigate = useNavigate();
  const [state, setState] = useState(null);

  // 2-2. Effects
  useEffect(() => {
    // ...
  }, []);

  // 2-3. Handlers
  const handleClick = () => {
    // ...
  };

  // 2-4. Render
  return (
    // ...
  );
}
```

### Pull Request 가이드

**PR 생성 전 체크리스트**:
- [ ] 코드가 정상적으로 동작함
- [ ] 관련 테스트 작성 및 통과
- [ ] ESLint 오류 없음
- [ ] 불필요한 console.log 제거
- [ ] 커밋 메시지가 컨벤션을 따름

**PR 템플릿**:
```markdown
## 변경 사항
- [ ] 기능 추가
- [ ] 버그 수정
- [ ] 리팩토링
- [ ] 문서 수정

## 설명
[변경 내용을 상세히 설명]

## 테스트 방법
1. ...
2. ...

## 스크린샷 (UI 변경 시)
[스크린샷 첨부]

## 관련 이슈
Closes #123
```

### 코드 리뷰 체크리스트

**기능**:
- [ ] 요구사항을 충족하는가?
- [ ] 엣지 케이스 처리가 되어있는가?
- [ ] 에러 핸들링이 적절한가?

**코드 품질**:
- [ ] 가독성이 좋은가?
- [ ] 중복 코드가 없는가?
- [ ] 네이밍이 적절한가?

**성능**:
- [ ] 불필요한 리렌더링이 없는가?
- [ ] 메모리 누수 가능성은 없는가?

### Git 컨벤션

**브랜치 전략**:
- `feature/기능명` - 새 기능 개발
- `bugfix/버그명` - 버그 수정
- `hotfix/이슈명` - 긴급 수정
- `refactor/대상` - 리팩토링

**Commit 컨벤션** (Conventional Commits):
```bash
feat: Add recruitment creation flow
fix: Resolve navigation reload issue
docs: Update README with new routes
refactor: Improve API error handling
test: Add tests for auth service
chore: Update dependencies
style: Format code with Prettier
perf: Optimize recruitment list rendering
```

### 환경 설정

**상세 가이드**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

로컬 개발 환경 구축, 백엔드 연동, 문제 해결 방법 등 포함

## 🧪 테스트

### 테스트 도구
- **Jest**: 단위 테스트 프레임워크
- **React Testing Library**: 컴포넌트 테스트
- **@testing-library/user-event**: 사용자 상호작용 시뮬레이션

### 테스트 실행

```bash
# 전체 테스트 실행 (watch 모드)
npm test

# 단일 실행
npm test -- --watchAll=false

# 커버리지 확인
npm test -- --coverage

# 특정 파일만 테스트
npm test -- LoginPage
```

### 테스트 작성 예시

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  test('로그인 폼이 정상적으로 렌더링됨', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  test('유효하지 않은 이메일 입력 시 에러 메시지 표시', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('이메일');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('올바른 이메일 형식이 아닙니다')).toBeInTheDocument();
    });
  });
});
```

### 테스트 유틸리티

React Router 테스트를 위한 매퍼:
- `src/test-utils/react-router-dom-mock.js`
- Jest `moduleNameMapper` 설정 참고

## 🔒 보안 & 비밀 관리

### 보안 원칙

- ❌ **실제 비밀키 커밋 금지**: 모든 민감 정보는 환경 변수 사용
- ✅ **입력 검증**: 사용자 입력은 항상 검증
- ✅ **XSS 방지**: 위험한 HTML 직접 주입 금지 (`dangerouslySetInnerHTML` 최소화)
- ✅ **CSRF 방지**: POST 요청에 적절한 토큰 사용
- ✅ **환경 분리**: 프로덕션/개발 환경 명확히 구분

### 비밀 정보 저장

**개발 환경**:
- `.env.local` 파일 사용 (gitignore됨)
- 절대 커밋하지 말 것

**프로덕션**:
- Vercel 환경 변수 설정
- GitHub Secrets 활용 (CI/CD 시)

### 보안 체크리스트

- [ ] API 키, 토큰 등이 코드에 하드코딩되지 않았는가?
- [ ] 민감한 데이터가 console.log로 출력되지 않는가?
- [ ] HTTPS를 사용하는가? (프로덕션)
- [ ] 인증이 필요한 API는 토큰을 검증하는가?
- [ ] 사용자 입력을 그대로 렌더링하지 않는가?

## 🚀 배포

### 프론트엔드 배포 (Vercel)

**1. Vercel 프로젝트 설정**

| 항목 | 값 |
|------|-----|
| Framework Preset | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Install Command | `npm ci` |
| Node Version | `20` |

**2. 환경 변수 설정**

Vercel Dashboard → Settings → Environment Variables

```
REACT_APP_API_BASE_URL=https://teamitakabackend.onrender.com
REACT_APP_ENV=production
```

**3. 배포 프로세스**

```bash
# 자동 배포 (권장)
git push origin main  # main 브랜치에 푸시하면 자동 배포

# 수동 배포 (Vercel CLI 사용)
npm install -g vercel
vercel --prod
```

**4. 배포 후 확인사항**
- [ ] 메인 페이지 정상 로딩
- [ ] API 연동 정상 작동
- [ ] 환경 변수 정상 적용
- [ ] 라우팅 정상 작동
- [ ] 모바일 반응형 확인

### 백엔드 배포 (Render)

**연동 정보**:
- **URL**: https://teamitakabackend.onrender.com
- **레포지토리**: https://github.com/TeamKoHong/teamitakaBackend
- **환경 변수**: `CORS_ORIGIN`에 프론트엔드 도메인 추가 필요

**CORS 설정**:
```bash
# Render 환경 변수
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 배포 롤백

**Vercel 배포 롤백**:
1. Vercel Dashboard → Deployments
2. 이전 안정 버전 선택
3. "Promote to Production" 클릭

**Git 기반 롤백**:
```bash
# 이전 커밋으로 되돌리기
git revert HEAD
git push origin main

# 또는 특정 커밋으로
git revert <commit-hash>
git push origin main
```

### 마이그레이션 히스토리

`Vercel → Supabase Edge Functions → Render` (2025-01-09 완료)

상세 내용: [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md) 참고

## ❓ 문제 해결 (FAQ)

### CORS 오류

**증상**:
```
Access to fetch at 'https://teamitakabackend.onrender.com/api/...'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**원인**: 백엔드 서버에서 프론트엔드 도메인을 허용하지 않음

**해결**:
1. 백엔드 Render 환경변수 `CORS_ORIGIN` 확인
2. 로컬 개발 시: `CORS_ORIGIN=http://localhost:3000` 추가
3. 프로덕션: `CORS_ORIGIN=https://your-domain.vercel.app` 설정

**관련 문서**: [DEVELOPMENT_SETUP.md - CORS 설정](./DEVELOPMENT_SETUP.md#cors-설정)

### 401 인증 오류

**증상**: API 호출 시 `401 Unauthorized` 에러

**원인**: JWT 토큰 없음, 만료, 또는 유효하지 않음

**해결**:
1. 브라우저 개발자 도구 → Application → Local Storage
2. `authToken` 키 확인
3. 토큰이 없거나 만료된 경우 재로그인
4. 토큰이 있는데 에러 발생 시 백엔드 로그 확인

**디버깅**:
```javascript
// 토큰 확인
console.log('Auth Token:', localStorage.getItem('authToken'));

// 토큰 디코딩 (만료 시간 확인)
const token = localStorage.getItem('authToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires at:', new Date(payload.exp * 1000));
```

### 이메일 미수신

**증상**: 인증 이메일이 도착하지 않음

**원인**: SendGrid API 문제, 스팸 필터, 또는 백엔드 오류

**해결**:
1. **스팸 폴더 확인**
2. **이메일 주소 확인**: 오타 없는지 재확인
3. **백엔드 로그 확인**: Render 대시보드 → Logs
4. **SendGrid 상태 확인**: 백엔드 팀에 문의
5. **재전송 시도**: "인증번호 재전송" 버튼 클릭

**추가 정보**: 인증번호 유효 시간 180초

### reCAPTCHA 401 오류 (Firebase Phone Auth)

**증상**:
```
POST https://www.google.com/recaptcha/api2/pat?k=... 401 (Unauthorized)
```
Firebase Phone Auth 사용 시 콘솔에 reCAPTCHA 401 오류 표시

**원인**: Firebase reCAPTCHA Enterprise 설정 관련 문제

**해결**:
- ✅ **정상 동작**: Firebase가 자동으로 fallback 처리하므로 **오류 무시 가능**
- ✅ **실제 SMS 전송 및 인증은 정상 작동**함
- ✅ **개발 환경**: 테스트 모드 사용 권장 (010-1234-5678 / 123456)

**테스트 모드 사용법**:
1. `.env.local`에 `REACT_APP_ENABLE_TEST_MODE=true` 추가
2. 테스트 전화번호 `010-1234-5678` 입력
3. 인증 코드 `123456` 입력
4. 실제 SMS 없이 Firebase 인증 우회

**참고**: 이 오류는 사용자 경험에 영향을 주지 않으며, Firebase가 reCAPTCHA v2로 자동 전환하여 정상 작동합니다.

### 로컬 개발 연결 실패

**증상**: 백엔드 API 호출 실패 (`ERR_CONNECTION_REFUSED`)

**원인**: 백엔드 서버 미실행 또는 잘못된 URL

**해결**:
1. `.env.local` 파일의 `REACT_APP_API_BASE_URL` 확인
2. 백엔드 서버 실행 여부 확인:
   ```bash
   curl http://localhost:8080/api/health  # 백엔드 health check
   ```
3. 백엔드 서버 시작:
   ```bash
   cd ../teamitakaBackend
   npm start
   ```
4. 포트 번호 확인 (기본: 8080)

**자세한 가이드**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

### Node 엔진 에러

**증상**:
```
error <package>: The engine "node" is incompatible with this module
```

**원인**: Node.js 버전 불일치 (Node 20 필요)

**해결**:
1. Node 버전 확인:
   ```bash
   node -v  # v20.x.x 여야 함
   ```
2. Node 20 설치:
   - macOS: `brew install node@20`
   - Windows: [nodejs.org](https://nodejs.org)에서 다운로드
   - nvm 사용 시: `nvm install 20 && nvm use 20`
3. 의존성 재설치:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 빌드 실패

**증상**: `npm run build` 실패

**흔한 원인**:
1. **TypeScript/ESLint 에러**: 코드 오류 수정
2. **메모리 부족**:
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm run build
   ```
3. **환경 변수 누락**: `.env.production` 확인

### 페이지 새로고침 시 404

**증상**: Vercel에서 `/recruitment/123` 같은 경로 새로고침 시 404

**원인**: SPA 라우팅 설정 누락

**해결**: `vercel.json` 파일 추가
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 메인 페이지 헤더 겹침 문제

**증상**: 메인 페이지에서 프로필 카드의 텍스트가 헤더에 가려져 일부만 보임 (예: "진행중" → "중"만 표시)

**원인**: 개발 모드 배너(35px) + 고정 헤더(56px) 높이를 고려하지 않은 프로필 카드 상단 패딩

**해결**: [src/components/Home/main.scss:75](src/components/Home/main.scss#L75)에서 프로필 카드 상단 패딩 조정
```scss
.profile-card {
  padding: 64px 16px 16px 16px;  // 기존: padding: 16px;
}
```

**설명**:
- 프로필 카드는 `margin-top: -56px`로 헤더 위치까지 올라감
- 상단 패딩 64px을 설정하여 콘텐츠가 헤더(56px) 아래 8px 간격으로 시작
- 계산: 64px 패딩 - 56px 위로 당김 = 8px 여백

### Hot Reload 작동 안 함

**증상**: 코드 변경 시 자동 새로고침 안 됨

**해결**:
1. 파일이 `src/` 디렉터리 안에 있는지 확인
2. 개발 서버 재시작: `npm start`
3. 캐시 삭제:
   ```bash
   rm -rf node_modules/.cache
   ```

## 📊 브랜치 현황

### 메인 브랜치

| 브랜치 | 목적 | 상태 | 최근 업데이트 |
|--------|------|------|---------------|
| `main` | 프로덕션 배포 | ✅ 안정 | 2025-11-16 |
| `develop` | 개발 통합 | ✅ 활성 | 2025-11-16 |

### 활성 개발 브랜치

| 브랜치 | 담당자 | 작업 내용 | 상태 | 최근 업데이트 |
|--------|--------|-----------|------|---------------|
| `woo` | @woo | 해시태그 API 연동 완료 | ✅ 완료 | 2025-01-17 |
| `yeye` | @yeye | 날짜 & 아이콘 컨텍스트 | 🔄 진행중 | 2025-11-09 |

### 아카이브된 브랜치

<details>
<summary>작업 완료된 브랜치 목록 (클릭하여 펼치기)</summary>

| 브랜치 | 작업 내용 | 완료일 |
|--------|-----------|--------|
| `feat/#2_프로젝트_관리추가_작업` | 북마크 페이지 스타일링 | 2025-10-16 |
| `hyehyeje/dev` | 파일 병합 및 수정 | 2025-10-08 |
| `yurim2` | 개발 브랜치 병합 | 2025-09-26 |
| `yurim` | 프로젝트 초기 업로드 | 2025-08-01 |
| `feat/API-work` | 투표 페이지 추가 | 2025-06-04 |

</details>

### 브랜치 플로우

```
main (프로덕션)
 ↑
 └─ Pull Request & Code Review
     ↑
    develop (개발 통합)
     ↑
     ├─ woo (모집글 API 연동)
     ├─ yeye (날짜/아이콘 컨텍스트)
     └─ feature/* (새 기능 개발)
```

### 브랜치 생성 및 병합 가이드

**새 기능 개발 시**:
```bash
# 1. develop 브랜치에서 최신 코드 받기
git checkout develop
git pull origin develop

# 2. 새 기능 브랜치 생성
git checkout -b feature/기능명

# 3. 작업 및 커밋
git add .
git commit -m "feat: 기능 설명"

# 4. 원격 저장소에 푸시
git push origin feature/기능명

# 5. GitHub에서 Pull Request 생성 (feature/기능명 → develop)
```

**병합 순서**: `feature/* → develop → main`

**PR 병합 후**:
```bash
# 로컬 브랜치 정리
git checkout develop
git pull origin develop
git branch -d feature/기능명  # 로컬 브랜치 삭제
```

## 🔀 Git 워크플로우

### 브랜치 전략

이 프로젝트는 **자동화된 브랜치 전략**을 사용합니다:

```
woo               # 개인 작업 브랜치
  ↓ (PR 자동 생성 & 머지)
develop           # 개발 통합 브랜치 (스테이징)
  ↓ (PR 자동 생성 & 머지)
main              # 프로덕션 브랜치 (Vercel 자동 배포)
```

**브랜치별 역할**:
- `main`: 프로덕션 배포 브랜치 (Vercel 자동 배포)
- `develop`: 개발 통합 브랜치 (스테이징 환경)
- `woo`: 개인 작업 브랜치 (개발자: @woo)
- `yeye`: 개인 작업 브랜치 (개발자: @yeye)
- `feature/*`, `bugfix/*`, `refactor/*`: 기능별 브랜치 (필요 시)

### 일반 작업 플로우

```bash
# 1. 작업 시작 전 동기화
git checkout woo
git pull origin woo

# 2. 작업 진행
# 파일 수정...

# 3. 커밋 & 푸시
git add .
git commit -m "feat: 기능 설명"
git push origin woo

# 4. GitHub에서 PR 자동 생성 & 머지 (1-2분)
# woo → develop → main 자동 머지됨

# 5. 다음 작업 전 필수 동기화
git pull origin woo
```

### ⚠️ 주의사항

**작업 전 필수 체크**:
```bash
# 매일 작업 시작 전 실행
git checkout develop
git pull origin develop

git checkout main
git pull origin main

git checkout woo
git pull origin woo
```

**브랜치 상태 확인**:
```bash
# 현재 브랜치와 origin 동기화 상태 확인
git branch -vv

# behind/ahead 상태가 보이면 즉시 동기화
git pull origin <branch>
```

### 🔧 문제 해결

브랜치 동기화 문제 발생 시 **[Git 워크플로우 문제 해결 가이드](./GIT_WORKFLOW_TROUBLESHOOTING.md)**를 참고하세요.

**흔한 문제**:
- 로컬 브랜치가 origin보다 뒤처진 경우 ([behind X])
- PR 자동 머지 후 로컬 업데이트 누락
- Git 충돌 해결 방법

### Commit 컨벤션

**Conventional Commits 준수**:

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새 기능 추가 | `feat: Add recruitment creation flow` |
| `fix` | 버그 수정 | `fix: Resolve navigation reload issue` |
| `docs` | 문서 수정 | `docs: Update README with new routes` |
| `refactor` | 리팩토링 | `refactor: Improve API error handling` |
| `test` | 테스트 추가/수정 | `test: Add tests for auth service` |
| `chore` | 빌드/설정 변경 | `chore: Update dependencies` |
| `style` | 코드 스타일 변경 | `style: Format code with Prettier` |
| `perf` | 성능 개선 | `perf: Optimize recruitment list rendering` |

**Commit 메시지 규칙**:
- 첫 줄은 50자 이내
- 명령형 현재 시제 사용 ("Add" not "Added")
- 본문은 72자에서 줄바꿈

## 🤝 기여하기

### 이슈 리포팅

**버그 리포트**:
1. GitHub Issues → New Issue → Bug Report 템플릿 선택
2. 다음 정보 포함:
   - 증상 설명
   - 재현 단계
   - 예상 동작 vs 실제 동작
   - 환경 (브라우저, OS, Node 버전)
   - 스크린샷 (있으면)

**기능 제안**:
1. GitHub Issues → New Issue → Feature Request 템플릿 선택
2. 다음 정보 포함:
   - 제안 배경 (왜 필요한가?)
   - 제안 내용
   - 예상 효과
   - 대안 (고려한 다른 방법)

### 기여 프로세스

1. **Fork & Clone**
   ```bash
   # GitHub에서 Fork
   git clone https://github.com/YOUR_USERNAME/teamitakaFrontend2.git
   ```

2. **브랜치 생성**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **개발 & 테스트**
   - 코딩 컨벤션 준수
   - 테스트 작성
   - Lint 통과 확인

4. **커밋 & 푸시**
   ```bash
   git commit -m "feat: Add amazing feature"
   git push origin feature/amazing-feature
   ```

5. **Pull Request 생성**
   - 원본 저장소에 PR 생성
   - PR 템플릿 작성
   - 리뷰 대기

### 행동 강령

- 존중과 배려로 소통
- 건설적인 피드백 제공
- 다양성 존중

## 📄 License

라이선스 정보는 [LICENSE](./LICENSE) 파일을 참조하세요.

## 📚 추가 문서

- [개발 환경 설정 가이드](./DEVELOPMENT_SETUP.md)
- [README 작성 가이드라인](./README_GUIDELINES.md)
- [Supabase 마이그레이션 가이드](./SUPABASE_MIGRATION_GUIDE.md)
- [Git 워크플로우 문제 해결 가이드](./GIT_WORKFLOW_TROUBLESHOOTING.md)
- [백엔드 API 요청서 - 프로젝트 필드](./BACKEND_PROJECT_API_REQUEST.md)
- [지원서 제출 기능 테스트 보고서](./TEST_REPORT.md)
- [디자인 구현 매칭 분석 워크시트](./DESIGN_IMPLEMENTATION_ANALYSIS.md) ⭐ NEW

## 🙋 문의 및 지원

- **GitHub Issues**: 버그 리포트, 기능 제안
- **GitHub Discussions**: 질문, 아이디어 공유
- **Email**: 긴급 문의

---

**문서 버전**: 2.4 (팀원 평가 데이터 플로우 개선)
**마지막 업데이트**: 2025-11-23
**관리자**: Teamitaka 개발팀

**Made with ❤️ by Teamitaka Team**
