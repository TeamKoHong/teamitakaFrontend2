# Teamitaka Frontend

> 티미타카 - 팀 프로젝트 매칭·관리·평가 플랫폼

React 기반 프론트엔드 애플리케이션으로, 팀 프로젝트의 전체 라이프사이클(모집 → 매칭 → 관리 → 평가)을 지원합니다.

## ✨ 주요 기능

### 🎯 프로젝트 모집 & 매칭
- **모집글 작성**: 3단계 플로우로 손쉬운 프로젝트 모집글 작성
- **지원 관리**: 지원자 확인 및 승인/거절
- **팀 매칭**: 관심사 기반 팀원 추천 및 매칭

### 📊 프로젝트 관리
- **프로젝트 대시보드**: 진행 중인 프로젝트 한눈에 관리
- **일정 관리**: 캘린더 기반 프로젝트 일정 관리
- **회의록**: 팀 미팅 기록 및 공유

### 👥 팀원 평가
- **상호 평가**: 프로젝트 종료 후 팀원 간 평가
- **평가 현황**: 보낸/받은 평가 상태 확인
- **키워드 기반**: 긍정/부정 키워드로 빠른 평가

### 🔐 사용자 인증
- **이메일 인증**: SendGrid 기반 이메일 인증
- **JWT 인증**: 안전한 토큰 기반 인증
- **온보딩**: 신규 사용자 가이드

### 📱 모바일 최적화
- **모바일 우선 디자인**: 반응형 UI/UX
- **하단 네비게이션**: 직관적인 모바일 내비게이션

## 🛠 Tech Stack

### Core
- **React 18**: 최신 React 기능 활용
- **React Router DOM 7**: 선언적 라우팅
- **Redux Toolkit**: 상태 관리

### Styling
- **SASS (SCSS)**: 모듈화된 스타일링
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

### UI Libraries
- **Swiper**: 터치 기반 슬라이더
- **React Icons**: 다양한 아이콘 세트

### Development
- **Jest**: 단위 테스트
- **React Testing Library**: 컴포넌트 테스트

## 📋 요구 사항

- **Node.js**: 20 LTS 권장 (React Router DOM 7 호환)
- **npm**: 10+

버전 확인:

```bash
node -v
npm -v
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm ci
```

### 2. 환경변수 설정

```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local
```

기본값으로 배포된 백엔드 서버(`https://teamitakabackend.onrender.com`)가 설정됩니다.

**자세한 환경 설정**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) 참고

### 3. 개발 서버 실행

```bash
npm start
```

- 기본 주소: `http://localhost:3000`
- 화면 상단에 **개발 모드 배너**가 표시되면 정상 작동

## 📜 Scripts

```bash
npm start        # 개발 서버 실행
npm run build    # 프로덕션 빌드 (build/)
npm test         # 테스트 실행
```

## 📁 디렉터리 구조

```
src/
├── components/        # 재사용 가능한 UI 컴포넌트
│   ├── Common/       # 공통 컴포넌트 (Header, BottomNav 등)
│   ├── Home/         # 메인 페이지 컴포넌트
│   └── ...
├── pages/            # 라우트 단위 페이지
│   ├── LoginPage/
│   ├── RecruitmentPage/
│   ├── ProjectDetailPage/
│   └── ...
├── services/         # API 호출 로직
│   ├── auth.js       # 인증 API
│   ├── recruitment.js # 모집글 API
│   ├── projects.js   # 프로젝트 API
│   └── rating.js     # 평가 API
├── contexts/         # React Context (AuthContext 등)
├── utils/            # 유틸리티 함수
├── styles/           # 글로벌 스타일, SCSS 변수
└── constants/        # 상수 정의 (routes.js 등)
```

## 🗺 주요 라우트

### 인증 & 메인
- `/` - 랜딩 페이지
- `/login` - 로그인
- `/register` - 회원가입
- `/main` - 메인 대시보드
- `/my` - 마이페이지

### 모집글
- `/recruit` - 모집글 작성 (1단계: 기본 정보)
- `/recruit/detail` - 모집글 작성 (2단계: 상세 정보)
- `/recruit/image` - 모집글 작성 (3단계: 이미지)
- `/recruit/preview` - 모집글 미리보기
- `/recruit/publish` - 모집글 게시
- `/recruitment` - 모집글 목록
- `/recruitment/:id` - 모집글 상세

### 지원
- `/apply2` - 지원서 작성

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

**전체 라우트 정의**: `src/constants/routes.js` 참고

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

### 로컬 개발용 설정

```bash
# 로컬 백엔드 사용 시
REACT_APP_API_BASE_URL=http://localhost:8080
```

**⚠️ 중요 사항**:
- `.env*` 파일은 `.gitignore`에 포함됨 (커밋 금지)
- 환경 변수 변경 후 개발 서버 재시작 필요
- 템플릿은 `.env.example` 참고

**자세한 설정**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

## 📡 API 사용 예시

### 이메일 인증

```javascript
import { sendVerificationCode, verifyCode, resendVerificationCode } from './services/auth';

// 인증번호 전송
await sendVerificationCode('user@example.com');

// 인증번호 확인
await verifyCode('user@example.com', '123456');

// 인증번호 재전송
await resendVerificationCode('user@example.com');
```

### 모집글 관리

