import React, { FC, MouseEvent, useCallback } from 'react';
import { BOARD_A, BOARD_G, BOARD_P } from '../../interfaces/constants';
import Tooltip from '../tooltip';
import styles from './board-filter.module.scss';

interface BoardFilterProps {
  onChange: (bitmask: number) => void;
  value: number;
}

const BoardFilter: FC<BoardFilterProps> = ({ onChange, value }) => {
  const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const board = parseInt(event.currentTarget.dataset.board ?? '0', 10);
    onChange(value ^ board);
  }, [value]);
  return (
    <div className={styles.host}>
      <input type="hidden" name="board" value={value} />
      <ul>
        <li className={value & BOARD_G ? styles.selected : ''}>
          <Tooltip message="General" position="bottom" offset={15}>
            <button onClick={onClick} data-board={BOARD_G}>G</button>
          </Tooltip>
        </li>
        <li className={value & BOARD_A ? styles.selected : ''}>
          <Tooltip message="Anime / Manga" position="bottom" offset={15}>
            <button onClick={onClick} data-board={BOARD_A}>A</button>
          </Tooltip>
        </li>
        <li className={value & BOARD_P ? styles.selected : ''}>
          <Tooltip message="People" position="bottom" offset={15}>
            <button onClick={onClick} data-board={BOARD_P}>P</button>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
};

BoardFilter.displayName = 'BoardFilter';

export default React.memo(BoardFilter);
