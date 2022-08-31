import React, { FC, ReactNode } from 'react';
import { useSession } from '@/lib/hooks/use-session';
import Footer from './elements/footer';
import Userbar from './elements/userbar';

interface IndexLayoutProps {
  children: ReactNode;
}

const IndexLayout: FC<IndexLayoutProps> = ({ children }) => {
  const { user, loading: userLoading } = useSession();
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
