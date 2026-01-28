import React, { useEffect, useState } from 'react';

interface Props {
  title: string;
}

const MobTitle: React.FC<Props> = ({ title }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  useEffect(() => {
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setCurrentTitle(title);
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [title]);

  return (
    <div className={`mob-ver ${isAnimating ? 'mob-ver--fade' : ''}`}>
      <h2 className='mob-ver__title'>{currentTitle}</h2>
    </div>
  );
};

export default MobTitle;
