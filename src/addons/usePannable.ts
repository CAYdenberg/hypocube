import { easeCubicOut } from 'd3-ease';
import { useCallback, useMemo } from 'react';
import Viewbox, { createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { ChartGestureData, GestureIntent } from '../types';
import { useTransition, ChartAnimation } from './useTransition';

export type InterpretGesture = (
  current: Viewbox,
  data: ChartGestureData
) => Viewbox | ChartAnimation<Viewbox>;

interface Options {
  animationDuration: number;
  animationStepFunction: (progress: number) => number;
  bounds: ViewboxDuck | null;
  edgeLock: Array<'top' | 'right' | 'bottom' | 'left'>;
  maxZoomX: number;
  maxZoomY: number;
}

const defaultOptions: Options = {
  animationDuration: 600,
  animationStepFunction: easeCubicOut,
  bounds: null,
  edgeLock: [],
  maxZoomX: 0,
  maxZoomY: 0,
};

const makeInterpreter = (options: Options): InterpretGesture => (
  current: Viewbox,
  data: ChartGestureData
) => {
  const { animationDuration, animationStepFunction } = options;

  if (data.intent === GestureIntent.Swipe) {
    return {
      duration: animationDuration,
      step: (progress: number) =>
        current.interpolate(data.next, animationStepFunction(progress)),
    };
  }
  return data.next;
};

export default (
  initialViewbox: ViewboxDuck,
  options: Partial<Options> = {}
) => {
  const _initialViewbox = createViewbox(initialViewbox);
  const interpreter: InterpretGesture = useMemo(
    () => makeInterpreter({ ...defaultOptions, ...options }),
    [options]
  );

  const [state, dispatch] = useTransition<Viewbox>(_initialViewbox);

  const onGesture = useCallback(
    (data: ChartGestureData) => {
      const command = interpreter(state, data);
      dispatch(command);
    },
    [dispatch, interpreter]
  );

  return {
    state,
    onGesture,
  };
};
