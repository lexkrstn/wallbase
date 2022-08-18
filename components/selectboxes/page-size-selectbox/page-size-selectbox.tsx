import React, { FC, useCallback } from 'react';
import Selectbox, { SelectboxItemDto } from '../selectbox';
import styles from './page-size-selectbox.module.scss';

export type PageSizeType = 24 | 36 | 48 | 60;
export type PageSizeTypeString = '24' | '36' | '48' | '60';

const ITEMS: SelectboxItemDto<PageSizeTypeString>[] = [
  { value: '24', label: '24' },
  { value: '36', label: '36' },
  { value: '48', label: '48' },
  { value: '60', label: '60' },
];

interface PageSizeSelectboxProps {
  className?: string;
  onChange: (value: PageSizeType) => void;
  value: PageSizeType;
}

const PageSizeSelectbox: FC<PageSizeSelectboxProps> = ({ className, onChange, value }) => {
  const classes = [styles.host];
  if (className) classes.push(className);

  const handleChange = useCallback((value: string) => {
    onChange(parseInt(value, 10) as PageSizeType);
  }, [onChange]);

  return (
    <Selectbox
      className={classes.join(' ')}
      name="pageSize"
      items={ITEMS}
      onChange={handleChange}
      value={`${value}`}
    />
  );
};

PageSizeSelectbox.displayName = 'PageSizeSelectbox';

export default React.memo(PageSizeSelectbox);
