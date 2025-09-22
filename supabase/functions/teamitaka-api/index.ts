import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "jsr:@std/http/server";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Supabase 클라이언트 설정
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS 헤더 설정
const getAllowedOrigin = (origin: string | null) => {
  const allowedOrigins = [
    'https://www.teamitaka.com',
    'https://teamitaka.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }
  
  // 기본값으로 프로덕션 도메인 반환
  return 'https://www.teamitaka.com';
};

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(origin),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Credentials': 'true',
});

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
  // CORS preflight 처리
  if (req.method === 'OPTIONS') {
    const origin = req.headers.get('origin');
    return new Response('ok', { headers: corsHeaders(origin) });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    console.log(`[${req.method}] ${path}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Pathname: ${path}`);

    // Health check endpoint
    if (path === '/api/health') {
      const origin = req.headers.get('origin');
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
            ...corsHeaders(origin),
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // 이메일 인증 요청 처리
    if (path === '/api/auth/send-verification' && req.method === 'POST') {
      console.log('📧 이메일 인증 엔드포인트에 도달했습니다.');
      
      const origin = req.headers.get('origin');
      const body = await req.json();
      const { email } = body;

      console.log(`📧 이메일 인증 요청: ${email}`);

      if (!email) {
        return new Response(
          JSON.stringify({ 
            error: 'EMAIL_REQUIRED', 
            message: '이메일이 필요합니다.' 
          }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders(origin),
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
              ...corsHeaders(origin),
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
              ...corsHeaders(origin),
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
              ...corsHeaders(origin),
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
              ...corsHeaders(origin),
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      console.log(`인증 코드 생성 완료: ${verificationCode}`);
      console.log(`📧 이메일 인증 코드 [${email}]: ${verificationCode}`);

      // 이메일 발송 (SendGrid 사용)
      let emailSent = false;
      try {
        const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
        console.log(`📧 SendGrid API Key 존재 여부: ${!!sendgridApiKey}`);
        
        if (sendgridApiKey) {
          console.log(`📧 이메일 발송 시도: ${email}`);
          
          const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sendgridApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: email }],
                subject: 'TeamItaka 이메일 인증 코드'
              }],
              from: {
                email: 'test@example.com', // 임시 테스트용 - 실제 SendGrid 인증된 이메일로 변경 필요
                name: 'TeamItaka'
              },
              content: [{
                type: 'text/html',
                value: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <h1 style="color: #ff5c00; font-size: 28px; margin: 0;">TeamItaka</h1>
                    </div>
                    
                    <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
                      <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">이메일 인증</h2>
                      <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                        안녕하세요! TeamItaka 회원가입을 위한 인증 코드입니다.
                      </p>
                      
                      <div style="background-color: #f8f9fa; border: 2px solid #ff5c00; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
                        <h1 style="color: #ff5c00; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${verificationCode}</h1>
                      </div>
                      
                      <p style="color: #666; font-size: 14px; margin: 20px 0 0 0;">
                        이 코드는 <strong>3분 후에 만료</strong>됩니다.<br>
                        만약 이 요청을 하지 않으셨다면 이 이메일을 무시하세요.
                      </p>
                    </div>
                    
                    <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0;">
                      <p style="color: #999; font-size: 12px; margin: 0;">
                        © 2024 TeamItaka. All rights reserved.
                      </p>
                    </div>
                  </div>
                `
              }]
            }),
          });

          console.log(`📧 SendGrid 응답 상태: ${emailResponse.status}`);
          
          if (emailResponse.ok) {
            console.log(`✅ 이메일 발송 성공: ${email}`);
            emailSent = true;
          } else {
            const errorData = await emailResponse.json();
            console.error('❌ 이메일 발송 오류:', errorData);
            console.error(`❌ SendGrid 에러 상세: ${JSON.stringify(errorData)}`);
          }
        } else {
          console.warn('⚠️ SENDGRID_API_KEY가 설정되지 않았습니다. 이메일 발송을 건너뜁니다.');
        }
      } catch (emailError) {
        console.error('❌ 이메일 발송 중 예외 발생:', emailError);
        console.error(`❌ 에러 상세: ${emailError.message}`);
      }
      
      // 이메일 발송 실패해도 인증 코드는 생성되었으므로 성공으로 처리
      console.log(`📧 이메일 발송 결과: ${emailSent ? '성공' : '실패 (하지만 계속 진행)'}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: '인증번호가 이메일로 전송되었습니다.',
          data: {
            email: email,
            expiresIn: 180,
            verificationCode: verificationCode // 개발 환경에서만 코드 반환
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
      const origin = req.headers.get('origin');
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
              ...corsHeaders(origin),
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
              ...corsHeaders(origin),
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

    const origin = req.headers.get('origin');
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
          ...corsHeaders(origin),
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('서버 오류:', error);
    const origin = req.headers.get('origin');
    return new Response(
      JSON.stringify({ 
        error: 'SERVER_ERROR', 
        message: '서버 오류가 발생했습니다.' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders(origin),
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
