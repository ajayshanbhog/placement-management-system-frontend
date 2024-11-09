import React, { useState, useEffect } from 'react';

const TypingErasingEffect = ({ text, speed = 100, eraseSpeed = 50, delay = 1000 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isErasing, setIsErasing] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (index < text.length && !isErasing) {
      // Typing phase
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed);
    } else if (index === text.length && !isErasing) {
      // After typing is complete, wait before erasing
      timeout = setTimeout(() => {
        setIsErasing(true);
      }, delay);
    } else if (index > 0 && isErasing) {
      // Erasing phase
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setIndex(index - 1);
      }, eraseSpeed);
    } else if (index === 0 && isErasing) {
      // After erasing is complete, start typing again
      timeout = setTimeout(() => {
        setIsErasing(false);
      }, delay);
    }

    return () => clearTimeout(timeout); // Cleanup timeout on re-render
  }, [index, isErasing, text, speed, eraseSpeed, delay]);

  return <div>{displayedText}</div>;
};

export default TypingErasingEffect;

