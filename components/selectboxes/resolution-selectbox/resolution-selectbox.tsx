import {
  ResolutionOperatorType,
  ResolutionType,
  STANDARD_RESOLUTIONS,
  WIDE_RESOLUTIONS,
} from '@/lib/types';
import React, { FC } from 'react';
import Selectbox, {
  SelectboxItemDto,
  SelectboxItemList,
  SelectboxSwitchableField,
} from '../selectbox';
import styles from './resolution-selectbox.module.scss';

const EMPTY_ITEMS: SelectboxItemDto<ResolutionType>[] = [{ value: '', label: 'All' }];

const STANDARD_ITEMS: SelectboxItemDto<ResolutionType>[] = STANDARD_RESOLUTIONS.map(
  resolution => ({ value: resolution, label: resolution }),
);

const WIDE_ITEMS: SelectboxItemDto<ResolutionType>[] = WIDE_RESOLUTIONS.map(
  resolution => ({ value: resolution, label: resolution }),
);

const ITEMS = [...EMPTY_ITEMS, ...STANDARD_ITEMS, ...WIDE_ITEMS];

const OPTIONS: SelectboxItemDto<ResolutionOperatorType>[] = [
  { value: 'eq', label: 'Exactly' },
  { value: 'gt', label: 'At least' },
];

interface ResolutionSelectboxProps {
  onChange: (value: ResolutionType) => void;
  onOperatorChange: (value: ResolutionOperatorType) => void;
  value: ResolutionType;
  operator: ResolutionOperatorType;
}

type StringChangeCallbackType = (value: string) => void;

const ResolutionSelectbox: FC<ResolutionSelectboxProps> = ({
  onChange, onOperatorChange, value, operator,
}) => {
  const selectedItem = ITEMS.find(item => item.value === value);
  return (
    <Selectbox
      name="resolution"
      items={ITEMS}
      onChange={onChange as StringChangeCallbackType}
      value={`${value}`}
      renderLabel={() => (
        <SelectboxSwitchableField
          name="resolutionOp"
          options={OPTIONS}
          value={operator}
          onChange={onOperatorChange as StringChangeCallbackType}
        >
          {selectedItem?.label}
        </SelectboxSwitchableField>
      )}
      minDropdownWidth={220}
    >
      <SelectboxItemList
        items={EMPTY_ITEMS}
        value={value}
        onChange={onChange as StringChangeCallbackType}
      />
      <div className={styles.folds}>
        <div className={styles.fold}>
          <div className={styles.header}>Standard</div>
          <SelectboxItemList
            items={STANDARD_ITEMS}
            value={value}
            onChange={onChange as StringChangeCallbackType}
          />
        </div>
        <div className={styles.fold}>
          <div className={styles.header}>Widescreen</div>
          <SelectboxItemList
            items={WIDE_ITEMS}
            value={value}
            onChange={onChange as StringChangeCallbackType}
          />
        </div>
      </div>
    </Selectbox>
  );
};

ResolutionSelectbox.displayName = 'ResolutionSelectbox';

export default React.memo(ResolutionSelectbox);
