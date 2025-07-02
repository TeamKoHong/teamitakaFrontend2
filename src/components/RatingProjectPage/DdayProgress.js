import CircularProgress from '../../components/Common/CircularProgress';
import styles from './DdayProgress.module.scss';

export default function DdayProgress({ dday }) {
  return (
    <div className={styles.wrapper}>
      <CircularProgress percentage={Number(dday.percent) || 0} />
      <span className={styles.label}>D+{dday.value}</span>
    </div>
  );
} 