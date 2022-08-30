import React, { FC, useEffect, useRef, useState } from 'react';

interface IntersectionTriggerProps {
  className?: string;
  onIntersect: () => void;
}

const IntersectionTrigger: FC<IntersectionTriggerProps> = ({
  className, onIntersect,
}) => {
  const classes: string[] = [];
  if (className) classes.push(className);

  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const intersects = !!entries.find(entry => entry.isIntersecting);
      if (!visible.current && intersects) {
        onIntersect();
      }
      visible.current = intersects;
    }, { threshold: 1 });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, [onIntersect]);

  return <div className={classes.join(' ')} ref={ref}></div>
};

IntersectionTrigger.displayName = 'IntersectionTrigger';

export default IntersectionTrigger;
