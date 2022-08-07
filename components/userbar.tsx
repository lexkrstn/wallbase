import { GetServerSideProps } from "next";
import React, { FC } from "react";
import Link from 'next/link';
import styles from './userbar.module.scss';

interface User {
  login: string;
}

interface UserbarSSProps {
  user?: User;
}

type UserbarProps = UserbarSSProps & {
  wide?: boolean;
};

const Userbar: FC<UserbarProps> = ({ wide, user }) => {
  const userName = user ? user.login : 'Anonymous';
  const containerClasses = [styles.container];
  if (wide) containerClasses.push(styles.wide);
  return (
    <div className={styles.userbar}>
      <div className={containerClasses.join(' ')}>
        <div className={styles.commands}>
          <span className={styles.greating}>Hey {userName}!</span>
          {!user && (
            <>
              <Link href="/signin">
                <a className={styles.link}>Login</a>
              </Link>
              <Link href="/signup">
                <a className={styles.link}>Register</a>
              </Link>
            </>
          )}
          {!!user && (
            <>
              <a className={styles.link} href="#">Logout</a>
              <span className={styles.loading}></span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Userbar.defaultProps = {
  wide: false,
};

export default Userbar;

export const getServerSideProps: GetServerSideProps<UserbarSSProps> = async () => ({
  props: {
    user: {
      login: 'User',
    },
  },
});
