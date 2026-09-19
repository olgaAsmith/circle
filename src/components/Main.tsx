import React, { useEffect, useRef, useState } from 'react';
import BorderTitle from './SVG/BorderTitle';
import CirclePoints from './MainPage/CirclePoints';
import { events } from '../utils/consts';
import SwiperDatesList from './MainPage/SwiperDatesList';
import Panel from './MainPage/Panel';
const AUTOPLAY_INTERVAL = 4500;
const AUTOPLAY_RESUME_DELAY = 7000;

const Main: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(0);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCategory = events.find((event) => event.id === activeCategoryId) ?? events[0];
  const activeEvent =
    activeCategory.events[activeEventIndex] ?? activeCategory.events[0];

  const handleUserChangeCategory = (id: number) => {
    setActiveCategoryId(id);
    setActiveEventIndex(0);

    if (!isAutoPlaying) return;

    setIsPausedByUser(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPausedByUser(false);
    }, AUTOPLAY_RESUME_DELAY);
  };

  const handleToggleAutoPlay = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPausedByUser(false);
    setIsAutoPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!isAutoPlaying || isPausedByUser) return;

    const interval = setInterval(() => {
      setActiveCategoryId((prev) => {
        const currentIndex = events.findIndex((event) => event.id === prev);
        const nextIndex = (currentIndex + 1) % events.length;
        return events[nextIndex].id;
      });
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
            onActiveEventIndexChange={setActiveEventIndex}
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
