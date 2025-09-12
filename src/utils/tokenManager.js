// JWT 토큰 관리 유틸리티

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// JWT 토큰에서 페이로드 디코딩 (만료 시간 확인용)
const decodeJWT = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return null;
    }
};

// 토큰 저장
export const setToken = (token, user = null) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
        
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        
        // JWT에서 만료 시간 추출
        const payload = decodeJWT(token);
        if (payload && payload.exp) {
            localStorage.setItem(TOKEN_EXPIRY_KEY, payload.exp.toString());
        }
        
        console.log('토큰 저장 완료');
        return true;
    } catch (error) {
        console.error('토큰 저장 실패:', error);
        return false;
    }
};

// 토큰 가져오기
export const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('토큰 가져오기 실패:', error);
        return null;
    }
};

// 사용자 정보 가져오기
export const getUser = () => {
    try {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        return null;
    }
};

// 토큰 및 사용자 정보 삭제
export const removeToken = () => {
    try {
        const hadToken = localStorage.getItem(TOKEN_KEY) !== null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        
        // 실제로 토큰이 있었던 경우에만 로그 출력
        if (hadToken) {
            console.log('토큰 삭제 완료');
        }
        return true;
    } catch (error) {
        console.error('토큰 삭제 실패:', error);
        return false;
    }
};

// 토큰 유효성 검사
export const isTokenValid = () => {
    try {
        const token = getToken();
        if (!token) return false;
        
        const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiryStr) {
            // 만료 시간이 없으면 JWT에서 직접 확인
            const payload = decodeJWT(token);
            if (!payload || !payload.exp) return false;
            
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now;
        }
        
        const expiry = parseInt(expiryStr);
        const now = Math.floor(Date.now() / 1000);
        
        return expiry > now;
    } catch (error) {
        console.error('토큰 유효성 검사 실패:', error);
        return false;
    }
};

// 토큰 만료까지 남은 시간 (초 단위)
export const getTokenRemainingTime = () => {
    try {
        const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiryStr) {
            const token = getToken();
            if (!token) return 0;
            
            const payload = decodeJWT(token);
            if (!payload || !payload.exp) return 0;
            
            const now = Math.floor(Date.now() / 1000);
            return Math.max(0, payload.exp - now);
        }
        
        const expiry = parseInt(expiryStr);
        const now = Math.floor(Date.now() / 1000);
        
        return Math.max(0, expiry - now);
    } catch (error) {
        console.error('토큰 남은 시간 계산 실패:', error);
        return 0;
    }
};

// 인증 헤더 생성
export const getAuthHeader = () => {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 인증된 사용자인지 확인
export const isAuthenticated = () => {
    return isTokenValid();
};

// 토큰 자동 갱신을 위한 임계값 체크 (30분 미만 남은 경우)
export const shouldRefreshToken = () => {
    const remainingTime = getTokenRemainingTime();
    return remainingTime > 0 && remainingTime < 30 * 60; // 30분
};

// 로그아웃
export const logout = () => {
    removeToken();
    // 필요한 경우 추가 정리 작업
    console.log('로그아웃 완료');
};

// 토큰 정보 디버깅용
export const getTokenInfo = () => {
    try {
        const token = getToken();
        if (!token) return null;
        
        const payload = decodeJWT(token);
        if (!payload) return null;
        
        return {
            userId: payload.sub || payload.userId,
            email: payload.email,
            issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
            expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
            remainingTime: getTokenRemainingTime()
        };
    } catch (error) {
        console.error('토큰 정보 가져오기 실패:', error);
        return null;
    }
};