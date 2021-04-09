import { useEffect, useRef, useState } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { Animation, GesturePhase, HypocubeGestureData } from '../types';

type HandleGesture = (data: HypocubeGestureData) => Viewbox | Animation;

const isAnimation = (input: Viewbox | Animation): input is Animation =>
  typeof input === 'function';

export default (initialViewbox: ViewboxDuck, handleGesture: HandleGesture) => {
  initialViewbox = createViewbox(initialViewbox);
  const [current, setView] = useState<Viewbox>(initialViewbox);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const timer = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const cancelAnimation = () => {
    if (timer.current) {
      cancelAnimationFrame(timer.current);
    }
    timer.current = null;
    startTime.current = null;
  };

  const onGesture = (data: HypocubeGestureData) => {
    cancelAnimation();

    if (data.phase === GesturePhase.Start) {
      setIsPanning(true);
    } else if (data.phase === GesturePhase.End) {
      setIsPanning(false);
    }

    const nextView = handleGesture(data);

    if (isAnimation(nextView)) {
      const step = (time: number) => {
        if (!startTime.current) {
          startTime.current = time;
        }
        const value = nextView(
          (time - startTime.current) / 1000,
          cancelAnimation
        );
        setView(value);
        if (timer.current) {
          timer.current = requestAnimationFrame(step);
        }
      };
      timer.current = requestAnimationFrame(step);
      return;
    }

    setView(nextView);
  };

  useEffect(() => {
    return cancelAnimation;
  }, []);

  return {
    view: current,
    isPanning,
    onGesture,
  };
};
