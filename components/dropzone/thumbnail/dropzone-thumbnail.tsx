import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, MouseEvent, useCallback } from 'react';
import { formatFileSize } from '../../../helpers/formatters';
import {
  BOARD_A, BOARD_G, BOARD_P, PURITY_NSFW, PURITY_SFW, PURITY_SKETCHY,
} from '../../../interfaces/constants';
import styles from './dropzone-thumbnail.module.scss';

const PURITY_TO_CLASS: Record<number, string> = {
  [PURITY_SFW]: styles.sfw,
  [PURITY_SKETCHY]: styles.sketchy,
  [PURITY_NSFW]: styles.nsfw,
};

const BOARD_TO_NAME: Record<number, string> = {
  [BOARD_A]: 'A',
  [BOARD_G]: 'G',
  [BOARD_P]: 'P',
};

interface DropzoneThumbnailProps {
  id: string;
  width: number;
  height: number;
  fileName: string;
  fileSize: number;
  url: string;
  error?: string;
  success?: boolean;
  active?: boolean;
  purity?: number;
  board?: number;
  progress?: number;
  onClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}

const DropzoneThumbnail: FC<DropzoneThumbnailProps> = ({
  id, width, height, fileName, fileSize, error, success, url, active, purity,
  board, progress, onClick, onDeleteClick,
}) => {
  const classes = [styles.host];
  if (active) classes.push(styles.active);
  if (purity) classes.push(PURITY_TO_CLASS[purity]);

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (onClick) {
      onClick(id);
    }
  }, [id]);

  const handleDeleteClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(id);
    }
  }, [id]);

  return (
    <div className={classes.join(' ')} onClick={handleClick}>
      <div className={styles.fileinfo}>
        <div className={styles.filename}>
          {fileName}
        </div>
        <div className={styles.filesize}>
          {formatFileSize(fileSize, 1)}
        </div>
      </div>
      {progress !== undefined && (
        <div className={styles.progressbar}>
          <div
            className={styles.progressIndicator}
            style={{ width: `${progress.toFixed(1)}%` }}
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
            Success!
          </div>
        </div>
      )}
      <div className={styles.thlink}>
        <img src={url} alt={fileName} />
      </div>
      <div className={styles.delete} title="Remove" onClick={handleDeleteClick}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <div className={styles.resolution}>
        {width}
        &times;
        {height}
      </div>
    </div>
  );
};

DropzoneThumbnail.displayName = 'DropzoneThumbnail';

export default React.memo(DropzoneThumbnail);
