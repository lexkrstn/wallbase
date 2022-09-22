import { Purity } from '@/lib/constants';
import React, { FC, MouseEvent, useCallback } from 'react';
import styles from './purity-flags.module.scss';

interface Props {
  purity: Purity;
  onPurityChange: (purity: Purity) => void;
}

const PurityFlags: FC<Props> = ({ purity, onPurityChange }) => {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    onPurityChange(parseInt(event.currentTarget.dataset.purity!, 10) as Purity);
  }, []);
  return (
    <div className={styles.purityFlags}>
      <button
        type="button"
        className={styles.sfw + (purity === Purity.SFW ? ` ${styles.active}` : '')}
        data-purity={Purity.SFW}
        onClick={handleClick}
        title="Clean wallpapers"
      >
        <svg
          className={styles.icon}
          viewBox="0 0 215 208"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="flagSvg" stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
            <path
              d="M214.101898,39.1519165 C174.820933,50.3233643 147.521383,52.7440592 132.203247,46.4140015 C109.226044,36.9189148 99.1457214,0.525726318 68.5838623,0.525726318 C53.2142199,0.525726318 32.8070936,18.9078753 22.2332458,23.7853699 C15.184014,27.0370329 7.89410213,29.7733585 0.363510132,31.9943466 L42.9811707,207.286591 L68.5838623,207.286591 L48.1721802,121.436691 C68.6616414,101.052373 85.9375814,94.2351227 100,100.98494 C121.093628,111.109665 133.593994,121.436691 140.46933,121.436691 C147.344666,121.436691 163.454258,106.721329 195.784454,71.3348083 C203.204661,63.2131348 209.310476,52.4855042 214.101898,39.1519165 Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </button>
      <button
        type="button"
        className={styles.sketchy + (purity === Purity.SKETCHY ? ` ${styles.active}` : '')}
        data-purity={Purity.SKETCHY}
        onClick={handleClick}
        title="Wallpapers with soft/erotic poses, blood, etc"
      >
        <svg
          className={styles.icon}
          viewBox="0 0 215 208"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="#flagSvg" />
        </svg>
      </button>
      <button
        type="button"
        className={styles.nsfw + (purity === Purity.NSFW ? ` ${styles.active}` : '')}
        data-purity={Purity.NSFW}
        onClick={handleClick}
        title="Wallpapers with visible boobs, testicles/vagina, gore, etc"
      >
        <svg
          className={styles.icon}
          viewBox="0 0 215 208"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="#flagSvg" />
        </svg>
      </button>
    </div>
  );
};

PurityFlags.displayName = 'PurityFlags';

export default PurityFlags;
