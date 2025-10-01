// 분기처리하는 페이지
import { useState, useEffect } from 'react';
import NotificationsEmpty from './NotificationsEmpty';
import NotificationsList from './NotificationsList';

export default function NotificationsPage() {
  const [items, setItems] = useState(null); // null = 로딩중

  useEffect(() => {
    // localStorage에서 데이터 불러오기
    const raw = localStorage.getItem('notif.items');
    const parsed = raw ? JSON.parse(raw) : [];
    setItems(parsed);
  }, []);

  if (items === null) return null; // 로딩중일 때

  return items.length === 0
    ? <NotificationsEmpty />
    : <NotificationsList items={items} />;
}
