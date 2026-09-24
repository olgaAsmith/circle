import { getCategoryById, getNeighborCategory } from '@src/utils/consts';
import SlideButton from '../SVG/SlideButton';
import AutoplayButton from './AutoplayButton';

interface Props {
  activeCategoryId: number;
  onChangeCategory: (id: number) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

function Panel({
  activeCategoryId,
  onChangeCategory,
  isAutoPlaying,
  onToggleAutoPlay,
}: Props) {
  const activeCategory = getCategoryById(activeCategoryId);

  const prevCategory = () => {
    onChangeCategory(getNeighborCategory(activeCategoryId, -1).id);
  };

  const nextCategory = () => {
    onChangeCategory(getNeighborCategory(activeCategoryId, 1).id);
  };

  return (
    <div className='panel'>
      <div className='panel__group'>
        <div className='panel__category-nav'>
          <button
            type='button'
            className='icon-button panel__button panel__button--prev'
            onClick={prevCategory}
            aria-label='Предыдущая категория'
            title='Предыдущая категория'
          >
            <SlideButton />
          </button>

          <span className='panel__title'>{activeCategory.title}</span>

          <button
            type='button'
            className='icon-button panel__button panel__button--next'
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
}

export default Panel;
