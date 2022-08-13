import React, { FC, ReactNode } from 'react';
import styles from './modal-body.module.scss';

interface ModalBodyProps {
  className?: string;
  children: ReactNode;
}

const ModalBody: FC<ModalBodyProps> = ({ children, className }) => {
  const classes = [styles.body];
  if (className) classes.push(className);
  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  );
};

ModalBody.displayName = 'ModalBody';

export default ModalBody;
