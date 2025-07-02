import styles from './TeamMemberEvaluation.module.scss';

export default function TeamMemberEvaluation({ question, answers }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>팀원 평가지</div>
      <div className={styles.question}>{question}</div>
      {answers.map((ans, i) => (
        <div className={styles.answer} key={i}>{ans}</div>
      ))}
      <div className={styles.more}>상세 내용 더보기</div>
    </div>
  );
} 