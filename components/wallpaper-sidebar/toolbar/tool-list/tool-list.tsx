import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright, faStar } from '@fortawesome/free-regular-svg-icons';
import React, { FC } from 'react';
import { thousands } from '@/lib/helpers/formatters';
import styles from './tool-list.module.scss';

interface Props {
  favCount: number;
  authorName: string;
  authorUrl: string;
  onChangeInfoClick: () => void;
}

const ToolList: FC<Props> = ({ favCount, authorName, authorUrl, onChangeInfoClick }) => {
  return (
    <ul className={styles.list}>
      <li className={styles.item}>
        <div className={styles.favsIcon}>
          <FontAwesomeIcon icon={faStar} />
        </div>
        <div className={styles.title}>
          {'This wallpaper was added to favorites by '}
          <span className={styles.highlight}>
            {thousands(favCount)}
          </span>
          {' users.'}
        </div>
        <a
          className={styles.favBtn}
          title="(Un)Make favourite"
          href="#"
        />
      </li>
      <li className={styles.item}>
        <div className={styles.copyIcon}>
          <FontAwesomeIcon icon={faCopyright} />
        </div>
        <div className={styles.title}>Source / copyright info</div>
        <div className={styles.subtitle}>
          <button type="button" className={styles.btnAdd} onClick={onChangeInfoClick}>
            {authorName ? 'Change' : 'Add info'}
          </button>
          {!!authorUrl && (
            <a
              className={styles.link}
              href={authorUrl}
              rel="nofollow noreferrer"
              target="_blank"
            >
              <span className={styles.authorName}>
                {authorName ? authorName : 'Unknown'}
              </span>
            </a>
          )}
          {!authorUrl && (
            <span className={styles.authorName}>
              {authorName ? authorName : 'Unknown'}
            </span>
          )}
        </div>
      </li>
    </ul>
  );
};

ToolList.displayName = 'ToolList';

export default ToolList;
