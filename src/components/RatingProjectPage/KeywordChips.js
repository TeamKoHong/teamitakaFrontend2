import React from 'react';
import styles from './KeywordChips.module.scss';

export default function KeywordChips({ items = [], active }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className={styles.chipsWrap} aria-label="키워드 칩">
      {items.map((kw) => (
        <span
          key={kw}
          className={`${styles.chip} ${active === kw ? styles.active : ''}`}
        >
          #{kw}
        </span>
      ))}
    </div>
  );
}


