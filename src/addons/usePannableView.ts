import { useEffect, useRef, useState } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { ChartAnimation, GesturePhase, ChartGestureData } from '../types';

type HandleGesture = (data: ChartGestureData) => Viewbox | ChartAnimation;

const isChartAnimation = (
  input: Viewbox | ChartAnimation
): input is ChartAnimation => typeof input === 'function';

export default (initialViewbox: ViewboxDuck, handleGesture: HandleGesture) => {
  initialViewbox = createViewbox(initialViewbox);
  const [current, setView] = useState<Viewbox>(initialViewbox);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const timer = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const cancelChartAnimation = () => {
    if (timer.current) {
      cancelAnimationFrame(timer.current);
    }
    timer.current = null;
    startTime.current = null;
  };

  const onGesture = (data: ChartGestureData) => {
    cancelChartAnimation();

    if (data.phase === GesturePhase.Start) {
      setIsPanning(true);
    } else if (data.phase === GesturePhase.End) {
      setIsPanning(false);
    }

    const nextView = handleGesture(data);

    if (isChartAnimation(nextView)) {
      const step = (time: number) => {
        if (!startTime.current) {
          startTime.current = time;
        }
        const value = nextView(
          (time - startTime.current) / 1000,
          cancelChartAnimation
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
    return cancelChartAnimation;
  }, []);

  return {
    view: current,
    isPanning,
    onGesture,
  };
};
