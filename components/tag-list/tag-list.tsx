import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTag } from '@fortawesome/free-solid-svg-icons';
import React, { FC, MouseEvent, useCallback } from 'react';
import { PURITY_NSFW, PURITY_SFW, PURITY_SKETCHY } from '../../interfaces/constants';
import Tag from '../../interfaces/tag';
import styles from './tag-list.module.scss';

const PURITY_TO_CLASS: Record<number, string> = {
  [PURITY_SFW]: styles.sfw,
  [PURITY_SKETCHY]: styles.sketchy,
  [PURITY_NSFW]: styles.nsfw,
};

interface TagListProps {
  tags: Tag[];
  deletable?: boolean;
  className?: string;
  disabled?: boolean;
  onClickDelete?: (tag: Tag) => void;
  onClickTag?: (tag: Tag) => void;
}

const TagList: FC<TagListProps> = ({
  tags, deletable, className, disabled, onClickDelete, onClickTag,
}) => {
  const classes = [styles.list];
  if (className) classes.push(className);
  if (disabled) classes.push(styles.disabled);

  const handleClickDelete = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (disabled) return;
    if (onClickDelete) {
      const id = (event.currentTarget.parentElement as HTMLDivElement).dataset.id!;
      const tag = tags.find(t => t.id === id)!;
      onClickDelete(tag);
    }
  }, [tags, onClickDelete, disabled]);

  const handleClickTag = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (onClickTag) {
      const id = event.currentTarget.dataset.id!;
      const tag = tags.find(t => t.id === id)!;
      onClickTag(tag);
    }
  }, [tags, onClickTag, disabled]);

  return (
    <div className={classes.join(' ')}>
      {tags.map(tag => (
        <div
          key={tag.id}
          className={`${styles.item} ${PURITY_TO_CLASS[tag.purity]}`}
          data-id={tag.id}
          onClick={handleClickTag}
        >
          <span className={styles.icon}>
            <FontAwesomeIcon icon={faTag} />
          </span>
          <span
            className={styles.text}
            title={tag.name}
          >
            {tag.name}
          </span>
          {!!deletable && (
            <span className={styles.delete} onClick={handleClickDelete}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

TagList.displayName = 'TagList';

export default React.memo(TagList);
