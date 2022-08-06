import React, { ReactElement } from 'react';
import styles from './board-filter.module.scss';

export default function BoardFilter(): ReactElement {
  return (
    <div className={styles.host}>
      <input type="hidden" name="board" id="board" value="111" />
      <ul>
        <li className="selected">
          <a className="js-tooltip" href="javascript:;" title="General" data-position="bottom">G</a>
        </li>
        <li className="selected">
          <a className="js-tooltip" href="javascript:;" title="Anime / Manga" data-position="bottom">A</a>
        </li>
        <li className="selected">
          <a className="js-tooltip" href="javascript:;" title="People" data-position="bottom">P</a>
        </li>
      </ul>
    </div>
  );
}
