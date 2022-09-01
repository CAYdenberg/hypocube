import { useCallback, useRef, useState } from 'react';
import { ChartAnimation } from '../types';

const isTransitionAnimation = <T>(
  input: ChartAnimation<T> | unknown
): input is ChartAnimation<T> => !!(input as ChartAnimation<T>).duration;

const useTransition = <T>(initialState: T) => {
  const [currentState, setCurrentState] = useState<T>(initialState);
  const [isAnimating, setIsAnimating] = useState(false);

  const timer = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const cancelAnimation = () => {
    if (timer.current) {
      cancelAnimationFrame(timer.current);
    }
    timer.current = null;
    startTime.current = null;
    setIsAnimating(false);
  };

  const setState = useCallback((next: T | ChartAnimation<T>) => {
    cancelAnimation();

    const result = next;

    if (!isTransitionAnimation(result)) {
      setCurrentState(result);
      return;
    }

    const step = (time: number) => {
      if (!startTime.current) {
        startTime.current = time;
        timer.current = requestAnimationFrame(step);
        return;
      }

      const progress = (time - startTime.current) / result.duration;

      if (progress > 1) {
        setCurrentState(result.step(1));
        cancelAnimation();
      } else {
        setCurrentState(result.step(progress));
      }

      if (timer.current) {
        timer.current = requestAnimationFrame(step);
      }
    };
    timer.current = requestAnimationFrame(step);
    setIsAnimating(true);
  }, []);

  return [currentState, setState, isAnimating] as const;
};

export default useTransition;
