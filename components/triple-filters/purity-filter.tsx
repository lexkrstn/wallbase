import React, { FC, MouseEvent, ReactElement, useCallback, useState } from 'react';
import { PURITY_NSFW, PURITY_SFW, PURITY_SKETCHY } from '../../interfaces/constants';
import styles from './purity-filter.module.scss';

interface PurityFilterProps {
  nsfwDisabled?: boolean;
  onChange: (bitmask: number) => void;
  value: number;
}

const PurityFilter: FC<PurityFilterProps> = ({ onChange, nsfwDisabled, value }) => {
  const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const purity = parseInt(event.currentTarget.dataset.purity ?? '0', 10);
    onChange(value ^ purity);
  }, [value]);
  return (
    <div className={styles.host}>
      <input type="hidden" name="purity" value={value} />
      <ul>
        <li className={value & PURITY_SFW ? styles.selected : ''}>
          <button
            onClick={onClick}
            title="Clean wallpaper"
            data-purity={PURITY_SFW}
          >
            SFW
          </button>
        </li>
        <li className={value & PURITY_SKETCHY ? styles.selected : ''}>
          <button
            onClick={onClick}
            title="Wallpaper with soft/erotic poses, blood, etc."
            data-purity={PURITY_SKETCHY}
          >
            SKETCHY
          </button>
        </li>
        <li className={value & PURITY_NSFW ? styles.selected : ''}>
          <button
            onClick={nsfwDisabled ? undefined : onClick}
            disabled={nsfwDisabled}
            title="Wallpaper with visible boobs, testicles/vagina, gore, etc"
            data-purity={PURITY_NSFW}
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
