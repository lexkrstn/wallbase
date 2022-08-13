import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faSearch, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';
import styles from './search-line.module.scss';
import Link from 'next/link';
import { hasAncestorNode } from '../../helpers/hasAncestorNode';
import { rgbToHex } from '../../helpers/rgbToHex';
import ColorPicker, { Rgb } from '../color-picker';

export type SearchByType = 'keyword' | 'color';

interface SearchLineProps {
  searchBy: SearchByType;
  filtersShown: boolean;
  onShowFiltersClick: () => void;
}

const SearchLine: FC<SearchLineProps> = ({ filtersShown, searchBy, onShowFiltersClick }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const colorLineRef = useRef<HTMLDivElement>(null);
  const [colorPickerShown, setColorPickerShown] = useState(false);
  const [color, setColor] = useState<Rgb>({ r: 255, g: 255, b: 255 });

  const showColorPicker = useCallback(() => setColorPickerShown(true), []);

  const handleColorChange = useCallback((color: Rgb) => {
    setColor(color);
    setColorPickerShown(false);
  }, []);

  // Closes color picker upon clicking on the document
  useEffect(() => {
    if (!colorPickerShown) return;
    const documentClickHandler = (event: MouseEvent) => {
      // Prevent closing upon clicking on the popup itself
      if (hasAncestorNode(event.target as Node, popupRef.current)) return;
      // Prevent closing upon clicking on the trigger showing the popup
      if (hasAncestorNode(event.target as Node, colorLineRef.current)) return;
      setColorPickerShown(false);
    };
    document.addEventListener('click', documentClickHandler);
    return () => {
      document.removeEventListener('click', documentClickHandler);
    };
  }, [colorPickerShown, setColorPickerShown]);

  return (
    <div className={`${styles.host} ${styles.hostMain}`}>
      <form action="/walls">
        <div className={styles.content}>
          <button className={styles.search} type="submit" tabIndex={4}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button
            className={styles.options + ' ' + (filtersShown ? styles.optionsActive : '')}
            type="button"
            tabIndex={3}
            onClick={onShowFiltersClick}
          >
            <FontAwesomeIcon
              icon={faSliders}
              className={styles.iconComments}
              transform={{ rotate: 90 }}
            />
          </button>
          <Link href="/new">
            <a className={styles.new} title="Show new wallpapers" tabIndex={2}>
              <FontAwesomeIcon icon={faPizzaSlice} />
            </a>
          </Link>
          <div className={styles.input}>
            {searchBy === 'keyword' && (
              <input
                type="text"
                name="q"
                placeholder="Type in your search query"
                tabIndex={1}
                autoFocus
              />
            )}
            {searchBy === 'color' && (
              <div
                className={styles.color}
                style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                onClick={showColorPicker}
                ref={colorLineRef}
              >
                <span className={styles.colorText}>#{rgbToHex(color)}</span>
                <input type="hidden" name="color" value={rgbToHex(color)} />
              </div>
            )}
            {searchBy === 'color' && colorPickerShown && (
              <div className={styles.colorPickerPopup} ref={popupRef}>
                <ColorPicker onChange={handleColorChange} />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

SearchLine.displayName = 'SearchLine';

export default SearchLine;
