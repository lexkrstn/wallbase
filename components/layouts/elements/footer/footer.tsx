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
          <Link href="/help/faq">FAQ</Link>
          <Link href="/help/terms">Terms of Service</Link>
          <Link href="/help/privacy">Privacy Policy</Link>
          <Link href="/help/about">About...</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <ul className={styles.menu}>
          <li>
            <Link href="/upload">Upload</Link>
          </li>
          <li>
            <Link href="/tags">Popular tags</Link>
          </li>
          <li>
            <Link href="/random">Random</Link>
          </li>
          <li>
            <Link href="/top">Toplist</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
          <li>
            <Link href="/comments">Comments</Link>
          </li>
        </ul>
        <div className={styles.social}>
          <a
            className={styles.facebook}
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a
            className={styles.twitter}
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            className={styles.irc}
            href={ircUrl}
            target="_blank"
            rel="noreferrer"
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
