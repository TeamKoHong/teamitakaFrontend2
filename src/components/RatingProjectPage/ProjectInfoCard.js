import styles from './ProjectInfoCard.module.scss';
import { PiCalendarBlankDuotone, PiClockDuotone } from "react-icons/pi";
import DdayProgress from './DdayProgress';

export default function ProjectInfoCard({ name, period, meetingTime, avatars, dday, id }) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div className={styles.projectName}>{name}</div>
          <div className={styles.infoRow}>
            <span className={styles.iconText}><PiCalendarBlankDuotone /> {period}</span>
            <span className={styles.iconText}><PiClockDuotone /> {meetingTime}</span>
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