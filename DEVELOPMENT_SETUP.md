# 🚀 TeamItaka Frontend 개발 환경 설정 가이드

TeamItaka 프론트엔드 프로젝트의 로컬 개발 환경 설정 방법을 안내합니다.

---

## 📋 목차

- [빠른 시작 (프론트엔드만 개발)](#빠른-시작-프론트엔드만-개발)
- [로컬 백엔드 연결 (백엔드 개발 시)](#로컬-백엔드-연결-백엔드-개발-시)
- [환경 변수 설명](#환경-변수-설명)
- [개발 환경 구분](#개발-환경-구분)
- [문제 해결](#문제-해결)

---

## ⚡ 빠른 시작 (프론트엔드만 개발)

프론트엔드만 개발하는 경우 **배포된 백엔드 서버**를 사용하는 것을 권장합니다.

### 1. 환경 변수 설정

```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local
```

`.env.local` 파일이 자동으로 생성되며, 기본값으로 배포된 백엔드(`https://teamitakabackend.onrender.com`)가 설정됩니다.

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm start
```

브라우저가 자동으로 `http://localhost:3000`을 엽니다.

### 4. 개발 모드 확인

화면 상단에 **주황색 개발 모드 배너**가 표시됩니다:
```
⚠️ 개발 모드 - 실제 서버 데이터 사용 중 (localhost:3000)
```

이 배너는 개발 환경에서만 표시되며, 프로덕션 배포 시 자동으로 숨겨집니다.

---

## 🔧 로컬 백엔드 연결 (백엔드 개발 시)

백엔드 코드를 수정하거나 API를 개발하는 경우 로컬 백엔드 서버를 사용할 수 있습니다.

### 1. 백엔드 서버 설치 및 실행

```bash
# 백엔드 레포지토리 클론
git clone https://github.com/TeamKoHong/teamitakaBackend.git
cd teamitakaBackend

# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
# DB 연결 정보, JWT_SECRET 등 설정 필요

# 로컬 서버 실행 (기본 포트: 8080)
npm start
```

### 2. 프론트엔드 환경 변수 수정

`.env.local` 파일을 열고 API URL을 로컬 서버로 변경:

```bash
# 배포된 백엔드 (주석 처리)
# REACT_APP_API_BASE_URL=https://teamitakabackend.onrender.com

# 로컬 백엔드 (활성화)
REACT_APP_API_BASE_URL=http://localhost:8080
```

### 3. CORS 설정 (백엔드)

백엔드 서버에서 프론트엔드 요청을 허용하도록 CORS 설정:

**로컬 개발용** (`teamitakaBackend/config/development.js`):
```javascript
cors: {
  origin: 'http://localhost:3000',
}
```

**배포된 백엔드** (Render Environment 변수):
```
CORS_ORIGIN=https://teamitaka.vercel.app,http://localhost:3000
```

### 4. 프론트엔드 재시작

환경 변수 변경 후 프론트엔드 개발 서버를 재시작해야 적용됩니다:

```bash
# Ctrl+C로 종료 후 재시작
npm start
```

---

## 📚 환경 변수 설명

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `REACT_APP_API_BASE_URL` | 백엔드 API 서버 주소 | `https://teamitakabackend.onrender.com` |
| `SASS_DEPRECATION_WARNINGS` | SASS 경고 메시지 비활성화 | `false` |
| `REACT_APP_ENV` | 환경 구분 (개발/프로덕션) | `development` |

---

## 🔀 개발 환경 구분

### 환경별 파일 우선순위

Create React App은 다음 순서로 환경 변수를 로드합니다:

1. `.env.local` (최우선 - 개인 설정)
2. `.env.development` (개발 환경)
3. `.env` (공통 설정)

### 권장 사용법

| 파일 | 용도 | Git 추적 |
|------|------|----------|
| `.env.example` | 템플릿 (신규 개발자용) | ✅ 추적 |
| `.env.local` | 개인 개발 설정 | ❌ 무시 |
| `.env.production` | 프로덕션 설정 | ❌ 무시 |

**주의사항:**
- ⚠️ `.env.local`은 **절대 커밋하지 마세요**
- ⚠️ 환경 변수 변경 후에는 `npm start` 재시작 필요
- ⚠️ API URL이나 민감한 정보는 코드에 하드코딩 금지

---

## 🛠️ 문제 해결

### 1. CORS 에러 발생

```
Access to fetch at 'https://teamitakabackend.onrender.com/api/...'
has been blocked by CORS policy
```

**원인:** 백엔드 서버에서 프론트엔드 도메인을 허용하지 않음

**해결:**
- 배포된 백엔드 사용 시: Render Environment에 `http://localhost:3000` 추가
- 로컬 백엔드 사용 시: `config/development.js`에서 CORS origin 설정

### 2. 환경 변수가 적용되지 않음

**원인:** Create React App은 서버 실행 시점의 환경 변수만 읽음

**해결:**
```bash
# 개발 서버 완전히 종료 (Ctrl+C)
npm start  # 재시작
```

### 3. 로컬 백엔드 연결 안 됨

**체크리스트:**
- [ ] 백엔드 서버가 실행 중인가? (`npm start` in teamitakaBackend)
- [ ] 포트 번호가 맞는가? (기본: 8080)
- [ ] `.env.local`에 `http://localhost:8080` 설정했는가?
- [ ] 프론트엔드를 재시작했는가?

### 4. 프로덕션 데이터 실수로 수정

**예방:**
- 화면 상단 주황색 배너 확인 ("개발 모드 - 실제 서버 데이터 사용 중")
- 중요한 작업 전 API URL 확인
- 테스트는 로컬 백엔드 + 로컬 DB 사용 권장

---

## 🤝 팀 협업 가이드

### 환경 설정 공유 금지

```bash
# ❌ 잘못된 예시 - 개인 설정 커밋
git add .env.local
git commit -m "환경 변수 추가"

# ✅ 올바른 예시 - 템플릿만 공유
git add .env.example
git commit -m "Add environment template"
```

### 신규 환경 변수 추가 시

1. `.env.example`에 주석과 함께 추가
2. 팀원들에게 공지
3. `.env.local`에 각자 설정

### 브랜치 전략

- `main`: 프로덕션 배포
- `develop`: 개발 통합
- 개인 브랜치: `woo`, `yurim`, `hyehyeje` 등
- 기능 브랜치: `feat/기능명`

---

## 📞 도움말

문제가 해결되지 않으면:
1. 기존 이슈 검색: [GitHub Issues](https://github.com/TeamKoHong/teamitakaFrontend2/issues)
2. 새 이슈 생성: 재현 방법, 에러 메시지, 환경 정보 포함
3. 팀 채널에서 질문

---

**Happy Coding! 🎉**
