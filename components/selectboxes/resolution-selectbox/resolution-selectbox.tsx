import React, { FC } from 'react';
import Selectbox, { SelectboxItemDto, SelectboxItemList, SelectboxSwitchableField } from '../selectbox';
import styles from './resolution-selectbox.module.scss';

const STANDARD_RESOLUTIONS = [
  '800x600', '1024x768', '1280x960', '1280x1024',
  '1400x1050', '1600x1200', '2560x2048',
] as const;

const WIDE_RESOLUTIONS = [
  '1024x600', '1280x800', '1366x768', '1440x900', '1600x900', '1680x1050',
  '1920x1080', '1920x1200', '2560x1440', '2560x1600',
] as const;

export type ResolutionOperatorType = 'eq' | 'gt';
export type ResolutionType = '' | typeof STANDARD_RESOLUTIONS[number] | typeof WIDE_RESOLUTIONS[number];

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
      name="res"
      items={ITEMS}
      onChange={onChange as StringChangeCallbackType}
      value={`${value}`}
      renderLabel={() => (
        <SelectboxSwitchableField
          name="res_op"
          options={OPTIONS}
          value={operator}
          onChange={onOperatorChange as StringChangeCallbackType}
        >
          {selectedItem?.label}
        </SelectboxSwitchableField>
      )}
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

export default ResolutionSelectbox;
