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
        <Link href="/random">
          <a title="Random Wallpapers">
            <FontAwesomeIcon icon={faRandom} className={styles.iconRandom} />
            Random
          </a>
        </Link>
      </li>
      <li>
        <Link href="/top">
          <a title="Most popular wallpapers">
            <FontAwesomeIcon icon={faBarChart} className={styles.iconTop} />
            Global Toplist
          </a>
        </Link>
      </li>
      <li>
        <Link href="/comments">
          <a title="Comments about this website">
            <FontAwesomeIcon icon={faComments} className={styles.iconComments} />
            Comments
          </a>
        </Link>
      </li>
      <li>
        <Link href="/help/faq">
          <a title="Information about Wallbase">
            <FontAwesomeIcon icon={faInfoCircle} className={styles.iconAbout} />
            About...
            <div className={styles.arrow}>
            <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </a>
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
