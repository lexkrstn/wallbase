import React, { ReactElement } from 'react';
import styles from './ring-spinner.module.scss';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type RingSpinnerSize = typeof SIZES[number];

type RingSpinnerSizeProps = {
  [key in RingSpinnerSize]: boolean;
};

interface RingSpinnerProps extends Partial<RingSpinnerSizeProps> {
  color?: string;
  size?: number | string;
  thickness?: number | string;
}

type SizeInfoObject = {
  [key in RingSpinnerSize]: {
    size: number | string;
    thickness: number;
  };
};

const SIZE_INFO: SizeInfoObject = {
  xs: { size: 16, thickness: 2 },
  sm: { size: 22, thickness: 2 },
  md: { size: 28, thickness: 2 },
  lg: { size: 34, thickness: 3 },
  xl: { size: 40, thickness: 3 },
};

function RingSpinner({
  size = '1.8em',
  color = 'currentColor',
  thickness = '2px',
  ...rest
}: RingSpinnerProps): ReactElement {
  size = typeof size === 'number' ? `${size}px` : size;
  thickness = typeof thickness === 'number' ? `${thickness}px` : thickness;
  const sizeName = SIZES.find(s => rest[s]);
  if (sizeName) {
    size = SIZE_INFO[sizeName].size;
    thickness = SIZE_INFO[sizeName].thickness;
  }
	const hostStyle = {
		width: size,
		height: size,
	};
	const ringStyle = {
		borderTopColor: color,
		borderWidth: thickness,
	};
	return (
		<div className={styles.host} style={hostStyle}>
			<div className={styles.ring} style={ringStyle} />
			<div className={styles.ring} style={ringStyle} />
			<div className={styles.ring} style={ringStyle} />
			<div className={styles.ring} style={ringStyle} />
		</div>
	);
}

export default React.memo(RingSpinner);
