import React, { FC, ReactNode } from 'react';
import User from '../../interfaces/user';
import Footer from './elements/footer';
import Userbar from './elements/userbar';
import styles from './regular-layout.module.scss';

interface RegularLayoutProps {
  children: ReactNode;
  user: User | null;
  userLoading: boolean;
}

const RegularLayout: FC<RegularLayoutProps> = ({ children, user, userLoading }) => {
  return (
    <div className={styles.host}>
      <Userbar user={user} userLoading={userLoading} wide />
      <main className={styles.main + ' ' + styles.center}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

RegularLayout.displayName = 'RegularLayout';

export default RegularLayout;
