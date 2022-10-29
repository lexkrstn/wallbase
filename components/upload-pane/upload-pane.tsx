import {
  faUpload, faFolderOpen, faTrash, faChevronRight, faExclamationCircle, faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { ChangeEvent, FC, useCallback, useReducer, useState } from 'react';
import { ImageFileData } from '@/lib/helpers/image';
import Button from '../buttons/button';
import { TextField } from '../form';
import BoardFilter from '../triple-filters/board-filter';
import PurityFilter from '../triple-filters/purity-filter';
import ThumbnailGrid from '../thumbnail/grid';
import DropZone from '../dropzone';
import Thumbnail from '../thumbnail';
import styles from './upload-pane.module.scss';
import { useImageFileDialog } from '@/lib/hooks/use-image-file-dialog';
import NotAllSetModal from './not-all-set-modal';
import TagInput from '../form/tag-input';
import Tag from '@/entities/tag';
import { UploadError, useUploads } from '@/lib/hooks/use-uploads';
import Alert from '../alert';
import reducer, { initialState } from './reducer';

interface ApiRequestBody {
  purity: number;
  board: number;
  sourceUrl: string;
  authorName: string;
  authorUrl: string;
  tags: string[];
}

interface UploadPaneProps {
  onUploaded?: (errors: UploadError[], successes: File[]) => void;
}

const UploadPane: FC<UploadPaneProps> = ({ onUploaded }) => {
  const [notAllSetModalShown, setNotAllSetModalShown] = useState(false);
  const [{ images, board, purity, sourceUrl, tags }, dispatch] = useReducer(reducer, initialState);
  const imagesHaveBoard = images.every(image => image.board !== 0);
  const imagesHavePurity = images.every(image => image.purity !== 0);
  const imagesHaveTags = images.every(image => image.tags.length > 0);
  const canUpload = images.length > 0 && imagesHaveBoard && imagesHavePurity && imagesHaveTags;
  const activeImageCount = images.reduce((count, image) => count + (image.active ? 1 : 0), 0);

  const {
    uploading, errors, upload, reset: resetErrors, uploaded,
  } = useUploads<ApiRequestBody>('/api/wallpapers', {
    useCookieToken: true,
    onStarted: useCallback((file: File) => {
      dispatch({ type: 'set image loading', file });
    }, []),
    onError: useCallback((file: File, error: Error | string) => {
      dispatch({ type: 'fail image loading', file, error });
    }, []),
    onSuccess: useCallback((file: File) => {
      dispatch({ type: 'succeed image loading', file });
    }, []),
    onComplete: onUploaded,
  });

  const inputDisabled = activeImageCount === 0 || uploading || errors.length > 0;

  const resetPaneState = useCallback(() => {
    resetErrors();
    dispatch({ type: 'reset' });
  }, []);

  const closeNotAllSetModal = useCallback(() => setNotAllSetModalShown(false), []);

  const toggleImageActive = useCallback((id: string) => {
    dispatch({ type: 'toggle image active', id });
  }, []);

  const deleteImage = useCallback((id: string) => {
    dispatch({ type: 'delete image', id });
  }, []);

  const addImages = useCallback((images: ImageFileData[]) => {
    dispatch({ type: 'add images', images });
  }, []);

  const setPurity = useCallback((purity: number) => {
    dispatch({ type: 'set purity', purity });
  }, []);

  const scrollImagePurity = useCallback((id: string) => {
    dispatch({ type: 'scroll image purity', id });
  }, []);

  const setBoard = useCallback((board: number) => {
    dispatch({ type: 'set board', board });
  }, []);

  const handleSourceUrlChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'set source url', sourceUrl: event.currentTarget.value });
  }, []);

  const setTags = useCallback((tags: Tag[]) => {
    dispatch({ type: 'set tags', tags });
  }, []);

  const tryStartUploading = useCallback(() => {
    if (!canUpload) {
      setNotAllSetModalShown(true);
      return;
    }
    dispatch({ type: 'unselect images' });
    upload(images.map(image => ({
      file: image.file,
      body: {
        purity: image.purity,
        board: image.board,
        sourceUrl: image.sourceUrl,
        tags: image.tags.map(tag => tag.id),
        authorName: image.authorName,
        authorUrl: image.authorUrl,
      },
    })));
  }, [canUpload, images]);

  const { open: openFileDialog } = useImageFileDialog({ onChange: addImages });

  return (
    <div className={styles.host}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faUpload} />
        </div>
        <h1 className={styles.title}>Upload wallpapers</h1>
        <div className={styles.attention}>
          {'Please read the '}
          <Link href="/help/rules">rules</Link>
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
                onChange={setPurity}
                disabled={inputDisabled}
                single
              />
            </div>
            <div className={styles.group}>
              <div className={styles.label}>Board</div>
              <BoardFilter
                value={board}
                onChange={setBoard}
                disabled={inputDisabled}
                single
              />
            </div>
            <div className={styles.group}>
              <div className={styles.label}>Tags</div>
              <TagInput
                value={tags}
                onChange={setTags}
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
          {uploaded && errors.length === 0 && (
            <Alert icon={faCheckCircle} className={styles.alert} success>
              Uploaded all the wallpapers!
            </Alert>
          )}
          <DropZone
            className={styles.dropzone}
            disabled={uploading || errors.length > 0}
            onImagesLoaded={addImages}
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
                    onClick={toggleImageActive}
                    onDeleteClick={deleteImage}
                    onPurityClick={scrollImagePurity}
                    disabled={uploading || uploaded}
                  />
                ))}
              </ThumbnailGrid>
            )}
          </DropZone>
          <footer className={styles.footer}>
            {!uploaded && (
              <>
                <Button
                  className={styles.btnClear}
                  iconPrepend={faTrash}
                  rounded
                  dark
                  onClick={resetPaneState}
                  disabled={images.length === 0 || uploading || errors.length > 0}
                >
                  Clear
                </Button>
                <Button
                  className={styles.btnUpload}
                  iconPrepend={faUpload}
                  rounded
                  loading={uploading}
                  onClick={tryStartUploading}
                  disabled={images.length === 0}
                >
                  Upload
                </Button>
              </>
            )}
            {uploaded && (
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
