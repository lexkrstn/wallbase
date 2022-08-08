import { FC, MouseEvent, ReactNode, useCallback } from 'react';
import { SelectboxItemDto } from './interfaces';
import styles from './selectbox-switchable-field.module.scss';

interface SelectboxSwitchableFieldProps {
  options: SelectboxItemDto[];
  value: string;
  name?: string;
  children: ReactNode;
  rtl?: boolean;
  onChange: (value: string) => void;
}

const SelectboxSwitchableField: FC<SelectboxSwitchableFieldProps> = ({
  options, value, name, onChange, children, rtl,
}) => {
  const hostClasses = [styles.host];
  if (rtl) hostClasses.push(styles.rtl);

  const onOptionClick = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    const currentValue = event.currentTarget.dataset.value;
    const currentIndex = options.findIndex(option => option.value == currentValue);
    onChange(options[(currentIndex + 1) % options.length].value);
  }, [onChange]);

  return (
    <div className={hostClasses.join(' ')}>
      {!!name && (
        <input type="hidden" name={name} value={value} />
      )}
      <span className={styles.switch}>
        {options.map(option => (
          <span
            key={`o-${option.value}`}
            className={styles.option + ' ' + (option.value === value ? styles.active : '')}
            data-value={option.value}
            onClick={onOptionClick}
          >
            {option.label}
          </span>
        ))}
      </span>
      <span className={styles.separator}>:</span>
      <span className={styles.label}>{children}</span>
    </div>
  );
};

SelectboxSwitchableField.displayName = 'SelectboxSwitchableField';

SelectboxSwitchableField.defaultProps = {
  rtl: false,
};

export default SelectboxSwitchableField;
