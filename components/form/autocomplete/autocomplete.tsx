import React, {
  ChangeEvent, FC, FocusEvent, FocusEventHandler, KeyboardEvent,
  KeyboardEventHandler, MouseEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { hasAncestorNode } from '@/lib/helpers/has-ancestor-node';
import { useAutocomplete } from '@/lib/hooks/use-autocomplete';
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
  value: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
  onPickItem?: (item: AutocompleteItem) => void;
  onChange: (value: string) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
}

const Autocomplete: FC<AutocompleteProps> = ({
  className, fetcher, onChange, onFocus, onPickItem,
  onKeyDown, emptyText, ...textFieldProps
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const notCloseDropdownOnBlur = useRef(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const { list, changeQuery } = useAutocomplete({ fetcher });

  const classes = [styles.host];
  if (className) classes.push(className);
  if (open && list?.length) classes.push(styles.open);

  const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    changeQuery(newValue);
    onChange(newValue);
  }, [onChange, changeQuery]);

  const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setOpen(true);
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);

  const handleInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code == 'ArrowDown') {
      event.stopPropagation()
      event.preventDefault()
      notCloseDropdownOnBlur.current = true;
      if (menuRef.current) {
        const li = menuRef.current.firstElementChild as HTMLLIElement | null;
        if (li) li.focus();
      }
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  }, [onKeyDown]);

  const handleItemClick = useCallback((event: MouseEvent<HTMLLIElement>) => {
    if (onPickItem) {
      const id = event.currentTarget.dataset.id!;
      const item = list?.find(item => item.id === id)!;
      if (!item) return;
      onPickItem(item);
    }
    changeQuery('');
    onChange('');
    setOpen(false);
  }, [list, onPickItem, onChange]);

  const handleItemKeyDown = useCallback((event: KeyboardEvent<HTMLLIElement>) => {
    if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
      event.stopPropagation();
      event.preventDefault();
      if (event.code === 'ArrowDown') {
        (event.currentTarget.nextElementSibling as HTMLLIElement | null)?.focus();
      } else {
        const next = (event.currentTarget.previousElementSibling as HTMLLIElement | null);
        if (next) {
          next.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    } else if (event.code === 'Enter') {
      if (onPickItem) {
        const id = event.currentTarget.dataset.id!;
        const item = list?.find(item => item.id === id)!;
        if (!item) return;
        onPickItem(item);
      }
      changeQuery('');
      onChange('');
      setOpen(false);
      inputRef.current!.focus();
    }
  }, [list, onPickItem, onChange, changeQuery]);

  useEffect(() => {
    if (!open) return;
    const documentClickHandler = (event: Event) => {
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
    <div className={classes.join(' ')} ref={hostRef}>
      <TextField
        {...textFieldProps}
        onChange={handleQueryChange}
        onFocus={handleFocus}
        onKeyDown={handleInputKeyDown}
        ref={inputRef}
        className={styles.textField}
      />
      <div className={styles.dropdown}>
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
