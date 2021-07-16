import { Delaunay } from 'd3-delaunay';
import React, { useEffect, useState } from 'react';
import { extractFromFlat, flatten } from '../../lib/voronoi';
import { normalize } from '../../lib/normalize';
import useHandle from '../../lib/useHandle';
import { createViewbox, ViewboxDuck } from '../../lib/Viewbox';
import { ChartEventHandlers, Point, Dataseries } from '../../types';
import useChartState from '../base/ChartState';
import { Line } from '../primitives/Line';

interface Props extends ChartEventHandlers {
  series: Dataseries[];
  bounds?: ViewboxDuck;
  timeout?: number;
}

const VoronoiHandle: React.FC<Props> = ({
  series,
  bounds: boundsProp,
  timeout,
  ...handlers
}) => {
  const [voronoi, setVoronoi] = useState<Delaunay<Point> | null>(null);
  const { isCanvas, cartesianBox } = useChartState();
  const bounds = createViewbox(normalize(boundsProp, cartesianBox));

  useEffect(() => {
    // the current Voronoi is now obsolete, clear it.
    setVoronoi(null);

    // make sure this is a browser environment with the support we need.
    // Do not run in canvas mode as nothing will render.
    if (isCanvas || !window || !window.requestIdleCallback) {
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
  }, [series, isCanvas]);

  const reactHandlers = useHandle({
    ...handlers,
    mapEventData: (rawData) => {
      // this shouldn't actually happen because the element will not render
      // if Voronoi is not set
      if (!voronoi) {
        return rawData;
      }

      // get the elementPosition and meta data about the point nearest the
      // pointer position by refering to the Voronoi diagram
      const convolvedIndex = voronoi.find(...rawData.pointerPosition);
      const extractedPoint = extractFromFlat(series, convolvedIndex);
      if (!extractedPoint || !series[extractedPoint.seriesIndex]) {
        return rawData;
      }

      return {
        ...rawData,
        elementPosition: extractedPoint.point,
        meta: series[extractedPoint.seriesIndex].meta || {},
      };
    },
  });

  if (isCanvas || !voronoi) return null;

  const { xMin, xMax, yMin, yMax } = bounds;
  const path: Point[] = [
    [xMin, yMin],
    [xMax, yMin],
    [xMax, yMax],
    [xMin, yMax],
  ];

  return (
    <g {...reactHandlers}>
      <Line path={path} strokeWidth={0} stroke={null} fill={null} />
    </g>
  );
};

export default VoronoiHandle;
