import React from 'react';
import PlayPauseIcon from '../SVG/PlayPauseIcon';

interface Props {
  isPlaying: boolean;
  onToggle: () => void;
}

const AutoplayButton: React.FC<Props> = ({ isPlaying, onToggle }) => {
  return (
    <button
      className='autoplay-button'
      onClick={onToggle}
      aria-label={isPlaying ? 'Поставить автопрокрутку на паузу' : 'Запустить автопрокрутку'}
      aria-pressed={isPlaying}
      title={isPlaying ? 'Пауза' : 'Автопрокрутка'}
    >
      <PlayPauseIcon isPlaying={isPlaying} />
    </button>
  );
};

export default AutoplayButton;
