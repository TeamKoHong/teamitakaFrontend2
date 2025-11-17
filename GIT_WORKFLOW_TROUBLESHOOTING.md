# 🔧 Git 브랜치 워크플로우 문제 해결 가이드

**작성일**: 2025-01-17
**대상**: Teamitaka Frontend 프로젝트
**문제**: woo → develop → main 브랜치 플로우 동기화 문제

---

## 📊 현재 상태 진단

### 로컬 vs Origin 브랜치 상태

| 브랜치 | 로컬 커밋 | 로컬 날짜 | Origin 커밋 | Origin 날짜 | 상태 |
|--------|----------|----------|-------------|-------------|------|
| **woo** | 7f12d40 | 2025-11-17 14:20 | 7f12d40 | 2025-11-17 14:20 | ✅ 동기화됨 |
| **develop** | b848b69 | 2025-11-16 16:16 | a80d532 | 2025-11-17 14:21 | ❌ **22 커밋 뒤처짐** |
| **main** | c1c997c | 2025-11-16 16:20 | f3c8ccf | 2025-11-17 14:21 | ❌ **33 커밋 뒤처짐** |

### 현재 상태 확인 명령어

```bash
# 모든 브랜치 상태 확인
git branch -vv

# 출력 예시:
# develop b848b69 [origin/develop: behind 22] Merge branch 'woo' into develop
# * woo     7f12d40 [origin/woo] feat: Add hashtags field to recruitment creation API
```

---

## 🔍 문제 원인 분석

### 1. 근본 원인: 로컬 브랜치 업데이트 누락

**타임라인**:
```
2025-11-16 16:16 → 로컬 develop에서 git merge woo 실행 (b848b69)
2025-11-16 16:20 → 로컬 main을 origin에서 pull (c1c997c)
2025-11-17 14:20-14:21 → GitHub에서 22개의 PR 자동 머지 발생
```

**핵심 문제**: 로컬에서 작업 후 **`git pull`을 하지 않은 상태**에서 GitHub의 자동화된 PR 머지가 계속 발생했습니다.

### 2. GitHub 자동 워크플로우

이 프로젝트는 다음과 같은 자동화된 브랜치 전략을 사용합니다:

```
woo 브랜치에 push
    ↓
PR 자동 생성: woo → develop
    ↓ (자동 머지)
PR 자동 생성: develop → main
    ↓ (자동 머지)
배포: Vercel (main 브랜치)
```

