import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { FC } from 'react';
import Link from 'next/link';
import { thousands } from '../../lib/helpers/formatters';
import { TagWithCategory } from '../../interfaces/tag';
import { PURITY_NSFW, PURITY_SFW, PURITY_SKETCHY } from '../../interfaces/constants';
import styles from './popular-tag-item.module.scss';

const PURITY_TO_CLASS = {
  [PURITY_SFW]: styles.sfw,
  [PURITY_SKETCHY]: styles.sketchy,
  [PURITY_NSFW]: styles.nsfw,
};

interface PopularTagItemProps {
  tag: TagWithCategory;
}

const PopularTagItem: FC<PopularTagItemProps> = ({ tag }) => (
  <li className={styles.item}>
    <span className={styles.links}>
      <Link href={`/wallpapers?tag=${encodeURIComponent('"' + tag.name + '"')}`}>
        <a className={`${styles.search} ${PURITY_TO_CLASS[tag.purity]}`}>
          <FontAwesomeIcon icon={faSearch} />
          {tag.name}
        </a>
      </Link>
      <Link href={`/tags?cat=${tag.categoryId}`}>
        <a className={styles.category}>
          {tag.category.name}
        </a>
      </Link>
    </span>
    <span className={styles.stats}>{thousands(tag.wallpaperCount)}</span>
  </li>
);

PopularTagItem.displayName = 'PopularTagItem';

export default PopularTagItem;
