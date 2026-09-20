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

  const activeCategory = events[activeIndex] ?? events[0];

  return (
    <div className='panel'>
      <div className='panel__group'>
        <div className='panel__category-nav'>
          <button
            className='panel__button panel__button--prev'
            onClick={prevCategory}
            aria-label='Предыдущая категория'
            title='Предыдущая категория'
          >
            <SlideButton />
          </button>

          <span className='panel__title'>{activeCategory.title}</span>

          <button
            className='panel__button panel__button--next'
            onClick={nextCategory}
            aria-label='Следующая категория'
            title='Следующая категория'
          >
            <SlideButton />
          </button>
        </div>

        <AutoplayButton isPlaying={isAutoPlaying} onToggle={onToggleAutoPlay} />
      </div>
    </div>
  );
};

export default Panel;
