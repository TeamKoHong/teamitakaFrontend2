import React from 'react';
import styles from './Button.module.scss';

/**
 * Button Component
 * @param {string} variant - 'primary', 'secondary', 'ghost'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} fullWidth - Whether to take full width
 * @param {boolean} isLoading - Loading state
 * @param {ReactNode} leftIcon - Icon on the left
 * @param {ReactNode} rightIcon - Icon on the right
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    disabled,
    leftIcon,
    rightIcon,
    className,
    ...props
}) => {
    const buttonClass = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClass}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <div className={styles.spinner} />}
            {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </button>
    );
};

export default Button;
