import React, { ReactElement } from 'react';
import styles from './popular-tags.module.scss';
import { thousands } from '../helpers/formatters';
import Tag from '../interfaces/tag';

interface PopularTagProps {
  tag: Tag;
}

function PopularTag({ tag }: PopularTagProps): ReactElement {
  const purityClass = tag.purity === 1 ? 'sfw' : (tag.purity === 2 ? 'sketchy' : 'nsfw');
  return (
    <li className={styles.item}>
      <span className={styles.links}>
        <a
          className={`${styles.search} ${purityClass}`}
          href={`#!/search/${encodeURIComponent(tag.name)}`}
        >
          <i className="fa fa-search"></i>{tag.name}
        </a>
        <a
          className={styles.category}
          href={`#!/category/${encodeURIComponent(tag.category.id)}`}
        >
          {tag.category.name}
        </a>
      </span>
      <span className={styles.stats}>{thousands(tag.count)}</span>
    </li>
  )
}

interface PopularTagsProps {
  tags: Tag[] | null;
}

export default function PopularTags({ tags }: PopularTagsProps): ReactElement {
  return (
    <ul className={styles.host}>
      {!!tags && tags.map(tag => (
        <PopularTag tag={tag} key={tag.id} />
      ))}
    </ul>
  );
}
