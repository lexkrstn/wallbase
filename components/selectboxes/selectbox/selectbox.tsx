import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import React, {
  FC, ReactElement, ReactNode, useCallback, useEffect, useRef, useState,
} from 'react';
import { hasAncestorNode } from '../../../helpers/hasAncestorNode';
import styles from './selectbox.module.scss';
import { SelectboxItemDto } from './interfaces';
import SelectboxItemList from './selectbox-item-list';

export interface SelectboxProps {
  className?: string;
  children?: ReactNode;
  items: SelectboxItemDto[];
  name?: string;
  value?: string;
  defaultLabel?: string;
  notCloseOnChange?: boolean;
  onChange?: (value: string) => void;
  renderItem?: (item: SelectboxItemDto, index: number) => ReactElement;
  renderLabel?: (item?: SelectboxItemDto) => ReactElement;
}

const Selectbox: FC<SelectboxProps> = ({
  children, className, value, defaultLabel, items, name, onChange,
  notCloseOnChange, renderItem, renderLabel,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const hostClasses = [styles.selectbox];
  if (className) hostClasses.push(className);
  if (open) hostClasses.push(styles.open);

  const selectedItem = items.find(item => item.value === value);

  const doOpen = useCallback(() => setOpen(true), []);

  const onItemChange = useCallback((itemValue: string) => {
    if (!notCloseOnChange) {
      setOpen(false);
    }
    if (onChange) {
      onChange(itemValue);
    }
  }, [notCloseOnChange]);

  // Closes the popup menu upon clicking on the document
  useEffect(() => {
    if (!open) return;
    const documentClickHandler = (event: MouseEvent) => {
      // Prevent closing upon clicking on the trigger showing the popup
      if (hasAncestorNode(event.target as Node, hostRef.current)) return;
      setOpen(false);
    };
    document.addEventListener('click', documentClickHandler);
    return () => {
      document.removeEventListener('click', documentClickHandler);
    };
  }, [open]);

  return (
    <div className={hostClasses.join(' ')} ref={hostRef}>
      {!!name && (
        <input
          type="hidden"
          name={name}
          value={selectedItem ? selectedItem.value : ''}
        />
      )}
      <div className={styles.field} onClick={doOpen}>
        <div className={styles.arrow}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
        {!renderLabel && (selectedItem ? selectedItem.label : defaultLabel)}
        {!!renderLabel && renderLabel(selectedItem)}
      </div>
      <div className={styles.menu}>
        {!!children && children}
        {!children && (
          <SelectboxItemList
            items={items}
            value={value}
            onChange={onItemChange}
            renderLabel={renderItem}
          />
        )}
      </div>
    </div>
  );
};

Selectbox.displayName = 'Selectbox';

Selectbox.defaultProps = {
  defaultLabel: 'All',
  value: '',
  notCloseOnChange: false,
};

export default Selectbox;