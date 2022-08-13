import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import getConfig from 'next/config';
import React, { FC } from 'react';
import styles from './footer.module.scss';
import Link from 'next/link';

const Footer: FC = () => {
  const {
    siteName, facebookUrl, twitterUrl, ircUrl, ircChannel, copyYear,
  } = getConfig().publicRuntimeConfig;
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.l1}>
          All submitted content remains copyright its original copyright holder.
          Images are for personal, non commercial use.
        </div>
        <div className={styles.l2}>
          <span className={styles.copy}>&copy; {siteName}, {copyYear}</span>
          <Link href="/help/faq">
            <a>FAQ</a>
          </Link>
          <Link href="/help/terms">
            <a>Terms of Service</a>
          </Link>
          <Link href="/help/privacy">
            <a>Privacy Policy</a>
          </Link>
          <Link href="/help/about">
            <a>About...</a>
          </Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <ul className={styles.menu}>
          <li>
            <Link href="/upload">
              <a>Upload</a>
            </Link>
          </li>
          <li>
            <Link href="/tags">
              <a>Popular tags</a>
            </Link>
          </li>
          <li>
            <Link href="/random">
              <a>Random</a>
            </Link>
          </li>
          <li>
            <Link href="/top">
              <a>Toplist</a>
            </Link>
          </li>
          <li>
            <Link href="/users">
              <a>Users</a>
            </Link>
          </li>
          <li>
            <Link href="/comments">
              <a>Comments</a>
            </Link>
          </li>
        </ul>
        <div className={styles.social}>
          <a
            className={styles.facebook}
            href={facebookUrl}
            target="_blank"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a
            className={styles.twitter}
            href={twitterUrl}
            target="_blank"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            className={styles.irc}
            href={ircUrl}
            target="_blank"
            title="click to open webirc"
          >
            <div>
              <div className={styles.irc_chan}>#{ircChannel}</div>
              <div className={styles.irc_addr}>irc.rizon.net</div>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default React.memo(Footer);
