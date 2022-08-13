import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, ReactNode } from 'react';
import styles from './alert.module.scss';

interface AlertProps {
  icon?: IconProp;
  iconLarge?: boolean;
  iconClassName?: string;
  className?: string;
  children: ReactNode;
}

const Alert: FC<AlertProps> = ({
  icon, iconLarge, children, iconClassName, className,
}) => {
  const hostClasses = [styles.alert];
  if (icon) hostClasses.push(styles.withIcon);
  if (className) hostClasses.push(className);
  const iconClasses = [styles.icon];
  if (iconLarge) iconClasses.push(styles.iconLarge);
  return (
    <div className={hostClasses.join(' ')}>
      {!!icon && (
        <div className={iconClasses.join(' ')}>
          <FontAwesomeIcon icon={icon} className={iconClassName} />
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

Alert.displayName = 'Alert';

export default Alert;
