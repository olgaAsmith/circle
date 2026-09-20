import React, { useEffect, useRef, useState } from 'react';
import BorderTitle from './SVG/BorderTitle';
import CirclePoints from './MainPage/CirclePoints';
import { events } from '../utils/consts';
import SwiperDatesList from './MainPage/SwiperDatesList';
import Panel from './MainPage/Panel';
const AUTOPLAY_INTERVAL = 5000;
const AUTOPLAY_RESUME_DELAY = 8000;

const Main: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(0);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayStateRef = useRef({ categoryId: 0, eventIndex: 0 });

  const activeCategory = events.find((event) => event.id === activeCategoryId) ?? events[0];
  const activeEvent =
    activeCategory.events[activeEventIndex] ?? activeCategory.events[0];

  autoplayStateRef.current = { categoryId: activeCategoryId, eventIndex: activeEventIndex };

  const pauseAutoplayTemporarily = () => {
    if (!isAutoPlaying) return;

    setIsPausedByUser(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPausedByUser(false);
    }, AUTOPLAY_RESUME_DELAY);
  };

  const handleUserChangeCategory = (id: number) => {
    setActiveCategoryId(id);
    setActiveEventIndex(0);
    pauseAutoplayTemporarily();
  };

  const handleUserChangeEvent = (index: number) => {
    setActiveEventIndex(index);
    pauseAutoplayTemporarily();
  };

  const handleToggleAutoPlay = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPausedByUser(false);
    setIsAutoPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!isAutoPlaying || isPausedByUser) return;

    const interval = setInterval(() => {
      const { categoryId, eventIndex } = autoplayStateRef.current;
      const categoryIndex = events.findIndex((event) => event.id === categoryId);
      const category = events[categoryIndex] ?? events[0];
      const lastEventIndex = category.events.length - 1;

      if (eventIndex < lastEventIndex) {
        setActiveEventIndex(eventIndex + 1);
        return;
      }

      const nextCategoryIndex = (categoryIndex + 1) % events.length;
      setActiveCategoryId(events[nextCategoryIndex].id);
      setActiveEventIndex(0);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPausedByUser]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', activeCategory.color);
  }, [activeCategory.color]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      const categoryIndex = events.findIndex(
        (item) => item.id === activeCategoryId,
      );
      const category = events[categoryIndex] ?? events[0];
      const eventCount = category.events.length;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex =
          (categoryIndex - 1 + events.length) % events.length;
        handleUserChangeCategory(events[prevIndex].id);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (categoryIndex + 1) % events.length;
        handleUserChangeCategory(events[nextIndex].id);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevEventIndex =
          (activeEventIndex - 1 + eventCount) % eventCount;
        handleUserChangeEvent(prevEventIndex);
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextEventIndex = (activeEventIndex + 1) % eventCount;
        handleUserChangeEvent(nextEventIndex);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeCategoryId, activeEventIndex]);

  return (
    <main className='main'>
      <div className='main__header'>
        <span className='main__title-decor'>
          <BorderTitle />
        </span>
        <h1 className='main__title'>Исторические даты</h1>
      </div>

      <div className='main__left-content'>
        <div className='main__controls'>
          <Panel
            activeCategoryId={activeCategoryId}
            onChangeCategory={handleUserChangeCategory}
            events={events}
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={handleToggleAutoPlay}
          />
        </div>

        <div className='main__footer'>
          <SwiperDatesList
            activeCategoryId={activeCategoryId}
            events={events}
            activeEventIndex={activeEventIndex}
            onActiveEventIndexChange={handleUserChangeEvent}
          />
        </div>
      </div>

      <div className='main__right'>
        <div className='main__circle main__circle--surface'>
          <CirclePoints
            activeCategoryId={activeCategoryId}
            onChangeCategory={handleUserChangeCategory}
            points={events}
            title={events[activeCategoryId].title}
            centerYear={activeEvent.year}
          />
        </div>
      </div>
    </main>
  );
};

export default Main;
