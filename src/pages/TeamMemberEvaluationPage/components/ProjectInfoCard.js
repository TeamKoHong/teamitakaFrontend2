import React from 'react';
import styles from './ProjectInfoCard.module.scss';

const ProjectInfoCard = ({ projectData, memberData, onMemberSelect }) => {
    if (!projectData) return null;

    const calculateDDay = (startDate) => {
        if (!startDate) return '';
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `D + ${diffDays} `;
    };

    const dDay = calculateDDay(projectData.startDate);
    const bgImage = projectData.backgroundImage || null;

    return (
        <div className={styles.projectInfoCard}>
            {/* Project Header with Background Image */}
            <div
                className={`${styles.projectHeader} ${bgImage ? styles.hasImage : ''} `}
                style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
            >
                <div className={styles.projectInfo}>
                    <div className={styles.projectTitle}>{projectData.name}</div>
                    <div className={styles.infoRow}>
                        <span>📅</span>
                        <span>프로젝트 기간</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span>🕐</span>
                        <span>교육 회의 시간</span>
                    </div>
                </div>

                {/* D-day Badge - Absolute positioned */}
                <div className={styles.dDayBadge}>
                    {dDay}
                </div>
            </div>

            {/* Team Member Avatars */}
            <div className={styles.teamAvatars}>
                {projectData.members
                    .sort((a, b) => {
                        // Show completed members last
                        if (a.status === 'completed' && b.status !== 'completed') return 1;
                        if (a.status !== 'completed' && b.status === 'completed') return -1;
                        return 0;
                    })
                    .map((member) => {
                        const isCurrent = memberData && member.id === memberData.id;
                        const isCompleted = member.status === 'completed';

                        return (
                            <div
                                key={member.id}
                                className={`${styles.avatarWrapper} ${isCompleted ? styles.disabled : ''}`}
                                onClick={() => onMemberSelect && onMemberSelect(member.id)}
                            >
                                <div className={`${styles.avatar} ${isCurrent ? styles.current : ''} ${isCompleted ? styles.completed : ''}`}>
                                    <img src={member.avatar} alt={member.name} />
                                    {isCompleted && (
                                        <div className={styles.completedBadge}>
                                            <span>✓</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.memberInfo}>
                                    <div className={styles.memberName}>{member.name}</div>
                                    <div className={styles.memberRole}>{member.position}</div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default ProjectInfoCard;
