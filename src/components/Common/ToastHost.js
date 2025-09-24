import React from 'react';
import SessionExpiredModal from './SessionExpiredModal';

/**
 * 간단한 전역 토스트/알림 호스트
 * - 이벤트 기반으로 로그인 만료 알림 표시
 */
export const toastBus = new EventTarget();

export function notifyLoginExpired(message = '로그인이 만료되었습니다. 다시 로그인해주세요.') {
  // 수동 로그아웃 등에서 suppress 플래그가 있으면 표시하지 않음
  const suppressed = sessionStorage.getItem('suppress-session-expired') === '1';
  if (suppressed) {
    sessionStorage.removeItem('suppress-session-expired');
    return;
  }
  toastBus.dispatchEvent(new CustomEvent('login-expired', { detail: { message } }));
}

export default function ToastHost() {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    const handler = (e) => {
      setMsg(e.detail?.message || '로그인이 만료되었습니다. 다시 로그인해주세요.');
      setOpen(true);
    };
    toastBus.addEventListener('login-expired', handler);
    return () => toastBus.removeEventListener('login-expired', handler);
  }, []);

  const close = () => setOpen(false);

  return (
    <SessionExpiredModal isOpen={open} message={msg} onClose={close} />
  );
}


