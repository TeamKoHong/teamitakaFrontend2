import React from 'react';
import './CompletedProjectSimpleCard.module.scss';
import styles from './CompletedProjectSimpleCard.module.scss';
import { IoChevronForwardOutline } from "react-icons/io5";

const CompletedProjectSimpleCard = ({ project, onClick }) => {
    return (
        <div
            className={styles.completedCard}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.content}>
                <div className={styles.info}>
                    <h3 className={styles.title}>{project.title}</h3>
                    <p className={styles.subtitle}>{project.description || '프로젝트 설명이 없습니다.'}</p>
                </div>

                <div className={styles.iconWrapper}>
                    <IoChevronForwardOutline className={styles.chevronIcon} />
                </div>
            </div>
        </div>
    );
};

export default CompletedProjectSimpleCard;
