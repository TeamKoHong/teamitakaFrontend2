import styles from './ProjectResultCard.module.scss';

export default function ProjectResultCard({ resultLink }) {
  if (!resultLink) return null;
  return (
    <div className={styles.card}>
      <div className={styles.title}>프로젝트 결과물</div>
      <a href={resultLink} className={styles.link} target="_blank" rel="noopener noreferrer">
        {resultLink}
      </a>
    </div>
  );
} 