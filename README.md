# TeamItaka Frontend

팀 프로젝트 매칭·관리·평가 플랫폼의 React 기반 프론트엔드입니다. 온보딩, 회원가입/로그인, 프로젝트 탐색·관리, 팀원 평가 플로우를 제공합니다.

## 주요 기능

- 온보딩·로그인/회원가입, 이메일 인증
- 프로젝트 목록/상세/관리, 일정(캘린더), 회의록(Proceedings)
- 팀 매칭/지원, 검색
- 팀원 상호 평가: 프로젝트별 평가, 상태(보냄/받음) 확인
- 모바일 우선 UI, 하단 네비게이션

## Tech Stack

- React 18, React Router DOM 7
- Redux Toolkit
- SASS (SCSS)
- Swiper

## 요구 사항

- Node.js 20 LTS 권장 (react-router-dom@7 호환)
- npm 10+

버전 확인:

```bash
node -v
npm -v
```

## 빠른 시작

1) 의존성 설치

```bash
npm ci
```

2) 환경변수 파일 생성 (`.env.local`)

```bash
# Supabase Edge Function 혹은 백엔드 API Base URL
REACT_APP_API_BASE_URL=https://<your-project>.supabase.co/functions/v1/teamitaka-api

# Supabase anon key (Edge Functions 호출 시 사용)
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here

# 선택: 환경 플래그
REACT_APP_ENV=development
```

3) 로컬 서버 시작

```bash
npm start
```

기본 주소: `http://localhost:3000`

## Scripts

- `npm start`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드(`build/`)
- `npm test`: 테스트 실행 (React Testing Library, Jest)

## 디렉터리 구조 (요약)

```
src/
  components/        # 재사용 UI 컴포넌트
  pages/             # 라우트 단위 페이지
  services/          # API 호출(auth, rating, projects 등)
  contexts/          # 전역 컨텍스트 (예: AuthContext)
  utils/             # 유틸리티/헬퍼
  styles/            # 글로벌 스타일/변수
```

## 라우팅 개요

- 메인: `/`, `/main`, `/login`, `/register`, `/my`
- 프로젝트: `/project-management`, `/project/:id`, `/project/:id/member`, `/project/:id/proceedings`, `/project/:id/calender`
- 평가: `/evaluation/management`, `/evaluation/project/:projectId`, `/evaluation/team-member/:projectId/:memberId`, `/evaluation/status/:projectId`, `/evaluation/status/:projectId/given`, `/evaluation/status/:projectId/received`
- 기타: `/team-matching`, `/recruitment`, `/search`, `/team`

상세 라우트 정의는 `src/constants/routes.js` 참고.

## 환경 변수

- `REACT_APP_API_BASE_URL`: API Base URL (Supabase Functions 예: `https://<project>.supabase.co/functions/v1/teamitaka-api`)
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anon key (Functions 호출 시 `Authorization`, `apikey` 헤더로 사용)
- `REACT_APP_ENV`: `development` | `production`

`.env*` 파일은 커밋하지 않습니다 (gitignored).

## API 사용 예시 (이메일 인증)

`src/services/auth.js` 내 함수 사용:

```js
import { sendVerificationCode, verifyCode, resendVerificationCode } from './services/auth';

await sendVerificationCode('user@example.com');
await verifyCode('user@example.com', '123456');
await resendVerificationCode('user@example.com');
```

성공 응답 예시:

```json
{ "success": true, "message": "인증번호가 이메일로 전송되었습니다.", "data": { "email": "user@example.com", "expiresIn": 180 } }
```

## 개발 가이드

- TDD 지향: 기능 추가 전 테스트부터 작성, 실패 → 구현 → 통과
- 구조 원칙: SRP 중심으로 컴포넌트/서비스 분리, 재사용·가독성 우선
- 라우팅/상태는 `pages/`·`components/`·`services/` 레이어 간 단방향 의존 추구
- Git: Conventional Commits, 브랜치 전략은 아래 참고

## 테스트

- 도구: Jest, React Testing Library
- 실행: `npm test`
- 리액트 라우터 테스트를 위해 `src/test-utils/react-router-dom-mock.js` 매퍼 사용(Jest `moduleNameMapper` 설정 참고)

## 보안·비밀 관리

- 실 비밀키는 커밋 금지. Vercel/Supabase 환경변수에 저장
- 사용자 입력은 검증하고, 렌더링 시 XSS에 유의(위험한 HTML 주입 금지)
- 프로덕션/개발 환경에서 실제 민감 데이터 노출 금지

## 배포 (Vercel)

- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `build`
- Node: `20`
- 필수 환경변수: `REACT_APP_API_BASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`

Supabase Edge Functions 코드는 Supabase에 배포됩니다. 프론트 배포 전 Functions 가용 여부를 확인하세요. 추가 상세는 `docs/deployment/SUPABASE_MIGRATION_GUIDE.md` 참고.

## 문제 해결 (FAQ)

- CORS 오류: Functions가 `OPTIONS` 처리 및 `Access-Control-Allow-*` 헤더 반환하는지 확인
- 401/인증 오류: `REACT_APP_SUPABASE_ANON_KEY` 설정 및 빌드 노출 여부 확인
- 이메일 미수신: Supabase Functions 로그, SendGrid 설정(SENDER, API KEY) 확인
- Node 엔진 에러: Node 20 사용, 필요시 잠금 파일 초기화 후 재설치

## Git 워크플로우

- 브랜치: `feature/*`, `bugfix/*`, `hotfix/*`, `refactor/*`
- 커밋: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)

## License

`LICENSE` 파일을 참조하세요.
