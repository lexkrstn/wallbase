import React, { FC, useCallback, useState } from 'react';
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
  if (!query) return [];
  const result = await fetch(`/api/tags?q=${encodeURIComponent(query)}&perPage=5`);
  if (!result.ok) throw new Error(`Failed to load tags: HTTP ${result.status}`);
  const tags = (await result.json()) as Tag[];
  return tags.map(tag => ({
    id: tag.id,
    label: tag.name,
    userData: tag,
  }));
};

const TagInput: FC<TagInputProps> = ({ id, name, value, onChange }) => {
  const [query, setQuery] = useState('');

  const handlePickItem = useCallback((item: AutocompleteItem) => {
    if (onChange) {
      if (value.find(tag => tag.id === item.id)) return;
      onChange([...value, item.userData as Tag]);
    }
  }, [value]);

  const handleDeleteTag = useCallback((tag: Tag) => {
    if (onChange) {
      onChange(value.filter(t => t.id !== tag.id));
    }
  }, [value]);

  return (
    <div className={styles.host}>
      <TagList
        tags={value}
        className={styles.tagList}
        deletable
        onClickDelete={handleDeleteTag}
      />
      <Autocomplete
        id={id}
        name={name}
        fetcher={fetcher}
        onPickItem={handlePickItem}
        value={query}
        onChange={setQuery}
      />
    </div>
  );
};

TagInput.displayName = 'TagInput';

export default React.memo(TagInput);
