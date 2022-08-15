import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, ReactElement, ReactNode } from 'react';
import styles from './thumbnail-grid.module.scss';

interface ThumbnailGridProps {
  children: ReactNode;
}

const ThumbnailGrid: FC<ThumbnailGridProps> = ({ children }) => (
  <div className={styles.host}>
    {!!children && React.Children.map(children, child => (
      <div className={styles.cell} key={(child as ReactElement).key}>
        {child}
      </div>
    ))}
    {!children && (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    )}
  </div>
);

ThumbnailGrid.displayName = 'ThumbnailGrid';

export default ThumbnailGrid;
