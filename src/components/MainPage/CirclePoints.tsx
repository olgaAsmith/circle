import { Category } from '@src/utils/consts';
import React, { useEffect, useRef, useState } from 'react';
import CountYear from './CountYear';

interface Props {
  activeCategoryId: number;
  onChangeCategory: (id: number) => void;
  points: Category[];
  title: string;
  centerYear: number;
}

const getPointerAngle = (
  clientX: number,
  clientY: number,
  centerX: number,
  centerY: number,
) => {
  const standardAngle =
    (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
  return (standardAngle + 90 + 360) % 360;
};

const CirclePoints: React.FC<Props> = ({
  activeCategoryId,
  onChangeCategory,
  points,
  title,
  centerYear,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);

  const circleRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startAngle: number;
    moved: boolean;
  } | null>(null);
  const wheelLockRef = useRef(false);

  const [orbitRadius, setOrbitRadius] = useState(265);
  const targetAngle = 30;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const updateRadius = () => {
      const size = circle.getBoundingClientRect().width;
      setOrbitRadius(Math.max(0, size / 2 - 1));
    };

    updateRadius();

    const observer = new ResizeObserver(updateRadius);
    observer.observe(circle);

    return () => observer.disconnect();
  }, []);
  const activeIndex = points.findIndex(
    (point) => point.id === activeCategoryId,
  );
  const step = 360 / points.length;

  const prevIndexRef = useRef(activeIndex);
  const [rotationOffset, setRotationOffset] = useState(
    () => targetAngle - activeIndex * step,
  );

  useEffect(() => {
    if (activeIndex === -1) return;

    const prevIndex = prevIndexRef.current;
    if (prevIndex === activeIndex) return;

    const count = points.length;
    let indexDelta = activeIndex - prevIndex;
    while (indexDelta > count / 2) indexDelta -= count;
    while (indexDelta < -count / 2) indexDelta += count;

    setRotationOffset((prev) => prev - indexDelta * step);
    prevIndexRef.current = activeIndex;
  }, [activeIndex, points.length, step]);

  const rotationWithDrag = rotationOffset + dragDelta;

  useEffect(() => {
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setCurrentTitle(title);
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [title]);

  const changeByStep = (direction: 1 | -1) => {
    if (activeIndex === -1) return;
    const nextIndex = (activeIndex + direction + points.length) % points.length;
    onChangeCategory(points[nextIndex].id);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = circleRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = getPointerAngle(
      event.clientX,
      event.clientY,
      centerX,
      centerY,
    );

    dragState.current = { startAngle, moved: false };
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;

    const rect = circleRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = getPointerAngle(
      event.clientX,
      event.clientY,
      centerX,
      centerY,
    );

    let delta = currentAngle - dragState.current.startAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    if (Math.abs(delta) > 2) {
      dragState.current.moved = true;
      setIsDragging(true);
    }

    if (dragState.current.moved) {
      setDragDelta(delta);
    }
  };

  const finishDrag = () => {
    if (!dragState.current) return;

    if (dragState.current.moved) {
      let closestIndex = activeIndex;
      let closestDiff = Infinity;

      points.forEach((_, index) => {
        const absoluteAngle =
          (step * index + rotationWithDrag + 360 * 10) % 360;
        let diff = Math.abs(absoluteAngle - targetAngle);
        if (diff > 180) diff = 360 - diff;

        if (diff < closestDiff) {
          closestDiff = diff;
          closestIndex = index;
        }
      });

      if (points[closestIndex]) {
        onChangeCategory(points[closestIndex].id);
      }
    }

    dragState.current = null;
    setIsDragging(false);
    setDragDelta(0);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (wheelLockRef.current) return;
    if (Math.abs(event.deltaY) < 8) return;

    wheelLockRef.current = true;
    changeByStep(event.deltaY > 0 ? 1 : -1);

    setTimeout(() => {
      wheelLockRef.current = false;
    }, 450);
  };

  const handleCircleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      changeByStep(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      changeByStep(-1);
    }
  };

  const handlePointKeyDown = (
    event: React.KeyboardEvent<HTMLSpanElement>,
    id: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChangeCategory(id);
    }
  };

  return (
    <div>
      <span
        className={`main__point-text ${isAnimating ? 'main__point-text--fade' : ''}`}
        aria-hidden='true'
      >
        {currentTitle}
      </span>
      <span className='visually-hidden' aria-live='polite'>
        {`Выбрана категория: ${currentTitle}`}
      </span>
      <div
        ref={circleRef}
        className={`main__circle main__circle--interactive ${isDragging ? 'main__circle--dragging' : ''}`}
        style={{
          transform: `translate(-50%, -50%)`,
        }}
        role='group'
        aria-label='Колесо категорий. Стрелки вверх и вниз, колесо мыши или перетаскивание переключают категорию'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onWheel={handleWheel}
        onKeyDown={handleCircleKeyDown}
      >
        <span className='main__circle-year' aria-hidden='true'>
          <CountYear value={centerYear} />
        </span>
        <span className='visually-hidden' aria-live='polite'>
          {`Текущая дата: ${centerYear}`}
        </span>
        {points.map((point, index) => {
          const angle = step * index;
          const isActive = activeCategoryId === point.id;

          const absoluteAngle = angle + rotationWithDrag;

          return (
            <span
              key={point.id}
              className={`main__point main__point--orbital ${isActive ? 'main__point--active' : ''}`}
              style={
                {
                  '--angle': `${absoluteAngle}deg`,
                  '--radius': `${orbitRadius}px`,
                  '--point-color': point.color,
                } as React.CSSProperties
              }
              onClick={() => onChangeCategory(point.id)}
              onKeyDown={(event) => handlePointKeyDown(event, point.id)}
              role='button'
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`Категория «${point.title}», ${point.start}\u2013${point.end}`}
            >
              {!isActive && (
                <span className='main__point-tooltip' role='tooltip'>
                  {point.title}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CirclePoints;
