import { easeCubicOut } from 'd3-ease';
import { useCallback, useMemo } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { ChartGestureData, GestureIntent } from '../types';
import { useTransition } from './useTransition';

interface Options {
  animationDuration: number;
  animationStepFunction: (progress: number) => number;
}

const defaultOptions: Options = {
  animationDuration: 600,
  animationStepFunction: easeCubicOut,
};

const getNextView = (current: Viewbox, next: Viewbox): Viewbox => {
  return next;
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

  const [state, dispatch] = useTransition<Viewbox>(_initialViewbox);

  const onGesture = useCallback(
    (data: ChartGestureData) => {
      const next = getNextView(state, data.next);
      console.log(data);
      if (data.intent === GestureIntent.Swipe) {
        dispatch({
          duration: 600,
          step: (progress: number) =>
            state.interpolate(next, easeCubicOut(progress)),
        });
        return;
      }
      dispatch(next);
    },
    [dispatch]
  );

  console.log('rerender');

  return {
    state,
    onGesture,
  };
};
