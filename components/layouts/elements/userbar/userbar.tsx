import React, { FC } from 'react';
import { faHandSpock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import styles from './userbar.module.scss';
import User from "../../../../interfaces/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UserbarProps {
  user?: User;
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
          <span className={styles.greeting}>
            <span className={styles.greetingIcon}>
              <FontAwesomeIcon icon={faHandSpock} />
            </span>
            Hey {userName}!
          </span>
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

Userbar.displayName = 'Userbar';

Userbar.defaultProps = {
  wide: false,
};

export default React.memo(Userbar);
