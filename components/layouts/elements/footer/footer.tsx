import React, { FC } from 'react';
import styles from './footer.module.scss';

const Footer: FC = () => {
  const siteName = 'Wallbase';
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.l1}>
          All submitted content remains copyright its original copyright holder. Images are for personal, non commercial use.
        </div>
        <div className={styles.l2}>
          <span className={styles.copy}>&copy; {siteName}, 2015</span>
          <a href="#!/help/faq">FAQ</a>
          <a href="#!/help/terms">Terms of Service</a>
          <a href="#!/help/privacy">Privacy Policy</a>
          <a href="#!/help/about">About...</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <ul className={styles.menu}>
          <li><a href="#!/upload">Upload</a></li>
          <li><a href="#!/tags">Popular tags</a></li>
          <li><a href="#!/random">Random</a></li>
          <li><a href="#!/top">Toplist</a></li>
          <li><a href="#!/users">Users</a></li>
          <li><a href="#!/comments">Comments</a></li>
        </ul>
        <div className={styles.social}>
          <a className={styles.facebook} href="http://facebook.com/wallbase2" target="_blank"></a>
          <a className={styles.twitter} href="http://twitter.com/wallbase2" target="_blank"></a>
          <a className={styles.googleplus} href="https://www.google.com/+wallbase2" target="_blank"></a>
          <a className={styles.irc} href="https://qchat.rizon.net/?channels=#wallbase2" target="_blank" title="click to open webirc">
            <div>
              <div className={styles.irc_chan}>#wallbase2</div>
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
