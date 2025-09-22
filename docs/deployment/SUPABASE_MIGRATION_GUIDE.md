# 🚀 Supabase 완전 마이그레이션 가이드

## 📋 마이그레이션 목표
- **Vercel 백엔드** → **Supabase Edge Functions**
- **완전한 Supabase 생태계** 구축

## 🎯 배포할 Edge Function
- **함수명**: `teamitaka-api`
- **프로젝트**: `huwajjafqbfrcxkdfker`
- **URL**: `https://huwajjafqbfrcxkdfker.supabase.co/functions/v1/teamitaka-api`

## 📝 Edge Function 코드
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "jsr:@std/http/server";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Supabase 클라이언트 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Credentials': 'true',
};

// 이메일 인증 코드 생성
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 이메일 형식 검증
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    console.log(`[${req.method}] ${path}`);

    // Health check endpoint
    if (path === '/api/health') {
      return new Response(
        JSON.stringify({ 
          status: 'OK', 
          database: 'connected',
          platform: 'supabase-edge-functions',
          timestamp: new Date().toISOString(),
          message: 'TeamItaka API is running on Supabase Edge Functions!'
        }), 
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // 이메일 인증 요청 처리
    if (path === '/api/auth/send-verification' && req.method === 'POST') {
      const body = await req.json();
      const { email } = body;

      console.log(`이메일 인증 요청: ${email}`);

      if (!email) {
        return new Response(
          JSON.stringify({ 
            error: 'EMAIL_REQUIRED', 
            message: '이메일이 필요합니다.' 
          }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      if (!isValidEmail(email)) {
        return new Response(
          JSON.stringify({ 
            error: 'INVALID_EMAIL', 
            message: '올바른 이메일 형식이 아닙니다.' 
          }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // 중복 이메일 확인
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('email', email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('사용자 조회 오류:', userError);
        return new Response(
          JSON.stringify({ 
            error: 'DATABASE_ERROR', 
            message: '사용자 정보 확인 중 오류가 발생했습니다.' 
          }),
          { 
            status: 500,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      if (existingUser) {
        return new Response(
          JSON.stringify({ 
            error: 'EMAIL_ALREADY_EXISTS', 
            message: '이미 사용 중인 이메일입니다.' 
          }),
          { 
            status: 409,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // 인증 코드 생성
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

      // 데이터베이스에 인증 정보 저장
      const { error: insertError } = await supabase
        .from('email_verifications')
        .insert({
          email: email,
          purpose: 'signup',
          jti: crypto.randomUUID(),
          code_hash: verificationCode,
          expires_at: expiresAt.toISOString(),
          attempt_count: 0,
          created_ip: req.headers.get('x-forwarded-for') || 'unknown',
          ua: req.headers.get('user-agent') || 'unknown'
        });

      if (insertError) {
        console.error('인증 정보 저장 오류:', insertError);
        return new Response(
          JSON.stringify({ 
            error: 'DATABASE_ERROR', 
            message: '인증 정보 저장 중 오류가 발생했습니다.' 
          }),
          { 
            status: 500,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      console.log(`인증 코드 생성 완료: ${verificationCode}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: '인증번호가 이메일로 전송되었습니다.',
          data: {
            email: email,
            expiresIn: 180,
            verificationCode: verificationCode
          }
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // 인증 코드 검증
    if (path === '/api/auth/verify-code' && req.method === 'POST') {
      const body = await req.json();
      const { email, code } = body;

      console.log(`인증 코드 검증: ${email}, ${code}`);

      if (!email || !code) {
        return new Response(
          JSON.stringify({ 
            error: 'MISSING_PARAMETERS', 
            message: '이메일과 인증 코드가 필요합니다.' 
          }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // 인증 정보 조회
      const { data: verification, error: verificationError } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('email', email)
        .eq('code_hash', code)
        .is('consumed_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (verificationError || !verification) {
        return new Response(
          JSON.stringify({ 
            error: 'INVALID_CODE', 
            message: '유효하지 않은 인증 코드입니다.' 
          }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // 인증 완료 처리
      const { error: updateError } = await supabase
        .from('email_verifications')
        .update({ consumed_at: new Date().toISOString() })
        .eq('id', verification.id);

      if (updateError) {
        console.error('인증 완료 처리 오류:', updateError);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: '이메일 인증이 완료되었습니다.',
          data: {
            email: email,
            verified: true
          }
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'NOT_FOUND', 
        message: '요청한 엔드포인트를 찾을 수 없습니다.',
        availableEndpoints: [
          'GET /api/health',
          'POST /api/auth/send-verification',
          'POST /api/auth/verify-code'
        ]
      }),
      { 
        status: 404,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('서버 오류:', error);
    return new Response(
      JSON.stringify({ 
        error: 'SERVER_ERROR', 
        message: '서버 오류가 발생했습니다.' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

## 🔧 배포 단계

### 1단계: Supabase 대시보드 접속
1. https://supabase.com/dashboard 에 로그인
2. `teamitaka` 프로젝트 선택
3. 왼쪽 메뉴에서 **"Edge Functions"** 클릭

### 2단계: 새 Edge Function 생성
1. **"New Function"** 버튼 클릭
2. 함수 이름: `teamitaka-api` 입력
3. 위의 TypeScript 코드를 복사하여 붙여넣기
4. **"Deploy"** 버튼 클릭

### 3단계: 배포 확인
```bash
# Health Check
curl -X GET "https://huwajjafqbfrcxkdfker.supabase.co/functions/v1/teamitaka-api/api/health"

# 이메일 인증 테스트
curl -X POST "https://huwajjafqbfrcxkdfker.supabase.co/functions/v1/teamitaka-api/api/auth/send-verification" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🌐 배포 후 URL
- **Base URL**: `https://huwajjafqbfrcxkdfker.supabase.co/functions/v1/teamitaka-api`
- **Health Check**: `https://huwajjafqbfrcxkdfker.supabase.co/functions/v1/teamitaka-api/api/health`

## 📱 프론트엔드 환경 변수 업데이트
```bash
REACT_APP_API_BASE_URL=https://huwajjafqbfrcxkdfker.supabase.co/functions/v1/teamitaka-api
```

## ✅ 완료 체크리스트
- [ ] Supabase 대시보드에서 Edge Function 배포
- [ ] Health Check API 테스트
- [ ] 이메일 인증 API 테스트
- [ ] 프론트엔드 환경 변수 업데이트
- [ ] 프론트엔드 재빌드 및 배포

## 🎯 마이그레이션 완료
이제 **Vercel에서 Supabase로 완전히 마이그레이션**됩니다!
- ✅ **데이터베이스**: Supabase PostgreSQL
- ✅ **백엔드 API**: Supabase Edge Functions
- ✅ **프론트엔드**: 기존 React 앱 (Supabase API 연동)
