import { ChartState, Contextual } from '../types';

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
    const safePropF = safeProp as (state: ChartState) => T;
    return safePropF(chartState);
  }
  return safeProp;
};
