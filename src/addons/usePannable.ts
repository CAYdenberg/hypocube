import { easeCubicOut } from 'd3-ease';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { ChartGestureData, GestureKind, GesturePhase } from '../types';

export interface ChartAnimation {
  duration: number;
  step: (progress: number) => Viewbox;
}

interface Options {
  animationDuration: number;
  animationStepFunction: (progress: number) => number;
}

const defaultOptions: Options = {
  animationDuration: 600,
  animationStepFunction: easeCubicOut,
};

export default (
  initialViewbox: ViewboxDuck,
  boundingViewbox: ViewboxDuck,
  options?: Partial<Options>
) => {
  const _initialViewbox = createViewbox(initialViewbox);
  const _boundingViewbox = createViewbox(boundingViewbox);
  const _options: Options = useMemo(() => {
    return options
      ? {
          ...defaultOptions,
          ...options,
        }
      : defaultOptions;
  }, [options]);

  const [currentView, setView] = useState<Viewbox>(_initialViewbox);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const timer = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const cancelAnimation = () => {
    timer.current = null;
    startTime.current = null;
    setIsPanning(false);
    if (timer.current) {
      cancelAnimationFrame(timer.current);
    }
  };

  const setViewBounded = useCallback(
    (nextView: ViewboxDuck) => {
      cancelAnimation();
      const _nextView = createViewbox(nextView);
      setView(_nextView.bound(_boundingViewbox));
    },
    // viewboxes use a hash to optimize re-rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_boundingViewbox.hash]
  );

  const scrollToView = useCallback(
    (nextView: ViewboxDuck) => {
      cancelAnimation();
      setIsPanning(true);

      const _nextView = createViewbox(nextView);
      const step = (time: number) => {
        if (!startTime.current) {
          startTime.current = time;
          timer.current = requestAnimationFrame(step);
          return;
        }

        const progress =
          (time - startTime.current) / _options.animationDuration;

        if (progress > 1) {
          const finalView = _nextView.bound(_boundingViewbox);
          setView(finalView);
          cancelAnimation();
        } else {
          const adjProgress = _options.animationStepFunction(progress);
          const stepView = currentView
            .interpolate(_nextView, adjProgress)
            .bound(_boundingViewbox);
          setView(stepView);
        }

        if (timer.current) {
          timer.current = requestAnimationFrame(step);
        }
      };
      timer.current = requestAnimationFrame(step);
    },
    // viewboxes use a hash to optimize re-rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentView.hash, _boundingViewbox.hash, _options]
  );

  useEffect(() => {
    return cancelAnimation;
  }, []);

  const onGesture = useCallback(
    (data: ChartGestureData) => {
      if (timer.current) {
        return;
      }

      if (data.kind === GestureKind.Swipe) {
        scrollToView(data.nextView);
        return;
      }
      if (data.phase === GesturePhase.Start) {
        setIsPanning(true);
      }
      if (data.phase === GesturePhase.End) {
        setIsPanning(false);
      }
      setViewBounded(data.nextView);
    },
    [setViewBounded, scrollToView]
  );

  return {
    view: currentView,
    isPanning,
    setView: setViewBounded,
    scrollToView,
    onGesture,
  };
};
