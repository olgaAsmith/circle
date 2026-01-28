import { Category } from '@src/utils/consts';
import React, { useEffect, useState } from 'react';

interface Props {
  activeCategoryId: number;
  onChangeCategory: (id: number) => void;
  points: Category[];
  title: string;
}

const CirclePoints: React.FC<Props> = ({
  activeCategoryId,
  onChangeCategory,
  points,
  title,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const radius = 265;
  const targetAngle = 30;
  const activeIndex = points.findIndex(
    (point) => point.id === activeCategoryId,
  );
  const step = 360 / points.length;
  const activeAngle = activeIndex * step;
  const rotationOffset = targetAngle - activeAngle;

  useEffect(() => {
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setCurrentTitle(title);
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [title]);

  return (
    <div>
      <span
        className={`main__point-text ${isAnimating ? 'main__point-text--fade' : ''}`}
      >
        {currentTitle}
      </span>
      <div
        className='main__circle'
        style={{
          transform: `translate(-50%, -50%)`,
        }}
      >
        {points.map((point, index) => {
          const angle = step * index;
          const isActive = activeCategoryId === point.id;

          const absoluteAngle = angle + rotationOffset;

          return (
            <span
              key={point.id}
              className={`main__point main__point--orbital ${isActive ? 'main__point--active' : ''}`}
              style={
                {
                  '--angle': `${absoluteAngle}deg`,
                  '--radius': `${radius}px`,
                } as React.CSSProperties
              }
              onClick={() => onChangeCategory(point.id)}
            >
              <span
                className={`main__point-id ${isActive ? 'main__point-id--active' : ''}`}
                style={{
                  transform: `translate(-50%, -50%)`,
                }}
              >
                {point.id + 1}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CirclePoints;
