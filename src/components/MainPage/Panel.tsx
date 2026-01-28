import React from 'react';
import { Category } from '../../utils/consts';
import SlideButton from '../SVG/SlideButton';

interface Props {
  activeCategoryId: number;
  onChangeCategory: (id: number) => void;
  events: Category[];
}

const Panel: React.FC<Props> = ({
  activeCategoryId,
  onChangeCategory,
  events,
}) => {
  const activeIndex = events.findIndex((event) => event.id === activeCategoryId);

  const prevCategory = () => {
    if (activeIndex > 0) {
      onChangeCategory(events[activeIndex - 1].id);
    }
  };

  const nextCategory = () => {
    if (activeIndex < events.length - 1) {
      onChangeCategory(events[activeIndex + 1].id);
    }
  };

  const formatNumber = (num: number) => (num + 1).toString().padStart(2, '0');

  return (
    <div className='panel'>
      <div className='panel__nav'>
        <span className='panel__info'>
          {formatNumber(activeIndex)}/{formatNumber(events.length - 1)}
        </span>

        <div className='panel__buttons'>
          <button
            className='panel__button panel__button--prev'
            onClick={prevCategory}
            disabled={activeIndex === 0}
            aria-label='Предыдущая категория'
            title='Предыдущая категория'
          >
            <SlideButton />
          </button>

          <button
            className='panel__button panel__button--next'
            onClick={nextCategory}
            disabled={activeIndex === events.length - 1}
            aria-label='Следующая категория'
            title='Следующая категория'
          >
            <SlideButton />
          </button>
        </div>
      </div>
      <div className='panel__pagination'>
        {events.map((item, index) => (
          <button
            key={item.id}
            className={`panel__dot ${
              index === activeIndex ? 'panel__dot--active' : ''
            }`}
            onClick={() => onChangeCategory(item.id)}
            aria-label={`Категория ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Panel;
