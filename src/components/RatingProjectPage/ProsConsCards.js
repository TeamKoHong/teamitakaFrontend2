import React from 'react';
import styles from './ProsConsCards.module.scss';

export default function ProsConsCards({ good = [], improve = [] }) {
  const hasContent = (arr) => Array.isArray(arr) && arr.length > 0;
  if (!hasContent(good) && !hasContent(improve)) return null;

  const renderList = (items) => (
    <ul className={styles.list}>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );

  return (
    <section className={styles.wrap} aria-label="한 줄 요약">
      {hasContent(good) && (
        <div className={`${styles.card} ${styles.good}`}>
          <div className={styles.badge}>이런 점이 좋아요</div>
          {renderList(good)}
        </div>
      )}
      {hasContent(improve) && (
        <div className={`${styles.card} ${styles.improve}`}>
          <div className={styles.badge}>이런 점은 개선이 필요해요</div>
          {renderList(improve)}
        </div>
      )}
    </section>
  );
}


