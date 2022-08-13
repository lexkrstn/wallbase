import React, { FC, ReactNode } from 'react';
import styles from './modal-footer.module.scss';

interface ModalFooterProps {
  className?: string;
  children: ReactNode;
  right?: boolean;
  center?: boolean;
  spaceAround?: boolean;
}

const ModalFooter: FC<ModalFooterProps> = ({
  children, className, right, center, spaceAround,
}) => {
  const classes = [styles.footer];
  if (className) classes.push(className);
  if (right) classes.push(styles.right);
  if (center) classes.push(styles.center);
  if (spaceAround) classes.push(styles.spaceAround);
  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  );
};

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
