import { NextPage } from 'next';
import React, { useEffect } from 'react';
import Router from 'next/router';
import RegularLayout from '@/components/layouts/regular-layout';
import UploadPane from '@/components/upload-pane';
import { useSession } from '@/lib/hooks/use-session';
import styles from './upload.module.scss';


const Upload: NextPage = () => {
  const { user, loading: userLoading } = useSession({ redirectTo: '/' });

  useEffect(() => {
    if (!user && !userLoading) {
      Router.push('/');
    }
  }, [user, userLoading]);

  return (
    <RegularLayout center>
      <div className={styles.host}>
        <UploadPane />
      </div>
    </RegularLayout>
  );
};

Upload.displayName = 'Upload';

export default Upload;
