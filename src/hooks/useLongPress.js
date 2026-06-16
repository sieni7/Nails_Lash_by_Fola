import { useCallback, useRef } from 'react';

const useLongPress = (onLongPress, onClick, { delay = 500 } = {}) => {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const start = useCallback((e) => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress(e);
      // Vibration haptique
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    }, delay);
  }, [onLongPress, delay]);

  const end = useCallback((e) => {
    clearTimeout(timerRef.current);
    if (!isLongPress.current) {
      onClick(e);
    }
  }, [onClick]);

  return {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: end,
    onTouchStart: start,
    onTouchEnd: end,
  };
};

export default useLongPress;
