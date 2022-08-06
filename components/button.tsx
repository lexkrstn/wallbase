import Link from 'next/link';
import React, { ReactElement, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import styles from './button.module.scss';

type ButtonProps = (
  ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>
) & {
  rounded: true; // there is no other types defined in css yet
  sm: true;
};

export default function Button({ children, rounded, sm, ...props }: ButtonProps): ReactElement {
  const anchor = !!(props as AnchorHTMLAttributes<HTMLAnchorElement>).href;
  const classes = [styles.btnRounded];
  if (anchor) {
    return (
      <Link
        href={(props as AnchorHTMLAttributes<HTMLAnchorElement>).href as string}
      >
        <a className={classes.join(' ')}>{children}</a>
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={classes.join(' ')}
    >
      {children}
    </button>
  );
}