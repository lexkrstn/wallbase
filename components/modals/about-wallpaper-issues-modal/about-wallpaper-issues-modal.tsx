import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import getConfig from 'next/config';
import Alert from '@/components/alert';
import Button from '@/components/buttons/button';
import React, { FC } from 'react';
import Modal, { ModalBody, ModalFooter } from '../modal';
import styles from './about-wallpaper-issues-modal.module.scss';
import Link from 'next/link';

interface Props {
  shown: boolean;
  onClose: () => void;
}

const AboutWallpaperIssuesModal: FC<Props> = ({ shown, onClose }) => {
  const contactEmail = getConfig().publicRuntimeConfig.contactEmail;
  return (
    <Modal
      title="Found some issue?"
      shown={shown}
      onClose={onClose}
      small
    >
      <ModalBody>
        <Alert info icon={faExclamationCircle}>
          Please note that you&apos;re not logged in to submit a report.
        </Alert>
        <p className={styles.para}>
          If you want us to know that the wallpaper violates
          {' '}
          <Link href="/help/faq#upload">
            <a target="_blank">our rules</a>
          </Link>
          {' '}
          , simply log in under your account on this website, click the
          &quot;delete&quot; button on the thumbnail again, and you&apos;ll
          be able to send us a report. This can also be achieved by clicking
          the &quot;report&quot; button on the dedicated wallpaper page.
        </p>
        <p className={styles.para}>
          In case you&apos;re the author or copyright owner and want us to
          delete the wallpaper from the site, feel free to contact us via email
          {' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          At your request, we can also blacklist all your works so that
          they won&apos;t be allowed to be uploded in the future, or move them
          to your account on this website.
        </p>
      </ModalBody>
      <ModalFooter spaceAround>
        <Button onClick={onClose}>
          Got it!
        </Button>
      </ModalFooter>
    </Modal>
  );
};

AboutWallpaperIssuesModal.displayName = 'AboutWallpaperIssuesModal';

export default React.memo(AboutWallpaperIssuesModal);
