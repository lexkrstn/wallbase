import React, { FC, useMemo } from 'react';
import styles from './color-picker.module.scss';

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface ColorPickerProps {
  rows?: number;
  cols?: number;
  onChange?: (color: Rgb) => void;
}

interface Cell {
  color: Rgb;
  clickHandler: () => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ rows, cols, onChange }) => {
  const cells = useMemo(() => {
    const c: Cell[][] = new Array(rows);
    for (let i = 0; i < rows!; i++) {
      c[i] = new Array(cols);
      for (let j = 0; j < cols!; j++) {
        const color = {
          r: Math.round(255 * i / rows!),
          g: Math.round((3 * 255 * j / cols!) % 255),
          b: Math.round(255 * j / cols!),
        };
        c[i][j] = {
          color,
          clickHandler: () => onChange && onChange(color),
        };
      }
    }
    return c;
  }, [rows, cols]);
  return (
    <div className={styles.colorPicker}>
      {cells.map((row, i) => (
        <div
          key={`r${i}`}
          className={styles.row}
        >
          {row.map(({ color: { r, g, b }, clickHandler }, j) => (
            <div
              key={`c${j}`}
              className={styles.cell}
              style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
              onClick={clickHandler}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

ColorPicker.displayName = 'ColorPicker';

ColorPicker.defaultProps = {
  rows: 9,
  cols: 9,
  onChange: () => {},
};

export default React.memo(ColorPicker);
