import { Dataseries, Point } from '../types';

const isDataseries = (input: Point[] | Dataseries[]): input is Dataseries[] => {
  if (!input.length) return false;
  if ((input[0] as Dataseries).data) return true;
  return false;
};

export const flatten = (series: Dataseries[] | Point[]) => {
  if (!isDataseries(series)) return series;
  return series.reduce((acc, series) => acc.concat(series.data), [] as Point[]);
};

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
