import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Category } from '@src/utils/consts';
import SlideButton from '../SVG/SlideButton';

interface Props {
  activeCategoryId: number;
  events: Category[];
}

const SwiperDatesList: React.FC<Props> = ({ activeCategoryId, events }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
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
      swiperRef.current?.slideTo(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, displayCategory]);

  if (!displayCategory) return null;

  return (
    <div className='slider'>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        breakpoints={{
          0: { slidesPerView: 1.65, spaceBetween: 25 },
          768: { slidesPerView: 2.4, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 80 },
        }}
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
        {!isBeginning && (
          <button
            className='slider__button slider__button--prev'
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label='Предыдущий слайд'
            title='Предыдущий слайд'
          >
            <SlideButton color='#3877EE' />
          </button>
        )}

        {!isEnd && (
          <button
            className='slider__button slider__button--next'
            onClick={() => swiperRef.current?.slideNext()}
            aria-label='Следующий слайд'
            title='Следующий слайд'
          >
            <SlideButton color='#3877EE' />
          </button>
        )}
      </div>
    </div>
  );
};

export default SwiperDatesList;
