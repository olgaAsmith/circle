import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Category } from '@src/utils/consts';
import SlideButton from '../SVG/SlideButton';

interface Props {
  activeCategoryId: number;
  events: Category[];
  activeEventIndex: number;
  onActiveEventIndexChange: (index: number) => void;
}

const SwiperDatesList: React.FC<Props> = ({
  activeCategoryId,
  events,
  activeEventIndex,
  onActiveEventIndexChange,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCategory, setDisplayCategory] = useState<Category | null>(null);

  const activeCategory =
    events.find((event) => event.id === activeCategoryId) ?? null;

  useEffect(() => {
    if (!activeCategory) return;

    if (!displayCategory) {
      setDisplayCategory(activeCategory);
      return;
    }

    if (displayCategory.id === activeCategory.id) return;

    setIsAnimating(true);

    const timer = setTimeout(() => {
      setDisplayCategory(activeCategory);
      setIsAnimating(false);
      swiperRef.current?.slideTo(0, 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, displayCategory]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    if (swiper.activeIndex === activeEventIndex) return;
    swiper.slideTo(activeEventIndex);
  }, [activeEventIndex, displayCategory?.id]);

  if (!displayCategory) return null;

  const eventCount = displayCategory.events.length;

  const navigate = (direction: -1 | 1) => {
    const nextIndex = (activeEventIndex + direction + eventCount) % eventCount;
    onActiveEventIndexChange(nextIndex);
    swiperRef.current?.slideTo(nextIndex);
  };

  return (
    <div className='slider'>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (swiper.activeIndex !== activeEventIndex) {
            swiper.slideTo(activeEventIndex, 0);
          }
        }}
        onSlideChange={(swiper) => {
          onActiveEventIndexChange(swiper.activeIndex);
        }}
        slidesPerView={1}
        spaceBetween={30}
        speed={450}
        tag='ul'
        wrapperTag='ul'
        className={`list ${isAnimating ? 'list--fade' : ''}`}
      >
        {displayCategory.events.map((event) => (
          <SwiperSlide key={event.year} tag='li' className='list__item'>
            <h2 className='list__title'>{event.year}</h2>
            <p className='list__text'>{event.text}</p>
          </SwiperSlide>
        ))}
      </Swiper>

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
