import { easeCubicOut } from 'd3-ease';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';

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

  const timer = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const cancelAnimation = () => {
    timer.current = null;
    startTime.current = null;
    if (timer.current) {
      cancelAnimationFrame(timer.current);
    }
  };

  const setViewBounded = useCallback(
    (nextView: ViewboxDuck) => {
      const _nextView = createViewbox(nextView);
      setView(_nextView.bound(_boundingViewbox));
    },
    // viewboxes use a hash to optimize re-rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_boundingViewbox.hash]
  );

  const scrollToView = useCallback(
    (nextView: ViewboxDuck) => {
      const _nextView = createViewbox(nextView);

      cancelAnimation();

      const step = (time: number) => {
        if (!startTime.current) {
          startTime.current = time;
        }
        const progress =
          (time - startTime.current) / _options.animationDuration;

        if (progress > 1) {
          cancelAnimation();
          setView(_nextView);
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

  return [currentView, setViewBounded, scrollToView] as const;
};
