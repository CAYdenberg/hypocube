import React from 'react';
import {
  Chart,
  XAxis,
  LineSeries,
  GestureKind,
  ChartStyleOptions,
} from '../src';
import usePannableView from '../src/addons/usePannableView';
import { createViewbox } from '../src/lib/Viewbox';

interface Props {
  getDateLabel: (x: number) => string;
  isCanvas: boolean;
  series: Array<[number, number]>;
  tickPositions: number[];
}

export const Pannable: React.FC<Props> = ({
  getDateLabel,
  isCanvas,
  series,
  tickPositions,
}) => {
  const boundingBox = createViewbox([0, 0, 400, 1000]);
  const { view, isPanning, onGesture } = usePannableView(
    [50, 0, 50, 1000],
    (data) => {
      if (data.kind === GestureKind.Swipe) {
        return (time, cancel) => {
          if (time > 1) {
            cancel();
          }
          return view.interpolate(data.nextView, time).bound(boundingBox);
        };
      }
      return data.nextView.bound(boundingBox);
    }
  );

  const seriesStyle: ChartStyleOptions = {
    dataLineStroke: '#5477a1',
    dataPointStroke: '#5477a1',
    dataPointFill: '#5477a1',
  };

  return (
    <Chart
      height={300}
      width={300}
      view={view}
      gutter={[20, 20, 50, 50]}
      isCanvas={isCanvas || isPanning}
      onGesture={onGesture}
    >
      <XAxis
        range={view.x}
        tickPositions={tickPositions}
        getTickLabel={getDateLabel}
      />
      <LineSeries data={series} chartStyle={seriesStyle} />
    </Chart>
  );
};
