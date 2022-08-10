import React, { FC, MouseEvent, ReactElement, useCallback, useState } from 'react';
import { PURITY_NSFW, PURITY_SFW, PURITY_SKETCHY } from '../../interfaces/constants';
import Tooltip from '../tooltip';
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
          <Tooltip
            message="Clean wallpapers"
            position="bottom"
            offset={15}
          >
            <button onClick={onClick} data-purity={PURITY_SFW}>SFW</button>
          </Tooltip>
        </li>
        <li className={value & PURITY_SKETCHY ? styles.selected : ''}>
          <Tooltip
            message="Wallpapers with soft/erotic poses, blood, etc."
            position="bottom"
            offset={15}
          >
            <button onClick={onClick} data-purity={PURITY_SKETCHY}>SKETCHY</button>
          </Tooltip>
        </li>
        <li className={value & PURITY_NSFW ? styles.selected : ''}>
          <Tooltip
            message="Wallpapers with visible boobs, testicles/vagina, gore, etc"
            position="bottom"
            offset={15}
          >
            <button
              onClick={nsfwDisabled ? undefined : onClick}
              disabled={nsfwDisabled}
              data-purity={PURITY_NSFW}
            >
              NSFW
            </button>
          </Tooltip>
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
