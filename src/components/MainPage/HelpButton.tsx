import { useEffect, useId, useRef, useState } from 'react';

function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className='help'>
      <button
        type='button'
        className='help__trigger'
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup='dialog'
        aria-controls={isOpen ? 'help-dialog' : undefined}
        title='Справка'
        aria-label='Открыть справку'
      >
        ?
      </button>

      {isOpen && (
        <>
          <button
            type='button'
            className='help__backdrop'
            aria-label='Закрыть справку'
            onClick={() => setIsOpen(false)}
          />
          <div
            id='help-dialog'
            className='help__panel'
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
          >
            <h2 className='help__title' id={titleId}>Справка</h2>
            <p className='help__lead'>
              «Исторические даты» — интерактивный обзор событий истории России и
              СССР по темам: наука, литература, физика, химия, технологии и
              культура.
            </p>
            <ul className='help__list'>
              <li>
                <strong>Категории</strong> — переключение стрелки в панели, клавиши ↑ и ↓,
                колесо мыши на круге, перетаскивание круга или клик по точке на
                окружности.
              </li>
              <li>
                <strong>Факты по годам</strong> — стрелки под текстом, переключение клавиши ←
                и →.
              </li>
              <li>
                Кнопка воспроизведения включает и останавливает автопрокрутку
                фактов.
              </li>
            </ul>
            <button
              ref={closeButtonRef}
              type='button'
              className='help__close'
              onClick={() => setIsOpen(false)}
            >
              Понятно
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default HelpButton;
