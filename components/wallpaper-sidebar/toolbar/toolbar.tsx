import React, { FC } from 'react';
import Wallpaper from '@/entities/wallpaper';
import styles from './toolbar.module.scss';
import Link from 'next/link';
import User from '@/entities/user';
import countryCodeEmoji from 'country-code-emoji';
import { formatTimeAgo } from '@/lib/helpers/formatters';
import TagInput from '@/components/form/tag-input';
import ToolList from './tool-list';

interface Props {
  wallpaper: Wallpaper;
  uploader: User;
  nextLink: string;
  prevLink: string;
}

const Toolbar: FC<Props> = ({ wallpaper, uploader, nextLink, prevLink }) => {
  return (
    <div className={styles.host}>

      <div className={styles.upload}>
        <div className={styles.title}>Uploaded by</div>
        <div className={styles.username}>
          <Link href={`/users/${wallpaper.uploaderId}`}>
            {!uploader.cc2 && '🇺🇳'}
            {!!uploader.cc2 && countryCodeEmoji(uploader.cc2)}
            {` ${uploader.login}`}
          </Link>
        </div>
        <div className={styles.date}>
          {formatTimeAgo(wallpaper.createdAt, 'long')}
        </div>
      </div>

      <div className={styles.arrows}>
        <a className={styles.prevArrow} href={prevLink}>
          <span className={styles.arrowLabel}>PREV</span>
        </a>
        <div className={styles.searchType}>search</div>
        <a className={styles.nextArrow} href={nextLink}>
          <span className={styles.arrowLabel}>NEXT</span>
        </a>
      </div>

      <div className={styles.tags}>
        <div className={styles.title}>Tags</div>
        <TagInput value={wallpaper.tags} />
      </div>

      <div className={styles.toolList}>
        <ToolList
          favCount={wallpaper.favCount}
          authorName={wallpaper.authorName}
          authorUrl={wallpaper.authorUrl}
          onChangeInfoClick={() => {}}
        />
      </div>
    </div>
  );
};

Toolbar.displayName = 'Toolbar';

export default Toolbar;
