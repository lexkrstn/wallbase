import React, { ReactElement } from 'react';
import styles from './purity-filter.module.scss';

export default function PurityFilter(): ReactElement {
  return (
    <div className={styles.host}>
      <input type="hidden" name="purity" id="purity" value="110"/>
      <ul>
        <li className="selected">
          <a className="js-tooltip" href="javascript:;" title="Clean wallpaper" data-position="bottom">SFW</a>
        </li>
        <li className="selected">
          <a className="js-tooltip" href="javascript:;" title="Wallpaper with soft/erotic poses, blood, etc." data-position="bottom">SKETCHY</a>
        </li>
        <li>
          <a className="js-tooltip" href="javascript:;" title="Wallpaper with visible boobs, testicles/vagina, gore, etc" data-position="bottom-right">NSFW</a>
        </li>
      </ul>
    </div>
  );
}
