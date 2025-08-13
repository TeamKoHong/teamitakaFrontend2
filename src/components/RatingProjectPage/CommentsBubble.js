import React from 'react';
import styles from './CommentsBubble.module.scss';

export default function CommentsBubble({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className={styles.bubble} aria-label="요약 코멘트">
      <ul className={styles.list}>
        {items.map((c, i) => (
          <li key={i}>{typeof c === 'string' ? c : c.text}</li>
        ))}
      </ul>
    </section>
  );
}


