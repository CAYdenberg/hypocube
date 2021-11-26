import { Delaunay } from 'd3-delaunay';
import { useCallback, useEffect, useState } from 'react';
import { Point, Dataseries, ChartEventHandler } from '../types';
import { flatten } from './utility';
import { extractFromFlat } from '../lib/series';

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
      if (!voronoi || !data.pointerPosition) {
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
