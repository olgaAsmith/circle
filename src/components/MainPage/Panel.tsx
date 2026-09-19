import React from 'react';
import { Category } from '../../utils/consts';
import SlideButton from '../SVG/SlideButton';
import AutoplayButton from './AutoplayButton';

interface Props {
  activeCategoryId: number;
  onChangeCategory: (id: number) => void;
  events: Category[];
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

const Panel: React.FC<Props> = ({
  activeCategoryId,
  onChangeCategory,
  events,
  isAutoPlaying,
  onToggleAutoPlay,
}) => {
  const activeIndex = events.findIndex((event) => event.id === activeCategoryId);

  const prevCategory = () => {
    if (activeIndex === -1) return;
    const prevIndex = (activeIndex - 1 + events.length) % events.length;
    onChangeCategory(events[prevIndex].id);
  };

  const nextCategory = () => {
    if (activeIndex === -1) return;
    const nextIndex = (activeIndex + 1) % events.length;
    onChangeCategory(events[nextIndex].id);
  };

  return (
    <div className='panel'>
      <div className='panel__group'>
        <span className='panel__label'>Сменить категорию</span>

        <div className='panel__actions'>
          <button
            className='panel__button panel__button--prev'
            onClick={prevCategory}
            aria-label='Предыдущая категория'
            title='Предыдущая категория'
          >
            <SlideButton />
          </button>

          <button
            className='panel__button panel__button--next'
            onClick={nextCategory}
            aria-label='Следующая категория'
            title='Следующая категория'
          >
            <SlideButton />
          </button>

          <AutoplayButton isPlaying={isAutoPlaying} onToggle={onToggleAutoPlay} />
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
