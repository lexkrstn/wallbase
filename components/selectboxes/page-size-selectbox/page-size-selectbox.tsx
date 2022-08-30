import { PageSizeType, PageSizeTypeString, PAGE_SIZES } from '@/lib/types';
import React, { FC, useCallback } from 'react';
import Selectbox, { SelectboxItemDto } from '../selectbox';
import styles from './page-size-selectbox.module.scss';

const ITEMS: SelectboxItemDto<PageSizeTypeString>[] = PAGE_SIZES.map(size => ({
  value: `${size}`,
  label: `${size}`,
}));

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
