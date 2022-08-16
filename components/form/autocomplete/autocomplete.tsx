import React, {
  ChangeEvent, ChangeEventHandler, FC, FocusEvent, FocusEventHandler,
  KeyboardEvent, KeyboardEventHandler, MouseEvent, useCallback, useRef, useState,
} from 'react';
import { useAutocomplete } from '../../../lib/hooks/useAutocomplete';
import TextField from '../text-field';
import styles from './autocomplete.module.scss';

export interface AutocompleteItem {
  id: string;
  label: string;
  userData?: unknown;
}

export type AutocompleteFetcher = (query: string) => Promise<AutocompleteItem[]>;

interface AutocompleteProps {
  fetcher: (query: string) => Promise<AutocompleteItem[]>;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  placeholder?: string;
  password?: boolean;
  disabled?: boolean;
  emptyText?: string;
  onPickItem?: (item: AutocompleteItem) => void;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
}

const Autocomplete: FC<AutocompleteProps> = ({
  className, fetcher, onChange, onFocus, onBlur, onPickItem,
  onKeyDown, emptyText, ...textFieldProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const notCloseDropdownOnBlur = useRef(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const { list, changeQuery } = useAutocomplete({ fetcher });

  const dropdownClasses = [styles.dropdown];
  if (className) dropdownClasses.push(className);
  if (open && list?.length) dropdownClasses.push(styles.open);

  const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    changeQuery(event.currentTarget.value);
    if (onChange) {
      onChange(event);
    }
  }, [onChange]);

  const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setOpen(true);
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    if (!notCloseDropdownOnBlur.current) {
      setOpen(false);
    }
    notCloseDropdownOnBlur.current = false;
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur]);

  const handleInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code == 'ArrowDown') {
      event.stopPropagation()
      event.preventDefault()
      notCloseDropdownOnBlur.current = true;
      const li = menuRef.current!.firstElementChild as HTMLLIElement | null;
      if (li) li.focus();
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  }, []);

  const handleItemClick = useCallback((event: MouseEvent<HTMLLIElement>) => {
    const id = event.currentTarget.dataset.id!;
    const item = list?.find(item => item.id === id)!;
    if (!item) return;
    if (onPickItem) {
      onPickItem(item);
    }
  }, [list, onPickItem]);

  const handleItemKeyDown = useCallback((event: KeyboardEvent<HTMLLIElement>) => {
    if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
      event.stopPropagation();
      event.preventDefault();
      if (event.code === 'ArrowDown')
        (event.currentTarget.nextElementSibling as HTMLLIElement | null)?.focus();
      else
        (event.currentTarget.previousElementSibling as HTMLLIElement | null)?.focus();
    } else if (event.code === 'Enter') {
      if (onPickItem) {
        const id = event.currentTarget.dataset.id!;
        onPickItem(list!.find(item => item.id === id)!);
      }
      inputRef.current!.focus();
    }
  }, [list]);

  return (
    <div className={styles.host}>
      <TextField
        {...textFieldProps}
        onChange={handleQueryChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleInputKeyDown}
        ref={inputRef}
      />
      <div className={dropdownClasses.join(' ')}>
        {!!list && !!list.length && (
          <ul className={styles.list} ref={menuRef}>
            {list.map(({ id, label }) => (
              <li
                key={id}
                className={styles.item}
                data-id={id}
                onClick={handleItemClick}
                onKeyDown={handleItemKeyDown}
                tabIndex={-1}
              >
                {label}
              </li>
            ))}
          </ul>
        )}
        {(!list || !list.length) && (
          <div className={styles.empty}>
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
};

Autocomplete.displayName = 'Autocomplete';

Autocomplete.defaultProps = {
  emptyText: 'No match',
};

export default React.memo(Autocomplete);
