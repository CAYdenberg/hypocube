import interpolate from 'color-interpolate';
import { Contextual, ContextualStylesFunctionArguments } from '../types';

export const list = <T>(
  length: number,
  getValue: (index: number) => T
): Array<T> => Array.from({ length }, (_, i) => getValue(i));

export const getBarOffsets = (
  stepSize: Contextual<number>,
  numSeries: number
): Array<Contextual<number>> => {
  if (numSeries === 0) {
    return [];
  }
  const getValue =
    typeof stepSize === 'number'
      ? (index: number) => (numSeries - 1) * stepSize * -0.5 + stepSize * index
      : (index: number) => (pxBox: ContextualStylesFunctionArguments) =>
          (numSeries - 1) * stepSize(pxBox) * -0.5 + stepSize(pxBox) * index;

  return list(numSeries, getValue as any);
};

export const getColors = (
  palette: string[],
  numSeries: number,
  interpolator: typeof interpolate = interpolate
): string[] => {
  const map = interpolator(palette);
  return Array.from({ length: numSeries }, (_, i) => map(i / (numSeries - 1)));
};