**증거**:
- origin/develop 최근 커밋: 모두 "Merge pull request #XXX from TeamKoHong/woo"
- origin/main 최근 커밋: 모두 "Merge pull request #XXX from TeamKoHong/develop"
- 일관된 패턴 반복 (PR #178-199)

### 3. 누락된 커밋 내역

**develop 브랜치가 놓친 22개 커밋**:
```
a80d532 Merge pull request #198 from TeamKoHong/woo
7f12d40 feat: Add hashtags field to recruitment creation API
8ee9129 Merge pull request #196 from TeamKoHong/woo
c5903f1 🔨 Modified: RecruitmentViewPage.js
a760b12 Merge pull request #194 from TeamKoHong/woo
13c2f21 🔨 Modified: RecruitmentViewPage.js
... (총 22개)
```

**main 브랜치가 놓친 33개 커밋**:
```
f3c8ccf Merge pull request #199 from TeamKoHong/develop
a80d532 Merge pull request #198 from TeamKoHong/woo
7f12d40 feat: Add hashtags field to recruitment creation API
... (총 33개)
```

---

## ⚠️ 문제의 영향

### 1. 로컬 개발 환경
- 22-33개 커밋 뒤처진 상태로 작업 중
- 최신 코드 변경사항 반영 안 됨

### 2. 코드 충돌 위험 ⚠️
- 로컬에서 새 작업 시 **병합 충돌 발생 가능성 높음**
- 다른 팀원의 변경사항과 충돌

### 3. 배포 불일치
- 로컬 코드 ≠ 프로덕션 코드
- 디버깅 어려움 (다른 버전으로 테스트)

### 4. 특정 사례: hashtags 필드
- origin/main, origin/develop: hashtags 필드 ✅ 존재
- 로컬 develop, 로컬 main: hashtags 필드 ❌ 없음 (뒤처진 커밋)

---

## 🛠️ 해결 방법

### 방법 1: 안전한 복구 (권장)

로컬 변경사항을 보존하면서 동기화합니다.

```bash
# 1. 현재 작업 중인 변경사항 확인
git status

# 2. 변경사항이 있다면 임시 저장
git stash save "작업 중인 변경사항 백업 $(date)"

# 3. develop 브랜치 동기화
git checkout develop
git fetch origin
git pull origin develop
# 또는: git merge origin/develop

# 4. main 브랜치 동기화
git checkout main
git fetch origin
git pull origin main
# 또는: git merge origin/main

# 5. woo 브랜치로 돌아가기
git checkout woo

# 6. 임시 저장했던 변경사항 복원 (필요시)
git stash list  # 저장된 stash 확인
git stash pop   # 가장 최근 stash 적용

# 7. 동기화 확인
git branch -vv
# 출력에서 [behind X] 메시지가 없어야 함
```

### 방법 2: 강제 동기화 (변경사항 버림)

⚠️ **경고**: 로컬 변경사항이 **영구적으로 삭제**됩니다!

```bash
# 로컬 변경사항을 완전히 버리고 origin과 동일하게 설정
git checkout develop
git fetch origin
git reset --hard origin/develop

git checkout main
git fetch origin
git reset --hard origin/main

git checkout woo

# 동기화 확인
git branch -vv
```

### 복구 후 확인 사항

```bash
# 1. 모든 브랜치가 동기화되었는지 확인
git branch -vv
# 각 브랜치에 [ahead X] 또는 [behind X] 없어야 함

# 2. 최신 커밋 확인
git log --oneline -5

# 3. 특정 파일 확인 (예: hashtags 필드)
git show HEAD:src/pages/ProjectRecruit/ProjectRecruitPublish/ProjectRecruitPublish.js | grep hashtags
```

---

## ✅ 향후 방지 방법

### 1. 작업 전 필수 체크리스트

매일 작업 시작 전에 실행:

```bash
# 모든 브랜치 최신 상태로 업데이트
git checkout develop
git pull origin develop

git checkout main
git pull origin main

git checkout woo
git pull origin woo
```

### 2. 권장 Git 워크플로우

```bash
# === 작업 시작 ===
git checkout woo
git pull origin woo

# === 작업 진행 ===
# 파일 수정...

# === 작업 완료 후 ===
git add .
git commit -m "feat: 기능 설명"
git push origin woo

# GitHub에서 PR 자동 머지 대기 (1-2분)

# === 다음 작업 전 반드시 pull ===
git checkout develop
git pull origin develop  # ← 중요!

git checkout woo
git pull origin woo  # ← 중요!
```

### 3. 브랜치 상태 주기적 확인

```bash
# 현재 브랜치와 origin 상태 비교
git branch -vv

# behind/ahead 상태가 있다면 즉시 동기화
git pull origin <branch>
```

### 4. Git Hooks 활용

#### Pre-push Hook 설정

작업 디렉토리에서 다음 명령어 실행:

```bash
# .git/hooks/pre-push 파일 생성
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

# 현재 브랜치 이름
BRANCH=$(git symbolic-ref --short HEAD)

# origin 최신 정보 가져오기
git fetch origin

# 로컬 커밋 해시
LOCAL=$(git rev-parse @)

# origin 커밋 해시
REMOTE=$(git rev-parse @{u} 2>/dev/null)

# origin 트래킹 브랜치가 없으면 통과
if [ -z "$REMOTE" ]; then
    exit 0
fi

# 로컬과 origin이 다르면 경고
if [ "$LOCAL" != "$REMOTE" ]; then
    echo "⚠️  Warning: Your branch '$BRANCH' is out of sync with origin!"
    echo ""
    echo "Please run one of the following:"
    echo "  git pull origin $BRANCH    # Merge changes"
    echo "  git fetch origin           # Just fetch"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

exit 0
EOF

# 실행 권한 부여
chmod +x .git/hooks/pre-push

echo "✅ Pre-push hook 설정 완료!"
```

#### Hook 동작 방식

```bash
git push origin woo
# → Pre-push hook 실행
# → 브랜치가 behind 상태면 경고 표시
# → 사용자에게 계속 진행 여부 확인
```

### 5. IDE/에디터 설정

**VSCode Git 자동 fetch 설정**:

`.vscode/settings.json`:
```json
{
  "git.autofetch": true,
  "git.autofetchPeriod": 180
}
```

**IntelliJ IDEA 설정**:
- Settings → Version Control → Git → Auto-fetch 활성화

---

## 📋 팀 협업 베스트 프랙티스

### 1. PR 머지 후 커뮤니케이션

GitHub PR이 자동으로 머지되었을 때:
- Slack/Discord에 알림: "woo → develop 머지 완료. 팀원 여러분, `git pull` 해주세요!"
- 중요 변경사항은 코드 리뷰 후 수동 머지 고려

### 2. 브랜치 보호 규칙

GitHub Settings → Branches:
- `main`, `develop` 브랜치: 직접 push 금지
- PR 필수, 최소 1명 리뷰 필요
- 자동 머지 전 CI/CD 통과 필수

### 3. 정기 동기화 시간

팀 전체가 정해진 시간에 동기화:
- 매일 오전 작업 시작 전
- 매일 오후 작업 종료 후
- PR 머지 직후

---

## 🚨 트러블슈팅

### Q1. "git pull" 실행 시 충돌 발생

```bash
# 충돌 발생
git pull origin develop
# Auto-merging src/...
# CONFLICT (content): Merge conflict in src/...

# 해결 방법 1: 충돌 수동 해결
# 1. 충돌 파일 열기
# 2. <<<<<<, ======, >>>>>> 마커 찾아 수정
# 3. git add <파일>
# 4. git commit

# 해결 방법 2: 로컬 변경사항 버리기
git reset --hard origin/develop
```

### Q2. "git reset --hard"로 작업 손실

```bash
# reflog로 이전 커밋 찾기
git reflog

# 출력 예시:
# b848b69 HEAD@{0}: reset: moving to origin/develop
# 7f12d40 HEAD@{1}: commit: feat: Add hashtags field

# 원하는 커밋으로 복구
git reset --hard HEAD@{1}
```

### Q3. Stash 적용 시 충돌

```bash
# Stash 적용
git stash pop
# CONFLICT...

# 충돌 해결 후
git add <파일>
# git commit 필요 없음 (stash는 자동 적용)

# Stash 버리기 (해결 포기)
git stash drop
```

### Q4. origin/develop은 최신인데 로컬 develop이 뒤처짐

```bash
# fetch는 했지만 merge 안 한 상태
git fetch origin  # origin/develop 업데이트만 됨

# 로컬 develop에 적용
git checkout develop
git merge origin/develop
# 또는
git pull origin develop  # fetch + merge 한번에
```

---

## 📚 참고 자료

### Git 명령어 치트시트

| 명령어 | 설명 |
|--------|------|
| `git fetch origin` | origin 최신 정보만 가져오기 (병합 안 함) |
| `git pull origin <branch>` | fetch + merge 한번에 |
| `git reset --hard origin/<branch>` | 로컬을 origin과 완전히 동일하게 (변경사항 버림) |
| `git branch -vv` | 모든 브랜치 상태 확인 |
| `git stash` | 변경사항 임시 저장 |
| `git stash pop` | 저장된 변경사항 복원 |
| `git reflog` | Git 작업 히스토리 확인 |

### 유용한 Git Alias

`~/.gitconfig`에 추가:

```ini
[alias]
    # 브랜치 상태 보기
    st = status
    br = branch -vv

    # 동기화
    sync = !git fetch origin && git pull origin $(git symbolic-ref --short HEAD)

    # 로그 예쁘게
    lg = log --oneline --graph --all --decorate

    # 안전한 reset
    undo = reset --soft HEAD^
```

사용 예시:
```bash
git sync      # 현재 브랜치 동기화
git br        # 브랜치 상태 확인
git lg        # 그래프로 커밋 히스토리 보기
```

---

## ✨ 요약

### 현재 문제
- 로컬 develop/main 브랜치가 origin보다 22-33 커밋 뒤처짐
- GitHub 자동 PR 머지 후 로컬 pull 누락

### 즉시 해야 할 일
```bash
git checkout develop && git pull origin develop
git checkout main && git pull origin main
git checkout woo
```

### 향후 습관
1. **작업 전**: `git pull origin <branch>`
2. **작업 후**: `git push origin woo`
3. **주기적 확인**: `git branch -vv`
4. **자동화**: Git hooks, IDE 설정

---

**문서 버전**: 1.0
**마지막 업데이트**: 2025-01-17
**담당자**: Teamitaka 개발팀
