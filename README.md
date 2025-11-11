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

2) 환경변수 파일 생성

```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local
```

기본값으로 배포된 백엔드 서버(`https://teamitakabackend.onrender.com`)가 설정됩니다.

**자세한 환경 설정 가이드**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) 참고

3) 로컬 서버 시작

```bash
npm start
```

기본 주소: `http://localhost:3000`

화면 상단에 **개발 모드 배너**가 표시되면 정상 작동입니다.

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

- `REACT_APP_API_BASE_URL`: 백엔드 API 서버 주소
  - 배포된 백엔드 (권장): `https://teamitakabackend.onrender.com`
  - 로컬 백엔드 (개발 시): `http://localhost:8080`
- `SASS_DEPRECATION_WARNINGS`: SASS 경고 메시지 비활성화 (`false`)
- `REACT_APP_ENV`: `development` | `production`

**중요:**
- `.env*` 파일은 gitignore됨 (커밋 금지)
- 환경 변수 변경 후 `npm start` 재시작 필요
- 템플릿은 `.env.example` 참고

자세한 설정: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

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

**환경 설정**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - 로컬 개발 환경 구축 가이드

**코딩 원칙**:
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

**프론트엔드 배포 설정**:
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `build`
- Node: `20`
- 필수 환경변수: `REACT_APP_API_BASE_URL=https://teamitakabackend.onrender.com`

**백엔드 배포**:
- 플랫폼: Render (https://teamitakabackend.onrender.com)
- 레포지토리: https://github.com/TeamKoHong/teamitakaBackend
- 환경변수: `CORS_ORIGIN`에 프론트엔드 도메인 설정 필요

**마이그레이션 히스토리**: Vercel → Supabase Edge Functions → Render (2025-01-09 완료)
상세 내용은 `SUPABASE_MIGRATION_GUIDE.md` 참고.

## 문제 해결 (FAQ)

- **CORS 오류**: 백엔드 Render 환경변수 `CORS_ORIGIN`에 프론트엔드 도메인 추가 확인
- **401 인증 오류**: JWT 토큰 유효성, `localStorage`의 `authToken` 확인
- **이메일 미수신**: 백엔드 로그, SendGrid API 키 및 발신자 이메일 설정 확인
- **로컬 개발 연결 실패**: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) 문제 해결 섹션 참고
- **Node 엔진 에러**: Node 20 사용, 필요시 `node_modules` 삭제 후 재설치

## Git 워크플로우

- 브랜치: `feature/*`, `bugfix/*`, `hotfix/*`, `refactor/*`
- 커밋: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)

## License

`LICENSE` 파일을 참조하세요.
