import React, { FC } from 'react';
import Button from '../buttons/button';
import Modal, { ModalBody, ModalFooter } from '../modals/modal';

interface NotAllSetModalProps {
  shown: boolean;
  onClose: () => void;
}

const NotAllSetModal: FC<NotAllSetModalProps> = ({ shown, onClose }) => (
  <Modal shown={shown} onClose={onClose} title="Cannot start uploading yet" small>
    <ModalBody>
      You must specify board, purity and add at least one tag to all wallpapers.
    </ModalBody>
    <ModalFooter center>
      <Button onClick={onClose}>Got it</Button>
    </ModalFooter>
  </Modal>
);

NotAllSetModal.displayName = 'NotAllSetModal';

export default React.memo(NotAllSetModal);
