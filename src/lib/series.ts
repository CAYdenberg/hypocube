import { Dataseries, Point } from '../types';

interface ExtractedPoint {
  seriesIndex: number;
  seriesKey: string;
  pointIndex: number;
  point: Point;
}

export const extractFromFlat = (
  series: Dataseries[],
  indexInFlat: number,
  seriesIndex = 0
): ExtractedPoint | null => {
  const [head, ...tail] = series;
  if (indexInFlat < head.data.length) {
    return {
      seriesIndex,
      seriesKey: head.key,
      pointIndex: indexInFlat,
      point: head.data[indexInFlat],
    };
  }
  if (!tail.length) return null;
  return extractFromFlat(tail, indexInFlat - head.data.length, seriesIndex + 1);
};
