import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, WheelEvent } from 'react';
import {
  events,
  getCategoryById,
  getCategoryIndex,
  getNeighborCategory,
} from '@src/utils/consts';
import CountYear from './CountYear';

interface Props {
  activeCategoryId: number;
  onChangeCategory: (id: number) => void;
  centerYear: number;
}

const TARGET_ANGLE = 30;

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

function CirclePoints({
  activeCategoryId,
  onChangeCategory,
  centerYear,
}: Props) {
  const activeCategory = getCategoryById(activeCategoryId);
  const [isDragging, setIsDragging] = useState(false);
  const skipClickRef = useRef(false);

  const circleRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startAngle: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);
  const wheelLockRef = useRef(false);
  const wheelUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const activeIndex = getCategoryIndex(activeCategoryId);
  const step = 360 / events.length;
  const rotationOffsetRef = useRef(TARGET_ANGLE - activeIndex * step);
  const prevIndexRef = useRef(activeIndex);
  const dragDeltaRef = useRef(0);

  useLayoutEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.setProperty(
      '--rotation-offset',
      `${rotationOffsetRef.current}deg`,
    );
    circle.style.setProperty('--drag-delta', '0deg');
  }, []);

  useLayoutEffect(() => {
    const prevIndex = prevIndexRef.current;
    if (prevIndex === activeIndex) return;

    const count = events.length;
    let indexDelta = activeIndex - prevIndex;
    while (indexDelta > count / 2) indexDelta -= count;
    while (indexDelta < -count / 2) indexDelta += count;

    rotationOffsetRef.current -= indexDelta * step;
    prevIndexRef.current = activeIndex;
    circleRef.current?.style.setProperty(
      '--rotation-offset',
      `${rotationOffsetRef.current}deg`,
    );
  }, [activeIndex, step]);

  useEffect(() => {
    return () => {
      if (wheelUnlockTimerRef.current) {
        clearTimeout(wheelUnlockTimerRef.current);
      }
    };
  }, []);

  const changeByStep = (direction: 1 | -1) => {
    onChangeCategory(getNeighborCategory(activeCategoryId, direction).id);
  };

  const releaseCapture = (pointerId: number) => {
    const circle = circleRef.current;
    if (circle?.hasPointerCapture(pointerId)) {
      circle.releasePointerCapture(pointerId);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    skipClickRef.current = false;

    const circle = circleRef.current;
    const rect = circle?.getBoundingClientRect();
    if (!circle || !rect) return;

    const isPoint =
      event.target instanceof Element &&
      Boolean(event.target.closest('.main__point'));

    if (isPoint) return;

    event.preventDefault();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = getPointerAngle(
      event.clientX,
      event.clientY,
      centerX,
      centerY,
    );

    dragState.current = {
      startAngle,
      moved: false,
      pointerId: event.pointerId,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;

    const circle = circleRef.current;
    const rect = circle?.getBoundingClientRect();
    if (!circle || !rect) return;

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
      if (!dragState.current.moved) {
        dragState.current.moved = true;
        setIsDragging(true);
        circle.setPointerCapture(event.pointerId);
      }
    }

    if (dragState.current.moved) {
      dragDeltaRef.current = delta;
      circle.style.setProperty('--drag-delta', `${delta}deg`);
    }
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;

    releaseCapture(event.pointerId);

    if (dragState.current.moved) {
      skipClickRef.current = true;
      const rotationWithDrag = rotationOffsetRef.current + dragDeltaRef.current;
      let closestIndex = activeIndex;
      let closestDiff = Infinity;

      events.forEach((_, index) => {
        const absoluteAngle =
          (step * index + rotationWithDrag + 360 * 10) % 360;
        let diff = Math.abs(absoluteAngle - TARGET_ANGLE);
        if (diff > 180) diff = 360 - diff;

        if (diff < closestDiff) {
          closestDiff = diff;
          closestIndex = index;
        }
      });

      const closest = events[closestIndex];
      if (closest) {
        onChangeCategory(closest.id);
      }
    }

    dragState.current = null;
    dragDeltaRef.current = 0;
    circleRef.current?.style.setProperty('--drag-delta', '0deg');
    setIsDragging(false);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (wheelLockRef.current) return;
    if (Math.abs(event.deltaY) < 8) return;

    wheelLockRef.current = true;
    changeByStep(event.deltaY > 0 ? 1 : -1);

    wheelUnlockTimerRef.current = setTimeout(() => {
      wheelLockRef.current = false;
      wheelUnlockTimerRef.current = null;
    }, 450);
  };

  const handlePointClick = (id: number) => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }
    onChangeCategory(id);
  };

  return (
    <div className="main__circle-stage">
      <span
        key={activeCategory.title}
        className="main__point-text"
        aria-hidden="true"
      >
        {activeCategory.title}
      </span>
      <span className="visually-hidden" aria-live="polite">
        {`Выбрана категория: ${activeCategory.title}`}
      </span>
      <div
        ref={circleRef}
        className={`main__wheel ${isDragging ? 'main__wheel--dragging' : ''}`}
        role="group"
        aria-label="Колесо категорий. Колесо мыши или перетаскивание переключают категорию"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onWheel={handleWheel}
      >
        <span className="main__circle-year" aria-hidden="true">
          <CountYear value={centerYear} />
        </span>
        <span className="visually-hidden" aria-live="polite">
          {`Текущая дата: ${centerYear}`}
        </span>
        {events.map((point, index) => {
          const isActive = activeCategoryId === point.id;

          return (
            <button
              key={point.id}
              type="button"
              className={`main__point main__point--orbital ${isActive ? 'main__point--active' : ''}`}
              style={
                {
                  '--base-angle': `${step * index}deg`,
                  '--point-color': point.color,
                } as CSSProperties
              }
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => handlePointClick(point.id)}
              aria-pressed={isActive}
              aria-label={`Категория «${point.title}»`}
            >
              {!isActive && (
                <span className="main__point-tooltip" role="tooltip">
                  {point.title}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CirclePoints;
