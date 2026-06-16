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

  const end = useCallback((e, shouldTriggerClick = true) => {
    clearTimeout(timerRef.current);
    if (shouldTriggerClick && !isLongPress.current) {
      onClick(e);
    }
  }, [onClick]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: (e) => end(e, true),
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: (e) => end(e, true),
  };
};

export default useLongPress;
