import {
  faUpload, faFolderOpen, faFloppyDisk, faTrash, faChevronCircleRight,
  faTimes, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { ImageFileData } from '../../helpers/image';
import Button from '../buttons/button';
import { ButtonTextField, TextField } from '../form';
import BoardFilter from '../triple-filters/board-filter';
import PurityFilter from '../triple-filters/purity-filter';
import ThumbnailGrid from '../thumbnail/grid';
import DropZone from '../dropzone';
import DropzoneThumbnail from '../dropzone/thumbnail';
import styles from './upload-pane.module.scss';
import { useImageFileDialog } from '../../lib/hooks/useImageFileDialog';
import NotAllSetModal from './not-all-set-modal';

interface ThumbnailState extends ImageFileData {
  id: string;
  active: boolean;
  purity: number;
  board: number;
  sourceUrl: string;
  progress?: number;
}

function getCommonPurityOfActive(thumbnails: ThumbnailState[]): number {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return 0;
  const { purity } = active[0];
  return active.every(t => t.purity === purity) ? purity : 0;
}

function getCommonBoardOfActive(thumbnails: ThumbnailState[]): number {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return 0;
  const { board } = active[0];
  return active.every(t => t.board === board) ? board : 0;
}

function getCommonSourceUrlOfActive(thumbnails: ThumbnailState[]): string {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return '';
  const { sourceUrl } = active[0];
  return active.every(t => t.sourceUrl === sourceUrl) ? sourceUrl : '/* multiple */';
}

interface UploadPaneProps {

}

const UploadPane: NextPage<UploadPaneProps> = () => {
  const idCounterRef = useRef(0);
  const [notAllSetModalShown, setNotAllSetModalShown] = useState(false);
  const [multiselect, setMultiselect] = useState(true);
  const [state, setState] = useState<'edit' | 'error' | 'pick'>('pick');
  const [{ images, board, purity, sourceUrl }, setImagesState] = useState({
    images: [] as ThumbnailState[],
    board: 0,
    purity: 0,
    sourceUrl: '',
  });
  const imagesHaveBoard = images.every(image => image.board !== 0);
  const imagesHavePurity = images.every(image => image.purity !== 0);
  const canUpload = images.length > 0 && imagesHaveBoard && imagesHavePurity;
  const activeImageCount = images.reduce((count, image) => count + (image.active ? 1 : 0), 0);
  console.log(activeImageCount)

  const closeNotAllSetModal = useCallback(() => setNotAllSetModalShown(false), []);

  const handleThumbnailClick = useCallback((id: string) => {
    setImagesState(oldState => {
      const newImages = oldState.images.map(image => ({
        ...image,
        active: multiselect
          ? (image.id === id ? !image.active : image.active)
          : image.id === id,
      }));
      return {
        images: newImages,
        board: getCommonBoardOfActive(newImages),
        purity: getCommonPurityOfActive(newImages),
        sourceUrl: getCommonSourceUrlOfActive(newImages),
      };
    });
  }, [multiselect]);

  const handleDeleteClick = useCallback((id: string) => {
    setImagesState(oldState => {
      const newImages = oldState.images.filter(image => {
        if (image.id !== id) return true;
        image.dispose(); // calls URL.revokeObjectURL()
        return false;
      });
      return {
        images: newImages,
        board: getCommonBoardOfActive(newImages),
        purity: getCommonPurityOfActive(newImages),
        sourceUrl: getCommonSourceUrlOfActive(newImages),
      };
    });
  }, []);

  const clearImages = useCallback(() => {
    setImagesState(oldState => ({
      purity: 0,
      board: 0,
      sourceUrl: '',
      images: oldState.images.filter(image => {
        image.dispose(); // calls URL.revokeObjectURL()
        return false; // filter out all
      }),
    }));
  }, []);

  const handleImagesLoaded = useCallback((newImages: ImageFileData[]) => {
    setImagesState(oldState => ({
      ...oldState,
      images: [
        ...oldState.images,
        ...newImages.map((image): ThumbnailState => ({
          ...image,
          id: `${idCounterRef.current++}`,
          active: false,
          board: 0,
          purity: 0,
          sourceUrl: '',
        })),
      ],
    }));
  }, []);

  const handlePurityChange = useCallback((newPurity: number) => {
    setImagesState(oldState => ({
      ...oldState,
      purity: newPurity,
      images: oldState.images.map(image => ({
        ...image,
        purity: image.active ? newPurity : image.purity,
      })),
    }));
  }, []);

  const handleBoardChange = useCallback((newBoard: number) => {
    setImagesState(oldState => ({
      ...oldState,
      board: newBoard,
      images: oldState.images.map(image => ({
        ...image,
        board: image.active ? newBoard : image.board,
      })),
    }));
  }, []);

  const handleSourceUrlChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newSourceUrl = event.currentTarget.value;
    setImagesState(oldState => ({
      ...oldState,
      sourceUrl: newSourceUrl,
      images: oldState.images.map(image => ({
        ...image,
        sourceUrl: image.active ? newSourceUrl : image.sourceUrl,
      })),
    }));
  }, []);

  const handleUploadClick = useCallback(() => {
    if (!canUpload) {
      setNotAllSetModalShown(true);
      return;
    }
  }, [canUpload]);

  const { open: openFileDialog } = useImageFileDialog({
    onChange: handleImagesLoaded,
  });

  return (
    <div className={styles.host}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faUpload} />
        </div>
        <h1 className={styles.title}>Upload wallpapers</h1>
        <div className={styles.attention}>
          {'Please read the '}
          <Link href="/help/rules">
            <a>rules</a>
          </Link>
          {' before '}
          {state !== 'edit' && (
            <Button xsmall dark iconPrepend={faFolderOpen} onClick={openFileDialog}>
              picking
            </Button>
          )}
          {state === 'edit' ? ' uploading' : ''}
          {' wallpapers.'}
        </div>
      </div>
      <div className={styles.body}>
        {images.length > 0 && (
          <aside className={styles.sidebar}>
            <div className={styles.group}  id="purity-section">
              <div className={styles.label}>Purity</div>
              <PurityFilter
                value={purity}
                onChange={handlePurityChange}
                disabled={activeImageCount === 0}
                single
              />
            </div>
            <div className={styles.group} id="board-section">
              <div className={styles.label}>Board</div>
              <BoardFilter
                value={board}
                onChange={handleBoardChange}
                disabled={activeImageCount === 0}
                single
              />
            </div>
            <div className={styles.group} id="tags-section">
              <div className={styles.label}>Tags</div>
            </div>
            <div className={styles.group}>
              <div className={styles.label}>Source</div>
              <TextField
                placeholder="Source URL..."
                name="sourceUrl"
                value={sourceUrl}
                onChange={handleSourceUrlChange}
              />
            </div>
          </aside>
        )}
        <div className={styles.content}>
          <DropZone
            disabled={state !== 'pick'}
            onImagesLoaded={handleImagesLoaded}
            onClick={openFileDialog}
          >
            {images.length > 0 && (
              <ThumbnailGrid>
                {images.map(({ id, width, height, file, url, active, purity, board, progress }) => (
                  <DropzoneThumbnail
                    id={id}
                    key={file.name}
                    fileName={file.name}
                    fileSize={file.size}
                    width={width}
                    height={height}
                    url={url}
                    active={active}
                    purity={purity}
                    board={board}
                    progress={progress}
                    onClick={handleThumbnailClick}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </ThumbnailGrid>
            )}
          </DropZone>
          <footer className={styles.footer}>
            {state !== 'edit' && (
              <>
                <Button
                  className={styles.btnClear}
                  iconPrepend={faTrash}
                  rounded
                  dark
                  onClick={clearImages}
                  disabled={images.length === 0}
                >
                  Clear
                </Button>
                <Button
                  className={styles.btnUpload}
                  iconPrepend={faUpload}
                  rounded
                  disabled={images.length === 0}
                  onClick={handleUploadClick}
                >
                  Upload
                </Button>
              </>
            )}
            {state === 'edit' && (
              <>
                <Button
                  className={styles.btnCancel}
                  iconPrepend={faTimes}
                  rounded
                >
                  Cancel
                </Button>
                <Button
                  className={styles.btnFinish}
                  iconPrepend={faCheck}
                >
                  Finish
                </Button>
              </>
            )}
            {state === 'error' && (
              <div className={styles.continue} style={{ display: 'none' }}>
                Some uploads failed. Oh, nevermind.
                <Button
                  className={styles.btnContinue}
                  iconAppend={faChevronCircleRight}
                  rounded
                >
                  Continue!
                </Button>
              </div>
            )}
          </footer>
        </div>
      </div>
      <NotAllSetModal shown={notAllSetModalShown} onClose={closeNotAllSetModal} />
    </div>
  );
};

UploadPane.displayName = 'UploadPane';

export default React.memo(UploadPane);
