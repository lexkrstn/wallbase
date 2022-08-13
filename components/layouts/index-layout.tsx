import React, { FC, ReactNode } from 'react';
import User from '../../interfaces/user';
import Footer from './elements/footer';
import Userbar from './elements/userbar';

interface IndexLayoutProps {
  children: ReactNode;
  user: User | null;
  userLoading: boolean;
}

const IndexLayout: FC<IndexLayoutProps> = ({ children, user, userLoading }) => {
  return (
    <>
      <Userbar user={user} userLoading={userLoading} />
      {children}
      <Footer />
    </>
  );
};

IndexLayout.displayName = 'IndexLayout';

export default IndexLayout;
