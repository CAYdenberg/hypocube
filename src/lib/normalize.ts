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
      view: chartState.cartesianBox,
    });
  }
  return safeProp;
};

/**
 * This constructs an "infinite array" of items that repeat over and over again,
 * and can be accessed by index. For example if passed ['pizza', 'sauce'], will
 * construct a function that returns 'pizza' when called with 0, 2, 4, etc.., and
 * 'sauce' when called with 1, 3, 5, etc.. If passed a single item will contruct
 * a function that always returns that item.
 */
export const arrayRepeater = <T>(from: T | Array<T>) => (i: number): T => {
  if (Array.isArray(from)) {
    return from[i % from.length];
  }
  return from;
};
