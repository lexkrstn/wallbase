import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { FC } from 'react';
import Link from 'next/link';
import { thousands } from '@/lib/helpers/formatters';
import { Purity } from '@/lib/constants';
import Tag from '@/entities/tag';
import styles from './popular-tag-item.module.scss';

const PURITY_TO_CLASS = {
  [Purity.SFW]: styles.sfw,
  [Purity.SKETCHY]: styles.sketchy,
  [Purity.NSFW]: styles.nsfw,
};

interface PopularTagItemProps {
  tag: Tag;
}

const PopularTagItem: FC<PopularTagItemProps> = ({ tag }) => (
  <li className={styles.item}>
    <span className={styles.links}>
      <Link
        href={`/wallpapers?tag=${encodeURIComponent('"' + tag.name + '"')}`}
        className={`${styles.search} ${PURITY_TO_CLASS[tag.purity]}`}
      >
        <FontAwesomeIcon icon={faSearch} />
        {tag.name}
      </Link>
      <Link
        href={`/tags?cat=${tag.categoryId}`}
        className={styles.category}
      >
        {tag.category!.name}
      </Link>
    </span>
    <span className={styles.stats}>{thousands(tag.wallpaperCount)}</span>
  </li>
);

PopularTagItem.displayName = 'PopularTagItem';

export default PopularTagItem;
