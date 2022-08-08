import React, { FC, MouseEvent, useCallback, useMemo, useState } from 'react';
import { BOARD_A, BOARD_G, BOARD_P } from '../../interfaces/constants';
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
          <button onClick={onClick} title="General" data-board={BOARD_G}>G</button>
        </li>
        <li className={value & BOARD_A ? styles.selected : ''}>
          <button onClick={onClick} title="Anime / Manga" data-board={BOARD_A}>A</button>
        </li>
        <li className={value & BOARD_P ? styles.selected : ''}>
          <button onClick={onClick} title="People" data-board={BOARD_P}>P</button>
        </li>
      </ul>
    </div>
  );
};

BoardFilter.displayName = 'BoardFilter';

export default React.memo(BoardFilter);
