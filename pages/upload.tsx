import {
  faUpload, faFolderOpen, faFloppyDisk, faTrash, faChevronCircleRight,
  faTimes, faCheck, faImage,
} from '@fortawesome/free-solid-svg-icons';
import { NextPage } from 'next';
import React, { useState } from 'react';
import RegularLayout from '../components/layouts/regular-layout';
import UploadPane from '../components/upload-pane';
import { useUser } from '../lib/hooks/useUser';
import styles from './upload.module.scss';

interface UploadProps {

}

const Upload: NextPage<UploadProps> = () => {
  const { user, loading: userLoading } = useUser();
  return (
    <RegularLayout user={user} userLoading={userLoading}>
      <div className={styles.host}>
        <UploadPane />
      </div>
    </RegularLayout>
  );
};

Upload.displayName = 'Upload';

export default React.memo(Upload);
