import { NextPage } from 'next';
import React, { useEffect } from 'react';
import Router from 'next/router';
import RegularLayout from '../components/layouts/regular-layout';
import UploadPane from '../components/upload-pane';
import User from '../interfaces/user';
import styles from './upload.module.scss';

interface UploadProps {
  user: User | null;
  userLoading: boolean;
}

const Upload: NextPage<UploadProps> = ({ user, userLoading }) => {
  useEffect(() => {
    if (!user && !userLoading) {
      Router.push('/');
    }
  }, [user, userLoading]);
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
