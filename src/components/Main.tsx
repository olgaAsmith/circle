import { useCallback, useEffect, useRef, useState } from 'react';
import BorderTitle from './SVG/BorderTitle';
import CirclePoints from './MainPage/CirclePoints';
import {
  getCategoryById,
  getEventAt,
  getNeighborCategory,
} from '@src/utils/consts';
import SwiperDatesList from './MainPage/SwiperDatesList';
import Panel from './MainPage/Panel';

const AUTOPLAY_INTERVAL = 5000;
const AUTOPLAY_RESUME_DELAY = 8000;

function Main() {
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAutoplayHeld, setIsAutoplayHeld] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayStateRef = useRef({ categoryId: 0, eventIndex: 0 });
  const isAutoPlayingRef = useRef(isAutoPlaying);

  const activeCategory = getCategoryById(activeCategoryId);
  const activeEvent = getEventAt(activeCategory, activeEventIndex);

  useEffect(() => {
    isAutoPlayingRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  useEffect(() => {
    autoplayStateRef.current = {
      categoryId: activeCategoryId,
      eventIndex: activeEventIndex,
    };
  }, [activeCategoryId, activeEventIndex]);

  const holdAutoplayTemporarily = useCallback(() => {
    if (!isAutoPlayingRef.current) return;

    setIsAutoplayHeld(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsAutoplayHeld(false);
    }, AUTOPLAY_RESUME_DELAY);
  }, []);

  const handleUserChangeCategory = useCallback(
    (id: number) => {
      setActiveCategoryId(id);
      setActiveEventIndex(0);
      holdAutoplayTemporarily();
    },
    [holdAutoplayTemporarily],
  );

  const handleUserChangeEvent = useCallback(
    (index: number) => {
      setActiveEventIndex(index);
      holdAutoplayTemporarily();
    },
    [holdAutoplayTemporarily],
  );

  const handleToggleAutoPlay = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsAutoplayHeld(false);
    setIsAutoPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || isAutoplayHeld) return;

    const interval = setInterval(() => {
      const { categoryId, eventIndex } = autoplayStateRef.current;
      const category = getCategoryById(categoryId);
      const lastEventIndex = category.events.length - 1;

      if (eventIndex < lastEventIndex) {
        setActiveEventIndex(eventIndex + 1);
        return;
      }

      setActiveCategoryId(getNeighborCategory(categoryId, 1).id);
      setActiveEventIndex(0);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isAutoplayHeld]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--accent',
      activeCategory.color,
    );
  }, [activeCategory.color]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      if (target.closest('[role="dialog"], .help__panel')) {
        return;
      }

      const category = getCategoryById(activeCategoryId);
      const eventCount = category.events.length;
      if (eventCount === 0) return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        handleUserChangeCategory(getNeighborCategory(activeCategoryId, -1).id);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleUserChangeCategory(getNeighborCategory(activeCategoryId, 1).id);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleUserChangeEvent((activeEventIndex - 1 + eventCount) % eventCount);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleUserChangeEvent((activeEventIndex + 1) % eventCount);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeCategoryId,
    activeEventIndex,
    handleUserChangeCategory,
    handleUserChangeEvent,
  ]);

  return (
    <main className="main">
      <div className="main__header">
        <span className="main__title-decor">
          <BorderTitle />
        </span>
        <h1 className="main__title">Исторические даты</h1>
      </div>

      <div className="main__left-content">
        <div className="main__controls">
          <Panel
            activeCategoryId={activeCategoryId}
            onChangeCategory={handleUserChangeCategory}
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={handleToggleAutoPlay}
          />
        </div>

        <div className="main__footer">
          <SwiperDatesList
            activeCategoryId={activeCategoryId}
            activeEventIndex={activeEventIndex}
            onActiveEventIndexChange={handleUserChangeEvent}
          />
        </div>
      </div>

      <div className="main__right">
        <div className="main__circle">
          <CirclePoints
            activeCategoryId={activeCategoryId}
            onChangeCategory={handleUserChangeCategory}
            centerYear={activeEvent.year}
          />
        </div>
      </div>
    </main>
  );
}

export default Main;
