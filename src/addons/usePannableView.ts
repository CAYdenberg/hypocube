import { useEffect, useRef, useState } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { ChartAnimation, GesturePhase, ChartGestureData } from '../types';

type HandleGesture = (data: ChartGestureData) => Viewbox | ChartAnimation;

const isChartAnimation = (
  input: Viewbox | ChartAnimation
): input is ChartAnimation => !!(input as ChartAnimation).step;

export default (initialViewbox: ViewboxDuck, handleGesture: HandleGesture) => {
  initialViewbox = createViewbox(initialViewbox);
  const [current, setView] = useState<Viewbox>(initialViewbox);
  const [isGesturing, setIsGesturing] = useState<boolean>(false);

  const timer = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const cancelChartAnimation = () => {
    timer.current = null;
    startTime.current = null;
    if (timer.current) {
      cancelAnimationFrame(timer.current);
    }
  };

  const onGesture = (data: ChartGestureData) => {
    cancelChartAnimation();

    const nextView = handleGesture(data);

    if (data.phase === GesturePhase.Start) {
      setIsGesturing(true);
    } else if (data.phase === GesturePhase.End) {
      setIsGesturing(false);
    }

    if (isChartAnimation(nextView)) {
      const step = (time: number) => {
        if (!startTime.current) {
          startTime.current = time;
        }
        const progress = (time - startTime.current) / nextView.duration;

        if (progress > 1) {
          cancelChartAnimation();
          setView(nextView.step(1));
        } else {
          setView(nextView.step(progress));
        }

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
    isPanning: isGesturing || !!startTime.current,
    onGesture,
  };
};
