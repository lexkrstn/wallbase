import React, { FC, ReactNode } from 'react';
import styles from './label.module.scss';

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
}

const Label: FC<LabelProps> = ({ children, htmlFor }) => (
  <label className={styles.label} htmlFor={htmlFor}>
    {children}
  </label>
);

Label.displayName = 'Label';

export default Label;
