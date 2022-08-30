import { OrderByType, OrderType } from '@/lib/types';
import React, { FC } from 'react';
import Selectbox, { SelectboxItemDto, SelectboxSwitchableField } from '../selectbox';

const ITEMS: SelectboxItemDto<OrderByType>[] = [
  { value: 'relevancy', label: 'Relevancy' },
  { value: 'date', label: 'Date' },
  { value: 'views', label: 'Views' },
  { value: 'favs', label: 'Favorites' },
];

const OPTIONS: SelectboxItemDto<OrderType>[] = [
  { value: 'desc', label: 'descending' },
  { value: 'asc', label: 'ascending' },
];

interface OrderBySelectboxProps {
  onChange: (value: OrderByType) => void;
  onOrderChange: (value: OrderType) => void;
  value: OrderByType;
  order: OrderType;
}

type StringChangeCallbackType = (value: string) => void;

const OrderBySelectbox: FC<OrderBySelectboxProps> = ({
  onChange, onOrderChange, value, order,
}) => {
  const selectedItem = ITEMS.find(item => item.value === value);
  return (
    <Selectbox
      name="orderBy"
      items={ITEMS}
      onChange={onChange as StringChangeCallbackType}
      value={`${value}`}
      renderLabel={() => (
        <SelectboxSwitchableField
          name="order"
          options={OPTIONS}
          value={order}
          onChange={onOrderChange as StringChangeCallbackType}
        >
          {selectedItem?.label}
        </SelectboxSwitchableField>
      )}
    />
  );
};

OrderBySelectbox.displayName = 'OrderBySelectbox';

export default React.memo(OrderBySelectbox);
