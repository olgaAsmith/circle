import React, { useEffect, useRef, useState } from 'react';
import BorderTitle from './SVG/BorderTitle';
import CirclePoints from './MainPage/CirclePoints';
import { events } from '../utils/consts';
import SwiperDatesList from './MainPage/SwiperDatesList';
import Panel from './MainPage/Panel';
import CountYear from './MainPage/CountYear';
import MobTitle from './MainPage/MobTitle';
const AUTOPLAY_INTERVAL = 4500;
const AUTOPLAY_RESUME_DELAY = 7000;

const Main: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCategory = events.find((event) => event.id === activeCategoryId) ?? events[0];

  const handleUserChangeCategory = (id: number) => {
    setActiveCategoryId(id);

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
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPausedByUser]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  return (
    <main
      className='main'
      style={{ '--accent': activeCategory.color } as React.CSSProperties}
    >
      <div className='main__header'>
        <span className='main__title-decor'>
          <BorderTitle />
        </span>
        <h1 className='main__title'>
          Исторические <br />
          даты
        </h1>
      </div>

      <div className='main__center'>
        <div className='main__dates'>
          <span className='main__date main__date--low'>
            <CountYear value={events[activeCategoryId].start} />
          </span>
          <span className='main__date main__date--high'>
            <CountYear value={events[activeCategoryId].end} />
          </span>
        </div>

        <div className='main__circle main__circle--surface'>
          <CirclePoints
            activeCategoryId={activeCategoryId}
            onChangeCategory={handleUserChangeCategory}
            points={events}
            title={events[activeCategoryId].title}
          />
        </div>
      </div>

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
        <MobTitle title={events[activeCategoryId].title} />
        <SwiperDatesList activeCategoryId={activeCategoryId} events={events} />
      </div>
    </main>
  );
};

export default Main;
