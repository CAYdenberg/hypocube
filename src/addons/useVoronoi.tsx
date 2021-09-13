import { Delaunay } from 'd3-delaunay';
import { useCallback, useEffect, useState } from 'react';
import { Point, Dataseries, ChartEventHandler } from '../types';

export const flatten = (series: Dataseries[]) => {
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

const useVoronoi = (
  series: Dataseries[],
  callback: ChartEventHandler,
  timeout?: number
): ChartEventHandler => {
  const [voronoi, setVoronoi] = useState<Delaunay<Point> | null>(null);

  useEffect(() => {
    // the current Voronoi is now obsolete, clear it.
    setVoronoi(null);

    // make sure this is a browser environment with the support we need.
    // Do not run in canvas mode as nothing will render.
    if (!window || !window.requestIdleCallback) {
      return;
    }

    const handle = window.requestIdleCallback(
      () => {
        setVoronoi(Delaunay.from(flatten(series)));
      },
      typeof timeout !== 'undefined' ? { timeout } : undefined
    );

    return () => {
      // any queued callbacks are now waiting to run on obsolete data, clear them.
      window?.cancelIdleCallback && window.cancelIdleCallback(handle);
    };
  }, [series, timeout]);

  const handler: ChartEventHandler = useCallback(
    (data) => {
      if (!voronoi) {
        return data;
      }

      // get the elementPosition and meta data about the point nearest the
      // pointer position by refering to the Voronoi diagram
      const convolvedIndex = voronoi.find(...data.pointerPosition);
      const extractedPoint = extractFromFlat(series, convolvedIndex);
      if (!extractedPoint) {
        return null;
      }

      return callback({
        ...data,
        elementPosition: extractedPoint.point,
        meta: series[extractedPoint.seriesIndex]?.meta || {},
      });
    },
    [callback, series, voronoi]
  );

  return handler;
};

export default useVoronoi;
