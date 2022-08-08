import React, { FC, ReactNode } from 'react';
import Footer from './elements/footer';
import Userbar from './elements/userbar';

interface IndexLayoutProps {
  children: ReactNode;
}

const IndexLayout: FC<IndexLayoutProps> = ({ children }) =>  {
  return (
    <>
      <Userbar />
      {children}
      <Footer />
    </>
  );
};

IndexLayout.displayName = 'IndexLayout';

export default IndexLayout;
