import React, { FC } from 'react';
import Tag from '@/entities/tag';
import PopularTagItem from './popular-tag-item';
import styles from './popular-tag-list.module.scss';

interface PopularTagListProps {
  tags: Tag[] | null;
}

const PopularTagList: FC<PopularTagListProps> = ({ tags }) => (
  <ul className={styles.host}>
    {!!tags && tags.map(tag => (
      <PopularTagItem tag={tag} key={tag.id} />
    ))}
  </ul>
);

PopularTagList.displayName = 'PopularTagList';

export default PopularTagList;
