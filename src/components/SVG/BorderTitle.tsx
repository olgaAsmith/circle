import React from 'react';

const BorderTitle: React.FC = () => {
  return (
    <svg
      width={5}
      height={120}
      viewBox='0 0 5 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M2.5 0L2.5 120' stroke='url(#paint0_linear)' strokeWidth={5} />
      <defs>
        <linearGradient
          id='paint0_linear'
          x1='3'
          y1='-6'
          x2='3'
          y2='102'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#3877EE' />
          <stop offset='1' stopColor='#EF5DA8' />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BorderTitle;
