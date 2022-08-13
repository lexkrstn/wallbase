import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { FC, MouseEventHandler, ReactNode } from 'react';
import styles from './button.module.scss';

interface ButtonProps {
  href?: string;
  children: ReactNode;
  rounded?: boolean;
  small?: boolean;
  xsmall?: boolean;
  submit?: boolean;
  dark?: boolean;
  regular?: boolean;
  primary?: boolean;
  danger?: boolean;
  success?: boolean;
  className?: string;
  iconPrepend?: IconProp;
  iconAppend?: IconProp;
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<ButtonProps> = ({
  className, children, rounded, small, xsmall, dark, regular, primary, danger,
  success, submit, href, onClick, iconAppend, iconPrepend, loading, disabled,
}) => {
  const classes = [styles.button];
  if (rounded) classes.push(styles.rounded);
  if (small) classes.push(styles.small);
  if (xsmall) classes.push(styles.xsmall);
  if (dark) classes.push(styles.dark);
  if (regular) classes.push(styles.regular);
  if (primary) classes.push(styles.primary);
  if (danger) classes.push(styles.danger);
  if (success) classes.push(styles.success);
  if (disabled) classes.push(styles.disabled);
  if (className) classes.push(className);
  const inner = (
    <>
      {!!iconPrepend && !loading && (
        <FontAwesomeIcon icon={iconPrepend} className={styles.iconPrepend} />
      )}
      {!!loading && (
        <FontAwesomeIcon icon={faSpinner} className={`${styles.iconPrepend} ${styles.spinner}`} />
      )}
      {children}
      {!!iconAppend && (
        <FontAwesomeIcon icon={iconAppend} className={styles.iconAppend} />
      )}
    </>
  );
  return (
    <>
      {!href && (
        <button
          type={submit ? 'submit' : 'button'}
          className={classes.join(' ')}
          onClick={onClick}
          disabled={disabled}
        >
          {inner}
        </button>
      )}
      {!!href && (
        <Link href={href}>
          <a className={classes.join(' ')}>
            {inner}
          </a>
        </Link>
      )}
    </>
  );
}

export default Button;
