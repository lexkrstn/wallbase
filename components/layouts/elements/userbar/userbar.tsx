import React, { FC, useCallback, useState } from 'react';
import { faHandSpock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { countryCodeEmoji } from 'country-code-emoji';
import styles from './userbar.module.scss';
import User from "../../../../interfaces/user";
import AuthModal from '../../../modals/auth-modal/auth-modal';
import { useLogout } from '../../../../lib/hooks/use-logout';

interface UserbarProps {
  user: User | null;
  userLoading: boolean;
  wide?: boolean;
  docked?: boolean;
};

const Userbar: FC<UserbarProps> = ({ wide, user, userLoading, docked }) => {
  const userName = user ? user.login : 'Anonymous';
  const classes = [styles.userbar];
  if (docked) classes.push(styles.docked);
  const containerClasses = [styles.container];
  if (wide) containerClasses.push(styles.wide);
  if (docked) containerClasses.push(styles.docked);

  const { logout, loading: userLoggingOut } = useLogout();

  const [authModalShown, setAuthModalShown] = useState(false);
  const closeAuthModal = useCallback(() => setAuthModalShown(false), []);
  const openAuthModal = useCallback(() => setAuthModalShown(true), []);

  return (
    <div className={classes.join(' ')}>
      <div className={containerClasses.join(' ')}>
        <div className={styles.commands}>
          <span className={styles.greeting}>
            <span className={styles.greetingIcon}>
              <FontAwesomeIcon icon={faHandSpock} />
            </span>
            Hey {user?.cc2 ? countryCodeEmoji(user.cc2) : ''} {userName}!
          </span>
          {!user && (
            <button type="button" className={styles.link} onClick={openAuthModal}>Login</button>
          )}
          {!!user && (
            <button type="button" className={styles.link} onClick={logout}>Logout</button>
          )}
          {(userLoading || userLoggingOut) && (
            <span className={styles.loading}>
              <FontAwesomeIcon className={styles.spinner} icon={faSpinner} />
            </span>
          )}
        </div>
      </div>
      <AuthModal shown={authModalShown} onClose={closeAuthModal} />
    </div>
  );
};

Userbar.displayName = 'Userbar';

Userbar.defaultProps = {
  wide: false,
};

export default React.memo(Userbar);
