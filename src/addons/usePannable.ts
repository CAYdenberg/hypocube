import { easeCubicOut } from 'd3-ease';
import { create } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import Viewbox, {
  bound,
  constrainZoom,
  createViewbox,
  ViewboxDuck,
} from '../lib/Viewbox';
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

const makeAnimation = (current: Viewbox, next: Viewbox, options: Options) => {
  const { animationDuration, animationStepFunction } = options;
  return {
    duration: animationDuration,
    step: (progress: number) =>
      current.interpolate(next, animationStepFunction(progress)),
  };
};

const applyConstaints = (current: Viewbox, next: Viewbox, options: Options) => {
  const { bounds, maxZoomX, maxZoomY } = options;

  const bounded = bound(next, bounds);
  const constained = constrainZoom(bounded, {
    maxZoomX,
    maxZoomY,
  });
  return constained;
};

export default (
  initialViewbox: ViewboxDuck,
  options: Partial<Options> = {}
) => {
  const _initialViewbox = createViewbox(initialViewbox);
  const _options: Options = useMemo(() => ({ ...defaultOptions, ...options }), [
    options,
  ]);
  const _bounds = _options.bounds && createViewbox(_options.bounds);

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

      const next = applyConstaints(state, data.next, _options);

      if (data.intent === GestureIntent.Swipe) {
        dispatch(makeAnimation(state, next, _options));
      } else {
        dispatch(next);
      }
    },
    [dispatch, _options]
  );

  const scrollToView = useCallback(
    (view: ViewboxDuck) => {
      const _v = createViewbox(view);
      const next = applyConstaints(state, _v, _options);
      dispatch(makeAnimation(state, next, _options));
    },
    [dispatch, _options]
  );

  const can = {
    zoomIn: state.width > _options.maxZoomX || state.height > _options.maxZoomY,
    zoomOut:
      !_bounds || state.width < _bounds.width || state.height < _bounds.height,
    panUp: !_bounds || state.yMax < _bounds.yMax,
    panRight: !_bounds || state.xMax < _bounds.xMax,
    panDown: !_bounds || state.yMin > _bounds.yMin,
    panLeft: !_bounds || state.xMin > _bounds.xMin,
  };

  return {
    view: state,
    setView: dispatch,
    scrollToView,
    onGesture,
    isPanning: isGesturing || isAnimating,
    can,
  };
};
