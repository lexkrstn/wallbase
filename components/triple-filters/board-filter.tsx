import React, { FC, useMemo, useState } from 'react';
import { BOARD_A, BOARD_G, BOARD_P } from '../../interfaces/constants';
import styles from './board-filter.module.scss';

interface BoardFilterProps {
  onChange?: (bitmask: number) => void;
}

const BoardFilter: FC<BoardFilterProps> = ({ onChange }) => {
  const [boards, setBoards] = useState(BOARD_G | BOARD_A | BOARD_P);
  const clickHandlers = [BOARD_G, BOARD_A, BOARD_P].map(board => () => {
    setBoards(boards ^ board);
    onChange && onChange(boards ^ board);
  });
  return (
    <div className={styles.host}>
      <input type="hidden" name="board" value={boards} />
      <ul>
        <li className={boards & BOARD_G ? styles.selected : ''}>
          <button onClick={clickHandlers[0]} title="General">G</button>
        </li>
        <li className={boards & BOARD_A ? styles.selected : ''}>
          <button onClick={clickHandlers[1]} title="Anime / Manga">A</button>
        </li>
        <li className={boards & BOARD_P ? styles.selected : ''}>
          <button onClick={clickHandlers[2]} title="People">P</button>
        </li>
      </ul>
    </div>
  );
};

BoardFilter.displayName = 'BoardFilter';

export default React.memo(BoardFilter);
