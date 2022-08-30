import { AspectType } from '@/lib/types';
import React, { FC } from 'react';
import Selectbox, { SelectboxDescribedItemDto, SelectboxItemDto } from '../selectbox';
import SelectboxDescribedItem from '../selectbox/selectbox-described-item';

const ITEMS: SelectboxDescribedItemDto<AspectType>[] = [
  { value: '', label: 'All', description: '(default)' },
  { value: '1.33', label: '4:3', description: '1280x960, 1600x1200...' },
  { value: '1.25', label: '5:4', description: '1280x1024, 2560x2048...' },
  { value: '1.77', label: '16:9', description: '1280x720, 1920x1080...' },
  { value: '1.60', label: '16:10', description: '1280x800, 1920x1200...' },
  { value: '1.70', label: 'Netbook', description: '1024x600, 1280x768...' },
  { value: '2.50', label: 'Dual', description: '2560x1024...' },
  { value: '3.20', label: 'Dual wide', description: '3360x1050, 3840x1200...' },
  { value: '0.99', label: 'Portrait', description: '' },
];

interface AspectSelectboxProps {
  onChange: (value: AspectType) => void;
  value: AspectType;
}

const renderItem = (item: SelectboxItemDto, index: number) => (
  <SelectboxDescribedItem
    key={item.value}
    {...ITEMS[index]}
  />
);

type StringChangeCallback = (value: string) => void;

const AspectSelectbox: FC<AspectSelectboxProps> = ({ onChange, value }) => {
  return (
    <Selectbox
      name="aspect"
      items={ITEMS}
      onChange={onChange as StringChangeCallback}
      value={value}
      renderItem={renderItem}
      minDropdownWidth={280}
    />
  );
};

AspectSelectbox.displayName = 'AspectSelectbox';

export default React.memo(AspectSelectbox);
