import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCategoryById, getEventAt } from '@src/utils/consts';
import SlideButton from '../SVG/SlideButton';

interface Props {
  activeCategoryId: number;
  activeEventIndex: number;
  onActiveEventIndexChange: (index: number) => void;
}

function FactCard({ year, text }: { year: number; text: string }) {
  const textBlockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const measureRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const open = tooltipStyle !== null;

  const hoverCapableRef = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );
  const hideTooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const cancelHideTooltip = () => {
    if (hideTooltipTimerRef.current) {
      clearTimeout(hideTooltipTimerRef.current);
      hideTooltipTimerRef.current = null;
    }
  };

  const scheduleHideTooltip = () => {
    cancelHideTooltip();
    hideTooltipTimerRef.current = setTimeout(() => {
      hideTooltipTimerRef.current = null;
      setTooltipStyle(null);
    }, 140);
  };

  useLayoutEffect(() => {
    const visible = textRef.current;
    const measure = measureRef.current;
    if (!visible || !measure) return;

    const checkOverflow = () => {
      setIsOverflowing(measure.scrollHeight > visible.clientHeight + 1);
    };

    const frame = requestAnimationFrame(checkOverflow);
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(visible);
    observer.observe(measure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text]);

  const readTooltipPosition = () => {
    const block = textBlockRef.current;
    if (!block) return null;
    const rect = block.getBoundingClientRect();
    const width = Math.min(rect.width, 440);
    return {
      top: rect.bottom + 10,
      left: rect.left + rect.width / 2,
      width,
    };
  };

  const showTooltip = () => {
    const next = readTooltipPosition();
    if (next) setTooltipStyle(next);
  };

  const hideTooltip = () => {
    cancelHideTooltip();
    setTooltipStyle(null);
  };

  useEffect(() => {
    if (!open) return;

    const syncPosition = () => {
      const next = readTooltipPosition();
      if (next) setTooltipStyle(next);
    };

    window.addEventListener('scroll', syncPosition, true);
    window.addEventListener('resize', syncPosition);
    return () => {
      window.removeEventListener('scroll', syncPosition, true);
      window.removeEventListener('resize', syncPosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('.list__tooltip')) {
        return;
      }
      cancelHideTooltip();
      setTooltipStyle(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelHideTooltip();
        setTooltipStyle(null);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handlePointerEnter = () => {
    if (!hoverCapableRef.current) return;
    cancelHideTooltip();
    showTooltip();
  };

  const handlePointerLeave = () => {
    if (!hoverCapableRef.current) return;
    scheduleHideTooltip();
  };

  const handleTriggerClick = () => {
    if (hoverCapableRef.current) return;
    if (open) hideTooltip();
    else showTooltip();
  };

  return (
    <article className="list__item">
      <h2 className="list__title">{year}</h2>
      <div ref={textBlockRef} className="list__text-area">
        <div className="list__text-block">
          <p ref={textRef} className="list__text">
            {text}
          </p>
          <p
            ref={measureRef}
            className="list__text list__text--measure"
            aria-hidden="true"
          >
            {text}
          </p>
        </div>
        <div className="list__text-more">
          {isOverflowing && (
            <button
              ref={triggerRef}
              type="button"
              className="list__text-trigger"
              aria-expanded={open}
              aria-controls={tooltipId}
              aria-label="Показать полный текст"
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              onFocus={showTooltip}
              onBlur={() => {
                if (!hoverCapableRef.current) return;
                hideTooltip();
              }}
              onClick={handleTriggerClick}
            >
              <span className="list__text-chevron" aria-hidden="true">
                <SlideButton />
              </span>
            </button>
          )}
        </div>
      </div>
      {tooltipStyle &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className="list__tooltip"
            style={{
              top: tooltipStyle.top,
              left: tooltipStyle.left,
              width: tooltipStyle.width,
            }}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          >
            <div className="list__tooltip-scroll">{text}</div>
          </div>,
          document.body,
        )}
    </article>
  );
}

function SwiperDatesList({
  activeCategoryId,
  activeEventIndex,
  onActiveEventIndexChange,
}: Props) {
  const activeCategory = getCategoryById(activeCategoryId);
  const eventCount = activeCategory.events.length;
  const currentEvent = getEventAt(activeCategory, activeEventIndex);

  const navigate = (direction: -1 | 1) => {
    if (eventCount === 0) return;
    const nextIndex = (activeEventIndex + direction + eventCount) % eventCount;
    onActiveEventIndexChange(nextIndex);
  };

  return (
    <div className="slider">
      <div className="slider__viewport">
        <FactCard
          key={`${activeCategoryId}-${activeEventIndex}`}
          year={currentEvent.year}
          text={currentEvent.text}
        />
      </div>

      <div className="slider__pagination" aria-label="Факты по годам">
        {activeCategory.events.map((item, index) => (
          <button
            key={`${activeCategoryId}-${item.year}-${index}`}
            type="button"
            className={`slider__dot ${
              index === activeEventIndex ? 'slider__dot--active' : ''
            }`}
            onClick={() => onActiveEventIndexChange(index)}
            aria-label={`${item.year} год, факт ${index + 1} из ${eventCount}`}
            aria-current={index === activeEventIndex ? 'true' : undefined}
          />
        ))}
      </div>

      <div className="slider__buttons">
        <button
          type="button"
          className="icon-button slider__button slider__button--prev"
          onClick={() => navigate(-1)}
          aria-label="Предыдущая дата"
          title="Предыдущая дата"
        >
          <SlideButton />
        </button>

        <button
          type="button"
          className="icon-button slider__button slider__button--next"
          onClick={() => navigate(1)}
          aria-label="Следующая дата"
          title="Следующая дата"
        >
          <SlideButton />
        </button>
      </div>
    </div>
  );
}

export default SwiperDatesList;
