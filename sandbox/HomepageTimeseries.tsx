import React from 'react';
import { DateTime } from 'luxon';
import {
  Chart,
  XAxis,
  LineSeries,
  GestureKind,
  ChartStyleOptions,
  YAxis,
  createViewbox,
} from '../src';
import applySeriesStyles from '../src/addons/applySeriesStyles';
import usePannableView from '../src/addons/usePannableView';
import timeseriesData, { labels } from './__data__/homepage-1';

const ticks = ({ pxWidth }: { pxWidth: number }) => {
  const interval = pxWidth > 768 ? 6 : 12;
  return labels
    .map((_, i) => (i % interval ? null : i))
    .filter((val) => val !== null) as number[];
};
const getTickLabel = (x: number) => {
  const raw = labels[x];
  const dt = DateTime.fromISO(raw);
  return dt.toLocaleString({ year: 'numeric', month: 'short' });
};

const HomepageTimeseries: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const boundingBox = createViewbox([0, 0, 251, 250]);
  const { view, isPanning, onGesture } = usePannableView(
    [201, 0, 50, 250],
    (data) => {
      if (data.kind === GestureKind.Swipe) {
        return {
          duration: 600,
          step: (progress) => {
            return view
              .interpolate(data.nextView, progress, true)
              .bound(boundingBox);
          },
        };
      }
      return data.nextView.bound(boundingBox);
    }
  );

  return (
    <Chart
      height={300}
      width={300}
      view={view}
      gutter={[5, 20, 50, 50]}
      isCanvas={isCanvas || isPanning}
      chartStyle={{
        dataPointSymbol: 'circle',
        dataLineCurveType: 'natural',
      }}
      onGesture={onGesture}
    >
      {applySeriesStyles(timeseriesData, {
        colors: ['#003f5c', '#58508d', '#bc5090'],
      }).map(({ data, key, chartStyle }) => (
        <LineSeries
          key={key}
          data={data}
          handlerMeta={{ label: key }}
          chartStyle={chartStyle}
        />
      ))}
      <XAxis tickPositions={ticks} getTickLabel={getTickLabel} />
      <YAxis
        tickPositions={[0, 100, 200]}
        getTickLabel={(pos) => String(pos)}
        intercept={view.xMin}
      />
    </Chart>
  );
};

export default HomepageTimeseries;
