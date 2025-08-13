import React from 'react';
import styles from './CategorySlidersGroup.module.scss';
import CategorySlider from '../Common/CategorySlider';

export default function CategorySlidersGroup({ items = [], values = {}, onChange }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className={styles.group} aria-label="카테고리 슬라이더">
      {items.map((it) => (
        <div key={it.key} className={styles.itemCard}>
          <CategorySlider
            category={it.key}
            name={it.name}
            description={it.desc}
            value={values[it.key] ?? it.value ?? 1}
            onChange={(v) => onChange && onChange(it.key, v)}
          />
        </div>
      ))}
    </section>
  );
}


