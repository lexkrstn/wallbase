import React, { FC, MouseEvent, ReactElement, useCallback } from 'react';
import { SelectboxItemDto } from './interfaces';
import styles from './selectbox-item-list.module.scss';

interface SelectboxItemListProps {
  items: SelectboxItemDto[];
  value?: string;
  onChange?: (value: string) => void;
  renderLabel?: (item: SelectboxItemDto, index: number) => ReactElement;
}

const SelectboxItemList: FC<SelectboxItemListProps> = ({
  items, value, onChange, renderLabel,
}) => {
  const onItemClick = useCallback((event: MouseEvent<HTMLLIElement>) => {
    onChange && onChange(event.currentTarget.dataset.value ?? '');
  }, []);
  return (
    <ul className={styles.host}>
      {items.map((item, index) => (
        <li
          key={item.value}
          className={styles.item + ' ' + (item.value === value ? styles.selected : '')}
          data-value={item.value}
          onClick={onItemClick}
        >
          {!renderLabel && item.label}
          {!!renderLabel && renderLabel(item, index)}
        </li>
      ))}
    </ul>
  );
};

SelectboxItemList.displayName = 'SelectboxItemList';

export default SelectboxItemList;
