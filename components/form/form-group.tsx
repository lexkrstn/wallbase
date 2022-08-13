import React, { FC, ReactNode } from 'react';
import styles from './form-group.module.scss';

interface FormGroupProps {
  children: ReactNode;
}

const FormGroup: FC<FormGroupProps> = ({ children }) => (
  <div className={styles.formGroup}>
    {children}
  </div>
);

FormGroup.displayName = 'FormGroup';

export default FormGroup;
