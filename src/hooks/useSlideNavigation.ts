'use client';

import { useState, useCallback, useEffect } from 'react';

export function useSlideNavigation(totalSlides: number) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentIndex(index);
      }
    },
    [totalSlides]
  );

  const next = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const prev = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);
  const restart = useCallback(() => goToSlide(0), [goToSlide]);
  const end = useCallback(() => goToSlide(totalSlides - 1), [totalSlides, goToSlide]);

  const progress =
    totalSlides <= 1 ? 100 : 10 + (currentIndex / (totalSlides - 1)) * 90;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIndex((i) => Math.min(i + 1, totalSlides - 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentIndex(totalSlides - 1);
          break;
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const seekFromClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      const target = Math.round(ratio * (totalSlides - 1));
      goToSlide(Math.max(0, Math.min(target, totalSlides - 1)));
    },
    [totalSlides, goToSlide]
  );

  return {
    currentIndex,
    goToSlide,
    next,
    prev,
    restart,
    end,
    progress,
    isFirst,
    isLast,
    seekFromClick,
  };
}
