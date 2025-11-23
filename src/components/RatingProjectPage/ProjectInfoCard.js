import styles from './ProjectInfoCard.module.scss';
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg';
import { ReactComponent as ClockIcon } from '../../assets/icons/clock.svg';
import DdayProgress from './DdayProgress';

export default function ProjectInfoCard({ name, period, meetingTime, avatars, dday, id }) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div className={styles.projectName}>{name}</div>
          <div className={styles.infoRow}>
            <span className={styles.iconText}><CalendarIcon className={styles.icon} aria-hidden="true" /> {period}</span>
            {meetingTime && (
              <span className={styles.iconText}><ClockIcon className={styles.icon} aria-hidden="true" /> {meetingTime}</span>
            )}
          </div>
          <div className={styles.avatars}>
            {avatars.map((src, i) => (
              <img key={i} src={src} alt="avatar" className={styles.avatar} />
            ))}
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.progressAndId}>
            <DdayProgress dday={dday} />
          </div>
        </div>
      </div>
    </div>
  );
} 