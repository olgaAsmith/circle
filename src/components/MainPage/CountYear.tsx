import { useLayoutEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

function CountYear({ value, duration = 500 }: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const displayRef = useRef(value);

  useLayoutEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const start = displayRef.current;
    const end = value;
    if (start === end) {
      el.textContent = String(end);
      return;
    }

    const diff = end - start;
    const stepTime = 16;
    const steps = Math.max(1, Math.ceil(duration / stepTime));
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newValue = Math.round(start + (diff * currentStep) / steps);
      displayRef.current = newValue;
      el.textContent = String(newValue);
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [value, duration]);

  return <span ref={spanRef} />;
}

export default CountYear;
