import React from 'react';
import styles from './KeywordBubble.module.scss';

export default function KeywordBubble({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className={styles.bubble} aria-label="키워드 관련 코멘트">
      <ul className={styles.list}>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  );
}


