import React, { FC, MouseEvent, useCallback } from 'react';
import { Purity } from '../../interfaces/constants';
import Tooltip from '../tooltip';
import styles from './purity-filter.module.scss';

interface PurityFilterProps {
  className?: string;
  nsfwDisabled?: boolean;
  onChange: (bitmask: number) => void;
  value: number;
  single?: boolean;
  disabled?: boolean;
}

const PurityFilter: FC<PurityFilterProps> = ({
  className, onChange, nsfwDisabled, value, single, disabled,
}) => {
  const classes = [styles.host];
  if (className) classes.push(className);

  const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const purity = parseInt(event.currentTarget.dataset.purity ?? '0', 10);
    onChange(single ? purity : value ^ purity);
  }, [value]);

  return (
    <div className={classes.join(' ')}>
      <input type="hidden" name="purity" value={value} />
      <ul>
        <li className={value & Purity.SFW ? styles.selected : ''}>
          <Tooltip
            message="Clean wallpapers"
            position="bottom"
            offset={15}
          >
            <button
              onClick={onClick}
              data-purity={Purity.SFW}
              disabled={disabled}
            >
              SFW
            </button>
          </Tooltip>
        </li>
        <li className={value & Purity.SKETCHY ? styles.selected : ''}>
          <Tooltip
            message="Wallpapers with soft/erotic poses, blood, etc."
            position="bottom"
            offset={15}
          >
            <button
              onClick={onClick}
              data-purity={Purity.SKETCHY}
              disabled={disabled}
            >
              SKETCHY
            </button>
          </Tooltip>
        </li>
        <li className={value & Purity.NSFW ? styles.selected : ''}>
          <Tooltip
            message="Wallpapers with visible boobs, testicles/vagina, gore, etc"
            position="bottom"
            offset={15}
          >
            <button
              onClick={nsfwDisabled ? undefined : onClick}
              disabled={nsfwDisabled || disabled}
              data-purity={Purity.NSFW}
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
