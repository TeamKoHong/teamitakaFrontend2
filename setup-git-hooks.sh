#!/bin/bash

# Git Hooks 자동 설정 스크립트
# Teamitaka Frontend 프로젝트

set -e

echo "🔧 Git Hooks 설정 시작..."
echo ""

# Git 저장소 확인
if [ ! -d ".git" ]; then
    echo "❌ 오류: Git 저장소가 아닙니다."
    echo "   프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

# Hooks 디렉토리 생성 (없으면)
HOOKS_DIR=".git/hooks"
if [ ! -d "$HOOKS_DIR" ]; then
    mkdir -p "$HOOKS_DIR"
    echo "✅ Hooks 디렉토리 생성 완료"
fi

# Pre-push hook 설정
PRE_PUSH_HOOK="$HOOKS_DIR/pre-push"

echo "📝 Pre-push hook 작성 중..."

cat > "$PRE_PUSH_HOOK" << 'EOF'
#!/bin/bash

# Pre-push hook: 브랜치 동기화 상태 확인
# woo → develop → main 브랜치 플로우에서 로컬 브랜치가 origin과 동기화되었는지 확인

# 현재 브랜치 이름
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ -z "$BRANCH" ]; then
    echo "⚠️  Warning: Detached HEAD 상태입니다."
    exit 0
fi

echo "🔍 브랜치 동기화 상태 확인 중..."
echo "   현재 브랜치: $BRANCH"

# Origin 최신 정보 가져오기
git fetch origin --quiet 2>/dev/null

# 로컬 커밋 해시
LOCAL=$(git rev-parse @ 2>/dev/null)

# Origin 커밋 해시
REMOTE=$(git rev-parse @{u} 2>/dev/null)

# Origin 트래킹 브랜치가 없으면 통과
if [ -z "$REMOTE" ]; then
    echo "ℹ️  Info: Origin 트래킹 브랜치가 설정되지 않았습니다."
    exit 0
fi

# 로컬과 origin이 같으면 통과
if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ 브랜치가 origin과 동기화되어 있습니다."
    exit 0
fi

# Base 커밋 (공통 조상)
BASE=$(git merge-base @ @{u} 2>/dev/null)

# 상태 판별
if [ "$LOCAL" = "$BASE" ]; then
    # 로컬이 뒤처진 경우 (behind)
    BEHIND=$(git rev-list --count @..@{u} 2>/dev/null)
    echo ""
    echo "⚠️  경고: 브랜치 '$BRANCH'가 origin보다 $BEHIND 커밋 뒤처져 있습니다!"
    echo ""
    echo "   다음 명령어로 동기화하세요:"
    echo "   $ git pull origin $BRANCH"
    echo ""
    read -p "   그래도 push 하시겠습니까? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Push 취소됨"
        exit 1
    fi
elif [ "$REMOTE" = "$BASE" ]; then
    # 로컬이 앞선 경우 (ahead) - 정상
    AHEAD=$(git rev-list --count @{u}..@ 2>/dev/null)
    echo "✅ 브랜치가 origin보다 $AHEAD 커밋 앞서 있습니다. (정상)"
else
    # Diverged - 로컬과 origin이 분기됨
    AHEAD=$(git rev-list --count @{u}..@ 2>/dev/null)
    BEHIND=$(git rev-list --count @..@{u} 2>/dev/null)
    echo ""
    echo "⚠️  경고: 브랜치 '$BRANCH'가 origin과 분기되었습니다!"
    echo "   로컬: +$AHEAD 커밋"
    echo "   Origin: +$BEHIND 커밋"
    echo ""
    echo "   다음 명령어로 병합하세요:"
    echo "   $ git pull origin $BRANCH"
    echo ""
    read -p "   그래도 push 하시겠습니까? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Push 취소됨"
        exit 1
    fi
fi

echo "✅ Push 진행..."
exit 0
EOF

# 실행 권한 부여
chmod +x "$PRE_PUSH_HOOK"

echo "✅ Pre-push hook 설치 완료!"
echo ""

# 설치된 hook 확인
if [ -x "$PRE_PUSH_HOOK" ]; then
    echo "📋 설치된 Hook:"
    echo "   - Pre-push hook: 브랜치 동기화 상태 확인"
    echo ""
    echo "🎯 동작 방식:"
    echo "   1. git push 실행 시 자동으로 origin 상태 확인"
    echo "   2. 브랜치가 behind 상태면 경고 메시지 표시"
    echo "   3. 사용자에게 계속 진행 여부 확인"
    echo ""
    echo "💡 테스트:"
    echo "   $ git push origin woo"
    echo "   → Hook이 브랜치 동기화 상태를 자동으로 확인합니다"
    echo ""
    echo "🔧 Hook 비활성화 (필요 시):"
    echo "   $ rm .git/hooks/pre-push"
    echo ""
    echo "✨ 설정 완료!"
else
    echo "❌ 오류: Hook 실행 권한 설정 실패"
    exit 1
fi
