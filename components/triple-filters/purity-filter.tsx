import React, { FC, ReactElement, useState } from 'react';
import { PURITY_NSFW, PURITY_SFW, PURITY_SKETCHY } from '../../interfaces/constants';
import styles from './purity-filter.module.scss';

interface PurityFilterProps {
  nsfwDisabled?: boolean;
  onChange?: (bitmask: number) => void;
}

const PurityFilter: FC<PurityFilterProps> = ({ onChange, nsfwDisabled }) => {
  const [purities, setPurities] = useState(PURITY_SFW | PURITY_SKETCHY);
  const clickHandlers = [PURITY_SFW, PURITY_SKETCHY, PURITY_NSFW].map(purity => () => {
    setPurities(purities ^ purity);
    onChange && onChange(purities ^ purity);
  });
  return (
    <div className={styles.host}>
      <input type="hidden" name="purity" value={purities} />
      <ul>
        <li className={purities & PURITY_SFW ? styles.selected : ''}>
          <button
            onClick={clickHandlers[0]}
            title="Clean wallpaper"
          >
            SFW
          </button>
        </li>
        <li className={purities & PURITY_SKETCHY ? styles.selected : ''}>
          <button
            onClick={clickHandlers[1]}
            title="Wallpaper with soft/erotic poses, blood, etc."
          >
            SKETCHY
          </button>
        </li>
        <li className={purities & PURITY_NSFW ? styles.selected : ''}>
          <button
            onClick={nsfwDisabled ? undefined : clickHandlers[2]}
            disabled={nsfwDisabled}
            title="Wallpaper with visible boobs, testicles/vagina, gore, etc"
          >
            NSFW
          </button>
        </li>
      </ul>
    </div>
  );
};

PurityFilter.displayName = 'PurityFilter';

PurityFilter.defaultProps = {
  nsfwDisabled: false,
};

export default React.memo(PurityFilter);
