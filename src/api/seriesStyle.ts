import interpolate from 'color-interpolate';
import { Dataseries, Point } from '..';
import { flatten } from '../lib/series';
import { Contextual, ChartStyleFunction } from '../types';

export const list = <T>(
  length: number,
  getValue: (index: number) => T
): Array<T> => Array.from({ length }, (_, i) => getValue(i));

export const getSeriesOffsets = (
  stepSize: Contextual<number>,
  numSeries: number
): Array<Contextual<number>> => {
  if (numSeries === 0) {
    return [];
  }
  const getValue =
    typeof stepSize === 'number'
      ? (index: number) => (numSeries - 1) * stepSize * -0.5 + stepSize * index
      : (index: number): ChartStyleFunction<number> => (pxBox) =>
          (numSeries - 1) * stepSize(pxBox) * -0.5 + stepSize(pxBox) * index;

  return list(numSeries, getValue as any);
};

export const getSeriesColors = (
  palette: string[],
  numSeries: number,
  interpolator: typeof interpolate = interpolate
): string[] => {
  const map = interpolator(palette);
  return Array.from({ length: numSeries }, (_, i) => map(i / (numSeries - 1)));
};

export const findExtremes = (data: Point[] | Dataseries[]) => {
  const flat = flatten(data);
  let xMin = flat[0][0];
  let xMax = flat[0][0];
  let yMin = flat[0][1];
  let yMax = flat[0][1];
  flat.forEach((point) => {
    const [x, y] = point;
    if (x < xMin) {
      xMin = x;
    }
    if (x > xMax) {
      xMax = x;
    }
    if (y < yMin) {
      yMin = y;
    }
    if (y > yMax) {
      yMax = y;
    }
  });

  return { xMin, xMax, yMin, yMax };
};
