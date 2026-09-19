import React from 'react';

interface Props {
  isPlaying: boolean;
  color?: string;
}

const PlayPauseIcon: React.FC<Props> = ({ isPlaying, color = '#42567A' }) => {
  if (isPlaying) {
    return (
      <svg width='12' height='14' viewBox='0 0 12 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='0' y='0' width='4' height='14' rx='1' fill={color} />
        <rect x='8' y='0' width='4' height='14' rx='1' fill={color} />
      </svg>
    );
  }

  return (
    <svg width='12' height='14' viewBox='0 0 12 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M11 6.13397C11.6667 6.51888 11.6667 7.48112 11 7.86603L1.5 13.3301C0.833334 13.715 0 13.2339 0 12.4641L0 1.53590C0 0.766117 0.833333 0.284993 1.5 0.669882L11 6.13397Z' fill={color} />
    </svg>
  );
};

export default PlayPauseIcon;
