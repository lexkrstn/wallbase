import {
  faUpload, faFolderOpen, faTrash, faChevronRight, faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { ImageFileData } from '../../lib/helpers/image';
import Button from '../buttons/button';
import { TextField } from '../form';
import BoardFilter from '../triple-filters/board-filter';
import PurityFilter from '../triple-filters/purity-filter';
import ThumbnailGrid from '../thumbnail/grid';
import DropZone from '../dropzone';
import Thumbnail from '../thumbnail';
import styles from './upload-pane.module.scss';
import { useImageFileDialog } from '../../lib/hooks/useImageFileDialog';
import NotAllSetModal from './not-all-set-modal';
import TagInput from '../form/tag-input';
import Tag from '../../interfaces/tag';
import { UploadError, useUploads } from '../../lib/hooks/use-uploads';
import Alert from '../alert';

interface ThumbnailState extends ImageFileData {
  id: string;
  active: boolean;
  purity: number;
  board: number;
  sourceUrl: string;
  authorName: string;
  authorUrl: string;
  tags: Tag[],
  loading?: boolean;
  success?: boolean;
  error?: string;
}

interface ApiPostBody {
  purity: number;
  board: number;
  sourceUrl: string;
  authorName: string;
  authorUrl: string;
  tags: string;
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

function areTagArraysEqual(a: Tag[], b: Tag[]): boolean {
  const idsA = a.map(tag => tag.id).sort();
  const idsB = b.map(tag => tag.id).sort();
  return JSON.stringify(idsA) === JSON.stringify(idsB);
}

function getCommonTagsOfActive(thumbnails: ThumbnailState[]): Tag[] {
  const active = thumbnails.filter(t => t.active);
  if (!active.length) return [];
  const { tags } = active[0];
  return active.every(t => areTagArraysEqual(t.tags, tags)) ? tags : [];
}

function getNextPurity(purity: number) {
  return (purity === 0 || purity === 4) ? 1 : purity << 1;
}

interface UploadPaneProps {
  onUploaded?: (errors: UploadError[], successes: File[]) => void;
}

const UploadPane: FC<UploadPaneProps> = ({ onUploaded }) => {
  const idCounterRef = useRef(0);
  const [notAllSetModalShown, setNotAllSetModalShown] = useState(false);
  const [multiselect, setMultiselect] = useState(true);
  const [{ images, board, purity, sourceUrl, tags }, setImagesState] = useState({
    images: [] as ThumbnailState[],
    board: 0,
    purity: 0,
    sourceUrl: '',
    tags: [] as Tag[],
  });
  const imagesHaveBoard = images.every(image => image.board !== 0);
  const imagesHavePurity = images.every(image => image.purity !== 0);
  const imagesHaveTags = images.every(image => image.tags.length > 0);
  const canUpload = images.length > 0 && imagesHaveBoard && imagesHavePurity && imagesHaveTags;
  const activeImageCount = images.reduce((count, image) => count + (image.active ? 1 : 0), 0);

  const resetPaneState = useCallback(() => {
    resetErrors();
    setImagesState({
      images: [],
      purity: 0,
      board: 0,
      tags: [],
      sourceUrl: '',
    });
  }, []);

  const {
    uploading, errors, upload, reset: resetErrors,
  } = useUploads<ApiPostBody>('/api/wallpapers', {
    useCookieToken: true,
    onStarted: useCallback((file: File) => {
      setImagesState(state => ({
        ...state,
        images: state.images.map(image => ({
          ...image,
          loading: image.file === file ? true : image.loading,
        })),
      }));
    }, []),
    onError: useCallback((file: File, error: Error | string) => {
      setImagesState(state => ({
        ...state,
        images: state.images.map(image => ({
          ...image,
          loading: false,
          error: image.file === file ? (error as Error).message || error as string : image.error,
        })),
      }));
    }, []),
    onSuccess: useCallback((file: File) => {
      setImagesState(state => ({
        ...state,
        images: state.images.map(image => ({
          ...image,
          loading: false,
          success: image.file === file ? true : image.success,
        })),
      }));
    }, []),
    onComplete: onUploaded,
  });

  const inputDisabled = activeImageCount === 0 || uploading || errors.length > 0;

  const closeNotAllSetModal = useCallback(() => setNotAllSetModalShown(false), []);

  const handleThumbnailClick = useCallback((id: string) => {
    setImagesState(oldState => {
      const newImages = oldState.images.map(image => ({
        ...image,
        active: multiselect
          ? (image.id === id ? !image.active : image.active)
          : (image.id === id ? !image.active : false),
      }));
      return {
        images: newImages,
        board: getCommonBoardOfActive(newImages),
        purity: getCommonPurityOfActive(newImages),
        sourceUrl: getCommonSourceUrlOfActive(newImages),
        tags: getCommonTagsOfActive(newImages),
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
        tags: getCommonTagsOfActive(newImages),
      };
    });
  }, []);

  const clearImages = useCallback(() => {
    setImagesState(oldState => ({
      purity: 0,
      board: 0,
      sourceUrl: '',
      tags: [],
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
          authorName: '',
          authorUrl: '',
          tags: [],
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

  const handleThumbnailPurityClick = useCallback((id: string) => {
    setImagesState(oldState => {
      const newImages = oldState.images.map(image => ({
        ...image,
        purity: image.id === id ? getNextPurity(image.purity) : image.purity,
      }));
      return {
        ...oldState,
        purity: getCommonPurityOfActive(newImages),
        images: newImages,
      };
    });
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

  const handleTagsChange = useCallback((newTags: Tag[]) => {
    setImagesState(oldState => ({
      ...oldState,
      tags: newTags,
      images: oldState.images.map(image => ({
        ...image,
        tags: image.active ? newTags : image.tags,
      })),
    }));
  }, []);

  const handleUploadClick = useCallback(() => {
    if (!canUpload) {
      setNotAllSetModalShown(true);
      return;
    }
    setImagesState(state => ({
      ...state,
      images: state.images.map(image => ({
        ...image,
        active: false,
      })),
    }));
    upload(images.map(image => ({
      file: image.file,
      body: {
        purity: image.purity,
        board: image.board,
        sourceUrl: image.sourceUrl,
        tags: image.tags.map(tag => tag.id).join(','),
        authorName: image.authorName,
        authorUrl: image.authorUrl,
      },
    })));
  }, [canUpload, images]);

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
          {(!uploading && errors.length === 0) && (
            <Button xsmall dark iconPrepend={faFolderOpen} onClick={openFileDialog}>
              picking
            </Button>
          )}
          {(uploading || errors.length > 0) && ' uploading'}
          {' wallpapers.'}
        </div>
      </div>
      <div className={styles.body}>
        {images.length > 0 && (
          <aside className={styles.sidebar}>
            <div className={styles.group}>
              <div className={styles.label}>Purity</div>
              <PurityFilter
                value={purity}
                onChange={handlePurityChange}
                disabled={inputDisabled}
                single
              />
            </div>
            <div className={styles.group}>
              <div className={styles.label}>Board</div>
              <BoardFilter
                value={board}
                onChange={handleBoardChange}
                disabled={inputDisabled}
                single
              />
            </div>
            <div className={styles.group}>
              <div className={styles.label}>Tags</div>
              <TagInput
                value={tags}
                onChange={handleTagsChange}
                disabled={inputDisabled}
              />
            </div>
            <div className={styles.group}>
              <div className={styles.label}>Source</div>
              <TextField
                placeholder="Source URL..."
                name="sourceUrl"
                value={sourceUrl}
                onChange={handleSourceUrlChange}
                disabled={inputDisabled}
              />
            </div>
          </aside>
        )}
        <div className={styles.content}>
          {errors.length > 0 && (
            <Alert icon={faExclamationCircle} className={styles.alert}>
              Some of your uploads failed!
              {(errors.length < images.length) && (
                <>Still, {images.length - errors.length} of them succeeded!</>
              )}
            </Alert>
          )}
          <DropZone
            className={styles.dropzone}
            disabled={uploading || errors.length > 0}
            onImagesLoaded={handleImagesLoaded}
            onClick={openFileDialog}
          >
            {images.length > 0 && (
              <ThumbnailGrid>
                {images.map(image => (
                  <Thumbnail
                    id={image.id}
                    key={image.file.name}
                    width={image.width}
                    height={image.height}
                    url={image.url}
                    active={image.active}
                    purity={image.purity}
                    board={image.board}
                    tags={image.tags}
                    loading={image.loading}
                    success={image.success}
                    error={image.error}
                    onClick={handleThumbnailClick}
                    onDeleteClick={handleDeleteClick}
                    onPurityClick={handleThumbnailPurityClick}
                    disabled={uploading || errors.length > 0}
                  />
                ))}
              </ThumbnailGrid>
            )}
          </DropZone>
          <footer className={styles.footer}>
            {errors.length === 0 && (
              <>
                <Button
                  className={styles.btnClear}
                  iconPrepend={faTrash}
                  rounded
                  dark
                  onClick={clearImages}
                  disabled={images.length === 0 || uploading || errors.length > 0}
                >
                  Clear
                </Button>
                <Button
                  className={styles.btnUpload}
                  iconPrepend={faUpload}
                  rounded
                  loading={uploading}
                  onClick={handleUploadClick}
                  disabled={images.length === 0}
                >
                  Upload
                </Button>
              </>
            )}
            {errors.length > 0 && (
              <div className={styles.continue}>
                <Button
                  className={styles.btnContinue}
                  iconAppend={faChevronRight}
                  rounded
                  onClick={resetPaneState}
                >
                  Got it!
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
