import React, { FC, useState } from 'react';
import Tabs from '../../tabs';
import Modal, { ModalBody } from '../modal';
import SignInForm from './signin-form';
import styles from './auth-modal.module.scss';
import SignUpForm from './signup-form';

const TITLES = ['Sign in', 'Register new user'];
const TABS = ['Log in', 'Sign up'];

interface AuthModalProps {
  shown: boolean;
  onClose?: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ shown, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Modal
      title={TITLES[tabIndex]}
      shown={shown}
      onClose={onClose}
      xsmall
    >
      <ModalBody>
        <Tabs active={tabIndex} labels={TABS} onChange={setTabIndex} />
        <div className={styles.tabContent}>
          {tabIndex === 0 && (
            <SignInForm onLoggedIn={onClose} onCancel={onClose} />
          )}
          {tabIndex === 1 && (
            <SignUpForm onSignedUp={onClose} onCancel={onClose} />
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

AuthModal.displayName = 'AuthModal';

export default React.memo(AuthModal);
