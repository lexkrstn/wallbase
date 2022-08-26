import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Link from 'next/link';
import styles from './carousel.module.scss';
import Image from 'next/image';

interface SlideData {
  image: string;
  href: string;
  description: string;
}

interface CarouselProps {
  slides: SlideData[];
}

function createChildFactory(classNames: string) {
  return function childFactory(child: ReactElement): ReactElement {
    return React.cloneElement(child, { classNames });
  };
}

const Carousel: FC<CarouselProps> = ({ slides }) => {
  const contentRef = useRef<HTMLUListElement>(null);
  const [{ activeIndex, direction }, setSlideState] = useState({
    activeIndex: 0,
    direction: 'right' as 'right'|'left',
  });
  const { image, href, description } = slides[activeIndex];
  const effect = `slide-${direction}`;

  const slideLeft = useCallback(() => {
    setSlideState(({ activeIndex: index }) => ({
      activeIndex: index <= 0 ? slides.length - 1 : index - 1,
      direction: 'left',
    }));
  }, [slides]);

  const slideRight = useCallback(() => {
    setSlideState(({ activeIndex: index }) => ({
      activeIndex: index >= slides.length - 1 ? 0 : index + 1,
      direction: 'right',
    }));
  }, [slides]);

  const onDotClick = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    const nextIndex = parseInt(event.currentTarget.dataset.index ?? '0', 10);
    setSlideState(({ activeIndex: index }) => ({
      activeIndex: nextIndex,
      direction: nextIndex > index ? 'right' : 'left',
    }));
  }, []);

  useEffect(() => {
    const MAX_SLIDE_X = 100;
    const NON_SLIDABLE_X = 20;
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dy = 0;
    // Whether a slide moved between touchstart and touchend events
    // (even if it eventually moved to its initial position).
    let moved = false;
    const onTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].screenX;
      startY = event.touches[0].screenY;
      dx = 0;
      dy = 0;
      moved = false;
      if (!contentRef.current) return;
      const slideEl = contentRef.current.firstElementChild as HTMLLIElement;
      slideEl.style.transition = '';
    };
    const onTouchEnd = () => {
      if (!contentRef.current) return;
      const slideEl = contentRef.current.firstElementChild as HTMLLIElement;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > NON_SLIDABLE_X) {
        if (dx < 0) {
          slideRight();
        } else {
          slideLeft();
        }
        slideEl.style.transform = '';
        slideEl.style.transition = '';
        return;
      } else {
        slideEl.style.transform = 'translateX(0)';
        slideEl.style.transition = 'transform .15s ease';
      }
    };
    const onTouchMove = (event: TouchEvent) => {
      dx = event.touches[0].screenX - startX;
      dy = event.touches[0].screenY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        event.preventDefault();
        event.stopPropagation();
        if (!contentRef.current) return;
        const slideEl = contentRef.current.firstElementChild as HTMLLIElement;
        const x = Math.min(MAX_SLIDE_X, Math.max(-MAX_SLIDE_X, dx));
        slideEl.style.transform = `translateX(${x}px)`;
        moved = true;
      }
    };
    const onClick = (event: MouseEvent) => {
      if (moved) {
        event.preventDefault();
      }
    };
    if (!contentRef.current) return;
    const contentEl = contentRef.current;
    contentEl.addEventListener('touchstart', onTouchStart, true);
    contentEl.addEventListener('touchend', onTouchEnd, true);
    contentEl.addEventListener('touchmove', onTouchMove, true);
    contentEl.addEventListener('click', onClick, true);
    return () => {
      contentEl.removeEventListener('touchstart', onTouchStart, true);
      contentEl.removeEventListener('touchend', onTouchEnd, true);
      contentEl.removeEventListener('touchmove', onTouchMove, true);
      contentEl.removeEventListener('click', onClick, true);
    };
  }, []);

  return (
    <div className={styles.host}>
      <ul className={styles.content} ref={contentRef}>
        <TransitionGroup component={null} childFactory={createChildFactory(effect)}>
          <CSSTransition key={href} classNames={effect} timeout={300}>
            <li data-index={activeIndex} className={styles.slide}>
              <Link href={href}>
                <a title="Go to the wallpaper page">
                  <img src={image} alt={description} />
                </a>
              </Link>
            </li>
          </CSSTransition>
        </TransitionGroup>
      </ul>
      <div className={styles.left} title="Previous">
        <button
          type="button"
          onClick={activeIndex !== 0 ? slideLeft : undefined}
          disabled={activeIndex === 0}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      </div>
      <div className={styles.right} title="Next">
        <button
          type="button"
          onClick={activeIndex !== slides.length - 1 ? slideRight : undefined}
          disabled={activeIndex === slides.length - 1}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <ul className={styles.dots}>
        {slides.map((slide, index) => (
          <li
            className={styles.dot + ' ' + (index === activeIndex ? styles.activeDot : '')}
            key={slide.href}
            data-index={index}
            onClick={onDotClick}
          />
        ))}
      </ul>
      {slides.slice(1).map(({ image }) => (
        <link key={image} rel="preload" as="image" href={image} />
      ))}
    </div>
  );
};

Carousel.displayName = 'Carousel';

export default React.memo(Carousel);
