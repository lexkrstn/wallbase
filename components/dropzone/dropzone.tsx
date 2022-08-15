import { faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { DragEvent, FC, MouseEvent, ReactNode, useCallback, useState } from 'react';
import { ImageFileData, readImageFile } from '../../helpers/image';
import styles from './dropzone.module.scss';

interface DropZoneProps {
  children?: ReactNode;
  disabled?: boolean;
  onImagesLoaded: (images: ImageFileData[]) => void;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const DropZone: FC<DropZoneProps> = ({ children, disabled, onImagesLoaded, onClick }) => {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dropzoneClasses = [styles.host];
  if (disabled || loading) dropzoneClasses.push(styles.disabled);
  if (dragOver) dropzoneClasses.push(styles.dragOver);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled) return;
    const promises = Array.prototype.slice.call(e.dataTransfer.files).map(readImageFile);
    setLoading(true);
    const results = await Promise.allSettled(promises);
    setLoading(false);
    const images = results.filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<ImageFileData>).value);
    onImagesLoaded(images);
  }, [disabled]);

  return (
    <div
      className={dropzoneClasses.join(' ')}
      title={loading ? '' : 'Click to select wallapapers'}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
    >
      <div className={styles.border}>
        {!children && (
          <>
            <div className={styles.bgicon}>
              <FontAwesomeIcon icon={faImage} />
            </div>
            {!loading && (
              <div className={styles.message}>
                <p>
                  <b>Drop files</b>
                  {' in the box'}
                </p>
                <p><small>(or click here)</small></p>
              </div>
            )}
          </>
        )}
        {loading && (
          <div className={styles.loading}>
            <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

DropZone.displayName = 'DropZone';

export default React.memo(DropZone);
