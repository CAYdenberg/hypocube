import interpolate from 'color-interpolate';
import { Dataseries, Point } from '..';
import { Contextual, ChartStyleFunction } from '../types';

export const list = <T>(
  length: number,
  getValue: (index: number) => T
): Array<T> => Array.from({ length }, (_, i) => getValue(i));

const isDataseries = (input: Point[] | Dataseries[]): input is Dataseries[] => {
  if (!input.length) return false;
  if ((input[0] as Dataseries).data) return true;
  return false;
};

export const flatten = (series: Dataseries[] | Point[]) => {
  if (!isDataseries(series)) return series;
  return series.reduce((acc, series) => acc.concat(series.data), [] as Point[]);
};

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
  numSeries: number
): string[] => {
  const map = interpolate(palette);
  return Array.from({ length: numSeries }, (_, i) => map(i / (numSeries - 1)));
};
