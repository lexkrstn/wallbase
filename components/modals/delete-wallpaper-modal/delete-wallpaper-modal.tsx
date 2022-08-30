import { faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import React, { FC } from 'react';
import Modal, { ModalBody, ModalFooter } from '@/components/modals/modal';
import Wallpaper, { getThumbnailUrl } from '@/entities/wallpaper';
import Thumbnail from '@/components/thumbnail';
import Button from '@/components/buttons/button';
import Alert from '@/components/alert';
import styles from './delete-wallpaper-modal.module.scss';

interface DeleteWallpaperModalProps {
  shown: boolean;
  wallpaper?: Wallpaper;
  busy?: boolean;
  error?: string,
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteWallpaperModal: FC<DeleteWallpaperModalProps> = ({
  busy, shown, onClose, wallpaper, onConfirm, error,
}) => {
  return (
    <Modal
      title="Removal confirmation"
      shown={shown}
      nonClosable={busy}
      onClose={onClose}
      xsmall
    >
      <ModalBody className={styles.body}>
        {!!error && <Alert icon={faExclamationCircle}>{error}</Alert>}
        <p className={styles.para}>
          Are you sure you want to delete this?
        </p>
        {!!wallpaper && (
          <Thumbnail
            className={styles.thumbnail}
            id={wallpaper.id}
            width={wallpaper.width}
            height={wallpaper.height}
            url={getThumbnailUrl(wallpaper.id, wallpaper.mimetype)}
          />
        )}
      </ModalBody>
      <ModalFooter spaceAround>
        <Button
          iconPrepend={faTrashAlt}
          loading={busy}
          disabled={busy}
          onClick={onConfirm}
        >
          Delete it!
        </Button>
        <Button
          iconPrepend={faTimes}
          dark onClick={onClose}
          disabled={busy}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

DeleteWallpaperModal.displayName = 'DeleteWallpaperModal';

export default React.memo(DeleteWallpaperModal);
