import React, { ReactElement, ReactNode } from 'react';
import Footer from './footer';
import Userbar from './userbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): ReactElement {
  return (
    <>
      <Userbar />
      {children}
      <Footer />
    </>
  );
}