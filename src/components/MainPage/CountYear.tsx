import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;    
  duration?: number; 
}

const CountYear: React.FC<AnimatedNumberProps> = ({ value, duration = 500 }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let start = display;
    let end = value;
    if (start === end) return;

    const diff = end - start;
    const stepTime = 16;
    const steps = Math.ceil(duration / stepTime);
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newValue = Math.round(start + (diff * currentStep) / steps);
      setDisplay(newValue);
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [value, duration]);

  return <span>{display}</span>;
};

export default CountYear;
