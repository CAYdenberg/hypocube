import { ChartState, ChartStyleFunction, Contextual } from '../types';

export const normalize = <T>(prop: T | undefined, defaultProp: T) => {
  return typeof prop === 'undefined' ? defaultProp : prop;
};

export const contextualize = <T>(
  prop: Contextual<T> | undefined,
  defaultProp: Contextual<T>,
  chartState: ChartState
): T => {
  const safeProp = normalize(prop, defaultProp);
  if (typeof safeProp === 'function') {
    const safePropF = safeProp as ChartStyleFunction<T>;
    return safePropF({
      pxWidth: chartState.pxBox.width,
      pxHeight: chartState.pxBox.height,
    });
  }
  return safeProp;
};
