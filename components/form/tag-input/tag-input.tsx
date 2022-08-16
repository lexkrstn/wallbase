import React, { FC, useCallback } from 'react';
import Tag from '../../../interfaces/tag';
import TagList from '../../tag-list';
import Autocomplete, { AutocompleteFetcher, AutocompleteItem } from '../autocomplete';
import styles from './tag-input.module.scss';

interface TagInputProps {
  id?: string;
  name?: string;
  value: Tag[];
  onChange?: (value: Tag[]) => void;
}

const fetcher: AutocompleteFetcher = async (query) => {
  const result = await fetch(`/api/tags?q=${encodeURIComponent(query)}`);
  if (!result.ok) throw new Error(`Failed to load tags: HTTP ${result.status}`);
  const tags = (await result.json()) as Tag[];
  return tags.map(tag => ({
    id: tag.id,
    label: tag.name,
    userData: tag,
  }));
};

const TagInput: FC<TagInputProps> = ({ id, name, value, onChange }) => {
  const handlePickItem = useCallback((item: AutocompleteItem) => {
    if (onChange) {
      if (value.find(tag => tag.id === item.id)) return;
      onChange([...value, item.userData as Tag]);
    }
  }, [...value.map(tag => tag.id)]);
  return (
    <div className={styles.host}>
      <TagList tags={value} className={styles.tagList} />
      <Autocomplete
        id={id}
        name={name}
        fetcher={fetcher}
        onPickItem={handlePickItem}
      />
    </div>
  );
};

TagInput.displayName = 'TagInput';

export default React.memo(TagInput);
