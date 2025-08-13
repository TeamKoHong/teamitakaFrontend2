import React from 'react';
import RatingInputStars from '../RatingManagement/RatingInputStars/RatingInputStars';
import styles from './MyRatingSection.module.scss';

export default function MyRatingSection({ score = 0 }) {
  return (
    <section className={styles.section} aria-label="내가 받은 별점">
      <h2 className={styles.title}>내가 받은 별점</h2>
      <div className={styles.row}>
        <RatingInputStars initialRating={score} readOnly maxStars={5} />
        <span className={styles.score}>{Number(score).toFixed(1)}</span>
      </div>
    </section>
  );
}


