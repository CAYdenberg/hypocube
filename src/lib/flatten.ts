import { Point } from '../types';

export const flatten = (series: Point[][]) => {
  return series.reduce((acc, series) => acc.concat(series), [] as Point[]);
};

interface ExtractedPoint {
  seriesIndex: number;
  pointIndex: number;
  point: Point;
}

export const extractFromFlat = (
  series: Point[][],
  indexInFlat: number,
  seriesIndex = 0
): ExtractedPoint | null => {
  const [head, ...tail] = series;
  if (indexInFlat < head.length) {
    return {
      seriesIndex,
      pointIndex: indexInFlat,
      point: head[indexInFlat],
    };
  }
  if (!tail.length) return null;
  return extractFromFlat(tail, indexInFlat - head.length, seriesIndex + 1);
};
