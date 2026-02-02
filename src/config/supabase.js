import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경변수가 설정되지 않았습니다. 이메일 OTP 인증이 작동하지 않습니다.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
