import React from 'react';
import styles from './OneLinerSummary.module.scss';

export default function OneLinerSummary({ text }) {
  if (!text) return null;
  return (
    <section className={styles.card} aria-label="한 줄 요약">
      <p className={styles.text}>{text}</p>
    </section>
  );
}


