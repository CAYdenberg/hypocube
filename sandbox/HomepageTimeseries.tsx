import React, { useCallback } from 'react';
import { DateTime } from 'luxon';
import {
  Chart,
  XAxis,
  LineSeries,
  GestureKind,
  YAxis,
  createViewbox,
  ChartEventData,
} from '../src';
import applySeriesStyles from '../src/addons/applySeriesStyles';
import usePannableView from '../src/addons/usePannableView';
import timeseriesData, { labels } from './__data__/homepage-1';
import useVoronoi from '../src/addons/useVoronoi';

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

interface Props {
  isCanvas: boolean;
  handlePointSelect?: (data: ChartEventData) => void;
}

const HomepageTimeseries: React.FC<Props> = ({
  isCanvas,
  handlePointSelect,
}) => {
  const boundingBox = createViewbox([0, 0, 251, 250]);
  const { view, onGesture } = usePannableView([201, 0, 50, 250], (data) => {
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
  });

  const onPointerMove = useVoronoi(
    timeseriesData,
    useCallback(
      (data: ChartEventData) => {
        if (!handlePointSelect) return;

        handlePointSelect(data);
      },
      [handlePointSelect]
    )
  );

  return (
    <React.Fragment>
      <Chart
        height={300}
        width={300}
        view={view}
        gutter={[5, 20, 50, 50]}
        isCanvas={isCanvas}
        chartStyle={{
          dataPointSymbol: 'circle',
          dataLineCurveType: 'natural',
        }}
        onGesture={onGesture}
        onPointerMove={onPointerMove}
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
    </React.Fragment>
  );
};

export default HomepageTimeseries;