```javascript
import { createRecruitment, getRecruitment, uploadRecruitmentImage } from './services/recruitment';

// 모집글 생성
const recruitment = await createRecruitment({
  title: '프론트엔드 개발자 모집',
  description: '함께 성장할 팀원을 찾습니다',
  project_type: 'side',
  recruitment_start: '2025-01-20',
  recruitment_end: '2025-02-20'
});

// 모집글 조회
const data = await getRecruitment(recruitmentId);

// 이미지 업로드
const photoUrl = await uploadRecruitmentImage(imageFile);
```

## 👨‍💻 개발 가이드

### 코딩 원칙

**테스트 주도 개발 (TDD)**
- 기능 추가 전 테스트부터 작성
- 실패 → 구현 → 통과 사이클

**단일 책임 원칙 (SRP)**
- 컴포넌트/서비스는 하나의 책임만
- 재사용성과 가독성 우선

**레이어 구조**
- `pages/` → `components/` → `services/` 단방향 의존
- 역방향 의존 금지

**Git 컨벤션**
- Conventional Commits 준수
- 브랜치 전략: `feature/*`, `bugfix/*`, `hotfix/*`, `refactor/*`

### 환경 설정

**상세 가이드**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

로컬 개발 환경 구축, 백엔드 연동, 문제 해결 방법 등 포함

## 🧪 테스트

### 도구
- **Jest**: 단위 테스트 프레임워크
- **React Testing Library**: 컴포넌트 테스트

### 실행

```bash
npm test
```

### 테스트 유틸리티

React Router 테스트를 위한 매퍼:
- `src/test-utils/react-router-dom-mock.js`
- Jest `moduleNameMapper` 설정 참고

## 🔒 보안 & 비밀 관리

### 원칙

- ❌ **실제 비밀키 커밋 금지**: 모든 민감 정보는 환경 변수 사용
- ✅ **입력 검증**: 사용자 입력은 항상 검증
- ✅ **XSS 방지**: 위험한 HTML 직접 주입 금지
- ✅ **환경 분리**: 프로덕션/개발 환경 명확히 구분

### 비밀 정보 저장

- **개발**: `.env.local` (gitignore됨)
- **배포**: Vercel 환경 변수 설정

## 🚀 배포

### 프론트엔드 (Vercel)

**설정**:
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `build`
- Node Version: `20`

**필수 환경 변수**:
```
REACT_APP_API_BASE_URL=https://teamitakabackend.onrender.com
REACT_APP_ENV=production
```

### 백엔드 (Render)

- **URL**: https://teamitakabackend.onrender.com
- **레포지토리**: https://github.com/TeamKoHong/teamitakaBackend
- **환경 변수**: `CORS_ORIGIN`에 프론트엔드 도메인 추가 필요

### 마이그레이션 히스토리

`Vercel → Supabase Edge Functions → Render` (2025-01-09 완료)

상세 내용: `SUPABASE_MIGRATION_GUIDE.md` 참고

## ❓ 문제 해결 (FAQ)

### CORS 오류
**증상**: `Access-Control-Allow-Origin` 에러
**해결**: 백엔드 Render 환경변수 `CORS_ORIGIN`에 프론트엔드 도메인 추가

### 401 인증 오류
**증상**: API 호출 시 401 Unauthorized
**해결**:
- JWT 토큰 유효성 확인
- `localStorage`의 `authToken` 확인
- 토큰 만료 시 재로그인

### 이메일 미수신
**증상**: 인증 이메일이 도착하지 않음
**해결**:
- 백엔드 로그 확인
- SendGrid API 키 확인
- 발신자 이메일 설정 확인
- 스팸 폴더 확인

### 로컬 개발 연결 실패
**증상**: 백엔드 API 호출 실패
**해결**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) 문제 해결 섹션 참고

### Node 엔진 에러
**증상**: 의존성 설치 실패
**해결**:
1. Node 20 사용 확인: `node -v`
2. `node_modules` 삭제 후 재설치:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
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
| `woo` | @woo | 모집글 백엔드 API 연동 | 🚀 진행중 | 2025-11-16 |
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
 └─ Pull Request & Review
     ↑
    develop (개발 통합)
     ↑
     ├─ woo (모집글 API 연동)
     ├─ yeye (날짜/아이콘 컨텍스트)
     └─ feature/* (기능 개발)
```

### 브랜치 생성 및 병합 가이드

**새 기능 개발 시**:
```bash
# develop 브랜치에서 최신 코드 받기
git checkout develop
git pull origin develop

# 새 기능 브랜치 생성
git checkout -b feature/기능명

# 작업 후 커밋
git add .
git commit -m "feat: 기능 설명"

# 원격 저장소에 푸시
git push origin feature/기능명

# GitHub에서 Pull Request 생성 (feature/기능명 → develop)
```

**병합 순서**: `feature/* → develop → main`

## 🔀 Git 워크플로우

### 브랜치 전략

```
main              # 프로덕션 브랜치
  ├── develop     # 개발 통합 브랜치
  │   ├── feature/login-page
  │   ├── feature/recruitment-flow
  │   ├── bugfix/navigation-issue
  │   └── refactor/api-services
```

### Commit 컨벤션

Conventional Commits 준수:

```bash
feat: Add recruitment creation flow
fix: Resolve navigation reload issue
docs: Update README with new routes
refactor: Improve API error handling
test: Add tests for auth service
chore: Update dependencies
```

## 📄 License

라이선스 정보는 `LICENSE` 파일을 참조하세요.

---

**Made with ❤️ by Teamitaka Team**
