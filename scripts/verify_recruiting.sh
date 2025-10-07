#!/usr/bin/env bash
set -euo pipefail

# Verifies recruiting/ongoing/completed endpoints and CORS/auth flows.
# Required env vars:
#   SUPABASE_FUNCS_URL  e.g. https://<PROJECT_REF>.supabase.co/functions/v1/teamitaka-api
#   EMAIL               login email
#   PASSWORD            login password
# Optional:
#   ORIGIN              default: https://www.teamitaka.com
#   LIMIT               default: 10
#   DAYS                default: 7

ORIGIN=${ORIGIN:-"https://www.teamitaka.com"}
LIMIT=${LIMIT:-10}
DAYS=${DAYS:-7}

red()   { printf "\033[31m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }

req_env() {
  local name=$1
  if [ -z "${!name-}" ]; then red "Missing env: $name"; exit 1; fi
}

req_env SUPABASE_FUNCS_URL
req_env EMAIL
req_env PASSWORD

WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

http_json() {
  # $1: method, $2: url, $3: auth_token (optional), $4: data (optional)
  local method=$1 url=$2 token=${3-} data=${4-}
  local hdr=("-H" "Content-Type: application/json")
  if [ -n "$token" ]; then hdr+=("-H" "Authorization: Bearer $token"); fi
  local code
  if [ "$method" = "GET" ]; then
    code=$(curl -sS -o "$WORKDIR/body.json" -w "%{http_code}" -X GET "${hdr[@]}" "$url")
  elif [ "$method" = "POST" ]; then
    code=$(curl -sS -o "$WORKDIR/body.json" -w "%{http_code}" -X POST "${hdr[@]}" -d "$data" "$url")
  else
    code=$(curl -sS -o "$WORKDIR/body.json" -w "%{http_code}" -X "$method" "${hdr[@]}" "$url")
  fi
  echo "$code"
}

options_check() {
  # $1: url
  local url=$1
  local headers="$WORKDIR/headers.txt"
  local code
  code=$(curl -sS -o /dev/null -D "$headers" -w "%{http_code}" -X OPTIONS -H "Origin: $ORIGIN" "$url")
  if [ "$code" != "200" ]; then red "OPTIONS $url -> $code"; exit 1; fi
  if ! grep -qi "^Access-Control-Allow-Origin: \*\|^Access-Control-Allow-Origin: ${ORIGIN}$" "$headers"; then
    yellow "Access-Control-Allow-Origin missing or different for $url"; sed -n '1,20p' "$headers"
  fi
}

check_success_true() {
  if ! grep -q '"success"\s*:\s*true' "$WORKDIR/body.json"; then
    red "Expected success:true. Body:"; cat "$WORKDIR/body.json"; exit 1
  fi
}

check_items_status_contains() {
  # $1: expected status string
  local expected=$1
  if grep -q '"items"\s*:\s*\[\s*\]' "$WORKDIR/body.json"; then
    yellow "Empty items (ok)"
    return 0
  fi
  if ! grep -q '"status"\s*:\s*"'"$expected"'"' "$WORKDIR/body.json"; then
    red "No item with status=$expected found"; cat "$WORKDIR/body.json"; exit 1
  fi
}

check_has_page_object() {
  if ! grep -q '"page"\s*:' "$WORKDIR/body.json"; then
    red "Missing page object"; cat "$WORKDIR/body.json"; exit 1
  fi
}

# 1) Login -> JWT
printf "[1/9] Login... "
code=$(http_json POST "$SUPABASE_FUNCS_URL/api/auth/login" "" '{"email":"'"$EMAIL"'","password":"'"$PASSWORD"'"}')
if [ "$code" != "200" ]; then red "HTTP $code"; cat "$WORKDIR/body.json"; exit 1; fi
check_success_true
JWT=$(grep -o '"token"\s*:\s*"[^"]\+"' "$WORKDIR/body.json" | head -1 | sed -E 's/.*:\s*"(.*)"/\1/')
if [ -z "$JWT" ]; then red "No token in response"; cat "$WORKDIR/body.json"; exit 1; fi

green "ok"

# 2) OPTIONS checks (CORS preflight)
printf "[2/9] CORS OPTIONS /api/projects/mine... "
options_check "$SUPABASE_FUNCS_URL/api/projects/mine"
green "ok"

# 3) /api/auth/me
printf "[3/9] GET /api/auth/me... "
code=$(http_json GET "$SUPABASE_FUNCS_URL/api/auth/me" "$JWT")
if [ "$code" != "200" ]; then red "HTTP $code"; cat "$WORKDIR/body.json"; exit 1; fi
check_success_true
green "ok"

# 4) /api/dashboard/summary
printf "[4/9] GET /api/dashboard/summary... "
code=$(http_json GET "$SUPABASE_FUNCS_URL/api/dashboard/summary?limit=$LIMIT&days=$DAYS" "$JWT")
if [ "$code" != "200" ]; then red "HTTP $code"; cat "$WORKDIR/body.json"; exit 1; fi
check_success_true
green "ok"

# 5) /api/projects/mine?status=recruiting
printf "[5/9] GET /api/projects/mine?status=recruiting... "
code=$(http_json GET "$SUPABASE_FUNCS_URL/api/projects/mine?status=recruiting&limit=$LIMIT&offset=0" "$JWT")
if [ "$code" != "200" ]; then red "HTTP $code"; cat "$WORKDIR/body.json"; exit 1; fi
check_success_true
check_has_page_object
check_items_status_contains recruiting
green "ok"

# 6) /api/projects/mine?status=ongoing
printf "[6/9] GET /api/projects/mine?status=ongoing... "
code=$(http_json GET "$SUPABASE_FUNCS_URL/api/projects/mine?status=ongoing&limit=$LIMIT&offset=0" "$JWT")
if [ "$code" != "200" ]; then red "HTTP $code"; cat "$WORKDIR/body.json"; exit 1; fi
check_success_true
check_has_page_object
green "ok"

# 7) /api/projects/mine?status=completed
printf "[7/9] GET /api/projects/mine?status=completed... "
code=$(http_json GET "$SUPABASE_FUNCS_URL/api/projects/mine?status=completed&limit=$LIMIT&offset=0" "$JWT")
if [ "$code" != "200" ]; then red "HTTP $code"; cat "$WORKDIR/body.json"; exit 1; fi
check_success_true
check_has_page_object
green "ok"

# 8) Pagination continuity test (recruiting)
printf "[8/9] Pagination recruiting page 1... "
code=$(http_json GET "$SUPABASE_FUNCS_URL/api/projects/mine?status=recruiting&limit=$LIMIT&offset=$LIMIT" "$JWT")
if [ "$code" != "200" ]; then red "HTTP $code"; cat "$WORKDIR/body.json"; exit 1; fi
check_success_true
check_has_page_object
green "ok"

# 9) 401 check
printf "[9/9] Unauthorized check... "
code=$(http_json GET "$SUPABASE_FUNCS_URL/api/projects/mine?status=recruiting" "invalid.token")
if [ "$code" != "401" ]; then red "Expected 401, got $code"; cat "$WORKDIR/body.json"; exit 1; fi
green "ok"


green "All checks passed."
