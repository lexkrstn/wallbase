import { FC, MouseEvent, useCallback } from 'react';
import styles from './tabs.module.scss';

interface TabsProps {
  labels: string[];
  active: number;
  onChange: (index: number) => void;
}

const Tabs: FC<TabsProps> = ({ labels, active, onChange }) => {
  const onButtonClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    onChange(parseInt(event.currentTarget.dataset.index ?? '0', 10));
  }, []);
  return (
    <ul className={styles.host}>
      {labels.map((label, i) => (
        <li
          key={label}
          className={styles.tab + ' ' + (active === i ? styles.active : '')}
        >
          <button
            type="button"
            onClick={onButtonClick}
            data-index={i}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
