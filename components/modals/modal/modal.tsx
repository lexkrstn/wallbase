import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './modal.module.scss';

interface ModalProps {
  shown: boolean;
  children: ReactNode;
  title?: string;
  large?: boolean;
  small?: boolean;
  xsmall?: boolean;
  onClose?: () => void;
}

const Modal: FC<ModalProps> = ({
  children, shown, title, onClose, small, xsmall, large,
}) => {
  const [presented, setPresented] = useState(false);
  const closeClickHandler = useCallback(() => onClose && onClose(), []);

  const modalClasses = [styles.modal];
  if (shown) modalClasses.push(styles.shown);
  const dialogClasses = [styles.dialog];
  if (large) dialogClasses.push(styles.large);
  if (small) dialogClasses.push(styles.small);
  if (xsmall) dialogClasses.push(styles.xsmall);

  const modalJsx = (
    <div className={modalClasses.join(' ')}>
      <div className={dialogClasses.join(' ')}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.close} onClick={closeClickHandler}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  useEffect(() => {
    if (!presented) {
      setPresented(true);
    }
    document.body.classList.toggle(styles.bodyClass, shown);
    return () => {
      document.body.classList.remove(styles.bodyClass);
    };
  }, [presented, shown]);

  return (
    <>
      {presented && shown && createPortal(modalJsx, document.body)}
    </>
  );
};

Modal.displayName = 'Modal';

export default React.memo(Modal);
