import React from 'react';
import styles from './PageLayout.module.scss';
import DefaultHeader from '../../Common/DefaultHeader';

const PageLayout = ({ title, onBack, onClose, children }) => {
    return (
        <div className={styles.pageContainer}>
            <DefaultHeader
                title={title}
                onBack={onBack}
                rightElement={onClose && (
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                )}
            />
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
