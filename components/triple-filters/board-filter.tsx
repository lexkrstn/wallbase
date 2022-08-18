import React, { FC, MouseEvent, useCallback } from 'react';
import { BOARD_A, BOARD_G, BOARD_P } from '../../interfaces/constants';
import Tooltip from '../tooltip';
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
      <input type="hidden" name="board" value={value} />
      <ul>
        <li className={value & BOARD_G ? styles.selected : ''}>
          <Tooltip message="General" position="bottom" offset={15}>
            <button onClick={onClick} data-board={BOARD_G} disabled={disabled}>G</button>
          </Tooltip>
        </li>
        <li className={value & BOARD_A ? styles.selected : ''}>
          <Tooltip message="Anime / Manga" position="bottom" offset={15}>
            <button onClick={onClick} data-board={BOARD_A} disabled={disabled}>A</button>
          </Tooltip>
        </li>
        <li className={value & BOARD_P ? styles.selected : ''}>
          <Tooltip message="People" position="bottom" offset={15}>
            <button onClick={onClick} data-board={BOARD_P} disabled={disabled}>P</button>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
};

BoardFilter.displayName = 'BoardFilter';

export default React.memo(BoardFilter);
