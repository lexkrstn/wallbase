import Button from '@/components/buttons/button';
import React, { FC } from 'react';
import styles from './thumbnail-page-separator.module.scss';

interface ThumbnailPageSeparatorProps {
  page: number;
  totalPages: number;
}

const ThumbnailPageSeparator: FC<ThumbnailPageSeparatorProps> = ({ page, totalPages }) => {
  return (
    <div className={styles.host}>
      {'Page '}
      <span className={styles.page}>{page}</span>
      {' of '}
      <span className={styles.page}>{totalPages}</span>
      <div className={styles.btnWrap}>
        <Button
          xsmall
          dark
          title="Scroll to the top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          &uarr;
        </Button>
      </div>
    </div>
  );
};

ThumbnailPageSeparator.displayName = 'ThumbnailPageSeparator';

export default ThumbnailPageSeparator;
