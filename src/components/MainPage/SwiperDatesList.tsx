import React, { useEffect, useState } from 'react';
import { Category } from '@src/utils/consts';
import SlideButton from '../SVG/SlideButton';

interface Props {
  activeCategoryId: number;
  events: Category[];
  activeEventIndex: number;
  onActiveEventIndexChange: (index: number) => void;
}

const SLIDE_FADE_MS = 320;

const SwiperDatesList: React.FC<Props> = ({
  activeCategoryId,
  events,
  activeEventIndex,
  onActiveEventIndexChange,
}) => {
  const activeCategory =
    events.find((event) => event.id === activeCategoryId) ?? events[0];

  const [isCategoryAnimating, setIsCategoryAnimating] = useState(false);
  const [displayCategory, setDisplayCategory] = useState(activeCategory);
  const [renderIndex, setRenderIndex] = useState(activeEventIndex);
  const [isSlideVisible, setIsSlideVisible] = useState(true);

  useEffect(() => {
    if (displayCategory.id === activeCategory.id) return;

    const frameId = requestAnimationFrame(() => {
      setIsCategoryAnimating(true);
      setIsSlideVisible(false);
    });

    const timer = setTimeout(() => {
      setDisplayCategory(activeCategory);
      setRenderIndex(activeEventIndex);
      setIsSlideVisible(true);
      setIsCategoryAnimating(false);
    }, SLIDE_FADE_MS);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [activeCategory, activeEventIndex, displayCategory]);

  useEffect(() => {
    if (activeEventIndex === renderIndex) return;

    const frameId = requestAnimationFrame(() => {
      setIsSlideVisible(false);
    });

    const timer = setTimeout(() => {
      setRenderIndex(activeEventIndex);
      setIsSlideVisible(true);
    }, SLIDE_FADE_MS);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [activeEventIndex, renderIndex]);

  const eventCount = displayCategory.events.length;
  const currentEvent = displayCategory.events[renderIndex] ?? displayCategory.events[0];

  const navigate = (direction: -1 | 1) => {
    const nextIndex = (activeEventIndex + direction + eventCount) % eventCount;
    onActiveEventIndexChange(nextIndex);
  };

  return (
    <div className='slider'>
      <div
        className={`slider__viewport ${
          isCategoryAnimating ? 'slider__viewport--category-fade' : ''
        }`}
      >
        <article
          className={`list__item ${
            isSlideVisible ? 'list__item--visible' : 'list__item--hidden'
          }`}
        >
          <h2 className='list__title'>{currentEvent.year}</h2>
          <p className='list__text'>{currentEvent.text}</p>
        </article>
      </div>

      <div className='slider__pagination' aria-label='Факты по годам'>
        {activeCategory.events.map((item, index) => (
          <button
            key={`${activeCategoryId}-${item.year}-${index}`}
            type='button'
            className={`slider__dot ${
              index === activeEventIndex ? 'slider__dot--active' : ''
            }`}
            onClick={() => onActiveEventIndexChange(index)}
            aria-label={`${item.year} год, факт ${index + 1} из ${eventCount}`}
            aria-current={index === activeEventIndex ? 'true' : undefined}
          />
        ))}
      </div>

      <div className='slider__buttons'>
        <button
          className='slider__button slider__button--prev'
          onClick={() => navigate(-1)}
          aria-label='Предыдущая дата'
          title='Предыдущая дата'
        >
          <SlideButton />
        </button>

        <button
          className='slider__button slider__button--next'
          onClick={() => navigate(1)}
          aria-label='Следующая дата'
          title='Следующая дата'
        >
          <SlideButton />
        </button>
      </div>
    </div>
  );
};

export default SwiperDatesList;
