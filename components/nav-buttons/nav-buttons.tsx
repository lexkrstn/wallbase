import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRandom, faBarChart, faComments, faInfoCircle, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import React, { ReactElement } from 'react';
import styles from './nav-buttons.module.scss';
import Link from 'next/link';

export default function NavButtons(): ReactElement {
  return (
    <ul className={styles.navbuttons}>
      <li>
        <Link href="/random" title="Random Wallpapers">
          <FontAwesomeIcon icon={faRandom} className={styles.iconRandom} />
          Random
        </Link>
      </li>
      <li>
        <Link href="/top" title="Most popular wallpapers">
          <FontAwesomeIcon icon={faBarChart} className={styles.iconTop} />
          Global Toplist
        </Link>
      </li>
      <li>
        <Link href="/comments" title="Comments about this website">
          <FontAwesomeIcon icon={faComments} className={styles.iconComments} />
          Comments
        </Link>
      </li>
      <li>
        <Link href="/help/faq" title="Information about Wallbase">
          <FontAwesomeIcon icon={faInfoCircle} className={styles.iconAbout} />
          About...
          <div className={styles.arrow}>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </Link>
        <ul className={styles.dropdown}>
          <li><Link href="/help/faq">F.A.Q.</Link></li>
          <li><Link href="/help/terms">Terms of service</Link></li>
          <li><Link href="/help/rules">Rules</Link></li>
        </ul>
      </li>
    </ul>
  );
}
