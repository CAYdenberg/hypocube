import { easeCubicOut } from 'd3-ease';
import { useCallback, useMemo, useState } from 'react';
import Viewbox, { bound, createViewbox, ViewboxDuck } from '../lib/Viewbox';
import { ChartGestureData, GestureIntent, GesturePhase } from '../types';
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
  const { animationDuration, animationStepFunction, bounds } = options;

  const next = bound(data.next, bounds);

  if (data.intent === GestureIntent.Swipe) {
    return {
      duration: animationDuration,
      step: (progress: number) =>
        current.interpolate(next, animationStepFunction(progress)),
    };
  }
  return next;
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

  const [state, dispatch, isAnimating] = useTransition<Viewbox>(
    _initialViewbox
  );
  const [isGesturing, setIsGesturing] = useState(false);

  const onGesture = useCallback(
    (data: ChartGestureData) => {
      if (data.phase === GesturePhase.Start) {
        setIsGesturing(true);
      } else if (data.phase === GesturePhase.End) {
        setIsGesturing(false);
      }

      const command = interpreter(state, data);
      dispatch(command);
    },
    [dispatch, interpreter]
  );

  return {
    state,
    onGesture,
    isPanning: isGesturing || isAnimating,
  };
};
