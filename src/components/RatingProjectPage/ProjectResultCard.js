import styles from './ProjectResultCard.module.scss';

function displayText(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.host;
  } catch (e) {
    return url.replace(/^https?:\/\//, '');
  }
}

export default function ProjectResultCard({ resultLink }) {
  if (!resultLink) return null;
  return (
    <section className={styles.section} aria-labelledby="result-title">
      <h2 id="result-title" className={styles.sectionTitle}>프로젝트 결과물</h2>
      <a href={resultLink} className={styles.resultRow} target="_blank" rel="noopener noreferrer" aria-label="프로젝트 결과물 링크">
        <span className={styles.linkIcon} aria-hidden="true" />
        <span className={styles.urlText}>{displayText(resultLink)}</span>
      </a>
      <hr className={styles.dividerStrong} />
    </section>
  );
}