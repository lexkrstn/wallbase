import React, { CSSProperties, FC, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './tooltip.module.scss';

interface TooltipProps {
  className?: string;
  message: string | ReactNode;
  inline?: boolean;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
};

const Tooltip: FC<TooltipProps> = ({
  className, children, inline, message, position, offset,
}) => {
  const [shown, setShown] = useState(false);
  const [presented, setPresented] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const hostClasses = [styles.host];
  if (inline) {
    hostClasses.push(styles.inline);
  }
  if (className) {
    hostClasses.push(className);
  }

  const show = useCallback(() => setShown(true), []);
  const hide = useCallback(() => setShown(false), []);

  useEffect(() => {
    if (!messageRef.current) {
      setPresented(true);
      return;
    }
    const rect = hostRef.current!.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.top + window.scrollY;
    if (position === 'top' || position === 'bottom') {
      left += rect.width / 2;
    } else if (position === 'left' || position === 'right') {
      top += rect.height / 2;
    }
    if (position === 'bottom') {
      top += rect.height;
    } else if (position === 'right') {
      left += rect.width;
    }
    const { style } = messageRef.current!;
    style.top = `${top}px`;
    style.left = `${left}px`;
  });


  const messageClasses = [styles.message, styles[position as string]]
  if (shown) {
    messageClasses.push(styles.shown);
  }
  const messageStyle: CSSProperties = {};
  if (position === 'top') {
    messageStyle.transform = 'translate(-50%, -100%)';
    messageStyle.marginTop = `-${offset}px`;
  } else if (position === 'bottom') {
    messageStyle.transform = 'translateX(-50%)';
    messageStyle.marginTop = `${offset}px`;
  } else if (position === 'left') {
    messageStyle.transform = 'translate(-100%, -50%)';
    messageStyle.marginLeft = `-${offset}px`;
  } else if (position === 'right') {
    messageStyle.transform = 'translateY(-50%)';
    messageStyle.marginLeft = `${offset}px`;
  }
  const messageJsx = (
    <div
      className={messageClasses.join(' ')}
      ref={messageRef}
      style={messageStyle}
    >
      {message}
    </div>
  );

  return (
    <div
      className={hostClasses.join(' ')} ref={hostRef}
      onMouseOut={hide}
      onMouseOver={show}
    >
      {children}
      {presented && createPortal(messageJsx, document.body)}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

Tooltip.defaultProps = {
  inline: false,
  position: 'top',
  offset: 10,
};

export default Tooltip;
