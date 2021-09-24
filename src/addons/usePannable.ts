import { easeCubicOut } from 'd3-ease';
import { useCallback, useMemo, useRef, useState } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { ChartGestureData, GestureIntent } from '../types';

export interface TransitionAnimation<T> {
  duration: number;
  step: (progress: number) => T;
}

const isTransitionAnimation = (
  input: any
): input is TransitionAnimation<any> => {
  return !!input.duration;
};

export type TransitionReducer<T> = (
  initialState: T,
  action: any
) => T | TransitionAnimation<T>;

export const useTransitionReducer = <T>(
  initialState: T,
  reducer: TransitionReducer<T>,
  ease = easeCubicOut
) => {
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

  const dispatch = useCallback(
    (action: any) => {
      cancelAnimation();

      const result = reducer(currentState, action);

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
          const adjProgress = ease(progress);
          setCurrentState(result.step(adjProgress));
        }

        if (timer.current) {
          timer.current = requestAnimationFrame(step);
        }
      };
      timer.current = requestAnimationFrame(step);
      setIsAnimating(true);
    },
    [currentState, ease, reducer]
  );

  return [currentState, dispatch, isAnimating] as const;
};

interface Options {
  animationDuration: number;
  animationStepFunction: (progress: number) => number;
}

const defaultOptions: Options = {
  animationDuration: 600,
  animationStepFunction: easeCubicOut,
};

const reducer: TransitionReducer<Viewbox> = (
  state: Viewbox,
  action: ChartGestureData
): Viewbox | TransitionAnimation<Viewbox> => {
  switch (action.intent) {
    case GestureIntent.Scroll: {
      return action.next;
      // .bound(_boundingViewbox);
    }
    case GestureIntent.Swipe: {
      return {
        duration: 600,
        step: (progress: number) => state.interpolate(action.next, progress),
      };
    }
    case GestureIntent.Zoom: {
      return action.next;
    }
  }
  return state;
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

  const [state, dispatch] = useTransitionReducer<Viewbox>(
    _initialViewbox,
    reducer
  );

  const onGesture = useCallback(
    (data: ChartGestureData) => {
      dispatch(data);
    },
    [dispatch]
  );

  return {
    state,
    onGesture,
  };
};
