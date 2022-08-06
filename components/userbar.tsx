import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import styles from './userbar.module.scss';

interface User {
  login: string;
}

interface UserbarSSProps {
  user?: User;
}

type UserbarProps = UserbarSSProps & {
  docked: boolean;
};

export default function Userbar({ docked, user }: UserbarProps): ReactElement {
  const userName = user ? user.login : 'Anonymous';
  return (
    <div className={styles.userbar}>
      <div className={styles.commands}>
        <span className={styles.greating}>Hey {userName}!</span>
        {!user && (
          <>
            <a className={styles.link} href="javascript:;">Login</a>
            <a className={styles.link} href="javascript:;">Register</a>
          </>
        )}
        {!!user && (
          <>
            <a className={styles.link} href="javascript:;">Logout</a>
            <span className={styles.loading}></span>
          </>
        )}
      </div>
    </div>
  );
}

Userbar.defaultProps = {
  docked: false,
};

export const getServerSideProps: GetServerSideProps<UserbarSSProps> = async () => ({
  props: {
    user: {
      login: 'User',
    },
  },
});
