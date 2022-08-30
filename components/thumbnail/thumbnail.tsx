import { faCheckCircle, faTimes, faFlag, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { FC, MouseEvent, useCallback } from 'react';
import { Board, Purity } from '@/lib/constants';
import Tag from '@/entities/tag';
import styles from './thumbnail.module.scss';

const PURITY_TO_CLASS: Record<number, string> = {
  [Purity.SFW]: styles.sfw,
  [Purity.SKETCHY]: styles.sketchy,
  [Purity.NSFW]: styles.nsfw,
};

const BOARD_TO_NAME: Record<number, string> = {
  [Board.A]: 'A',
  [Board.G]: 'G',
  [Board.P]: 'P',
};

interface ThumbnailProps {
  id: string;
  width: number;
  height: number;
  url: string;
  error?: string;
  success?: boolean;
  active?: boolean;
  purity?: number;
  board?: number;
  progress?: number;
  loading?: boolean;
  similarity?: number;
  interactive?: boolean;
  href?: string;
  tags?: Tag[];
  disabled?: boolean;
  onPurityClick?: (id: string) => void;
  onTagBtnClick?: (id: string) => void;
  onClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}

const Thumbnail: FC<ThumbnailProps> = ({
  id, width, height, error, success, url, active, purity,
  board, progress, similarity, interactive, href, tags, loading, disabled,
  onClick, onDeleteClick, onPurityClick, onTagBtnClick,
}) => {
  const classes = [styles.host];
  if (active) classes.push(styles.active);
  if (purity) classes.push(PURITY_TO_CLASS[purity]);
  if (interactive) classes.push(styles.interactive);
  if (loading) classes.push(styles.loading);
  if (disabled) classes.push(styles.disabled);

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (disabled) return;
    const target = event.target as Element;
    if (onDeleteClick && target.closest(`.${styles.delete}`)) {
      onDeleteClick(id);
      return;
    }
    if (onPurityClick && target.closest(`.${styles.purity}`)) {
      onPurityClick(id);
      return;
    }
    if (onTagBtnClick && target.closest(`.${styles.tagbtn}`)) {
      onTagBtnClick(id);
      return;
    }
    if (onClick) {
      onClick(id);
    }
  }, [id, disabled, onDeleteClick, onClick, onPurityClick, onTagBtnClick]);

  return (
    <div className={classes.join(' ')} onClick={handleClick} title="">
      {(progress !== undefined || loading) && (
        <div className={styles.progressbar}>
          <div
            className={styles.progressIndicator}
            style={progress ? { width: `${progress.toFixed(1)}%` } : {}}
          />
        </div>
      )}
      {!!board && <div className={styles.board}>{BOARD_TO_NAME[board]}</div>}
      {!!error && (
        <div className={styles.error}>
          <div className={styles.errorMessage}>
            {error}
          </div>
        </div>
      )}
      {!!success && (
        <div className={styles.success}>
          <div className={styles.successMessage}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
        </div>
      )}
      {!!similarity && (
        <div className={styles.similarity}>{similarity}</div>
      )}
      {!!href && (
        <Link href={href}>
          <a className={styles.thlink}>
            <img src={url} alt="" />
          </a>
        </Link>
      )}
      {!href && (
        <div className={styles.thlink}>
          <img src={url} alt="" />
        </div>
      )}
      <div className={styles.delete} title="Remove">
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <div className={styles.resolution}>
        <div className={styles.purity}>
          <FontAwesomeIcon icon={faFlag} />
        </div>
        <div className={`${styles.tagbtn} ${onTagBtnClick ? styles.tagbtnClickable : ''}`}>
          <FontAwesomeIcon icon={faTags} />
          {!!tags && (
            <>
              &times;
              {tags.length}
            </>
          )}
        </div>
        {width}
        &times;
        {height}
      </div>
    </div>
  );
};

Thumbnail.displayName = 'Thumbnail';

export default React.memo(Thumbnail);
