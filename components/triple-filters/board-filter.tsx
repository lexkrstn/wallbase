import React, { FC, MouseEvent, useCallback } from 'react';
import { Board } from '@/lib/constants';
import Tooltip from '@/components/tooltip';
import styles from './board-filter.module.scss';

interface BoardFilterProps {
  className?: string;
  onChange: (bitmask: number) => void;
  value: number;
  single?: boolean;
  disabled?: boolean;
}

const BoardFilter: FC<BoardFilterProps> = ({
  className, onChange, value, single, disabled,
}) => {
  const classes = [styles.host];
  if (className) classes.push(className);

  const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const board = parseInt(event.currentTarget.dataset.board ?? '0', 10);
    onChange(single ? board : value ^ board);
  }, [value, single]);

  return (
    <div className={classes.join(' ')}>
      <input type="hidden" name="boards" value={value} />
      <ul>
        <li className={value & Board.G ? styles.selected : ''}>
          <Tooltip message="General" position="bottom" offset={15}>
            <button
              type="button"
              onClick={onClick}
              data-board={Board.G}
              disabled={disabled}
            >
              G
            </button>
          </Tooltip>
        </li>
        <li className={value & Board.A ? styles.selected : ''}>
          <Tooltip message="Anime / Manga" position="bottom" offset={15}>
            <button
              type="button"
              onClick={onClick}
              data-board={Board.A}
              disabled={disabled}
            >
              A
            </button>
          </Tooltip>
        </li>
        <li className={value & Board.P ? styles.selected : ''}>
          <Tooltip message="People" position="bottom" offset={15}>
            <button
              type="button"
              onClick={onClick}
              data-board={Board.P}
              disabled={disabled}
            >
              P
            </button>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
};

BoardFilter.displayName = 'BoardFilter';

export default React.memo(BoardFilter);
