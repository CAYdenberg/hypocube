import React from 'react';
import {
  Chart,
  XAxis,
  LineSeries,
  GestureKind,
  ChartStyleOptions,
  ChartGestureData,
} from '../src';
import usePannable from '../src/addons/usePannable';
import { createViewbox } from '../src/lib/Viewbox';

interface Props {
  getDateLabel: (x: number) => string;
  isCanvas: boolean;
  series: Array<[number, number]>;
  tickPositions: number[];
}

const Pannable: React.FC<Props> = ({
  getDateLabel,
  isCanvas,
  series,
  tickPositions,
}) => {
  const [view, setView, scrollToView] = usePannable(
    [50, 0, 50, 1000],
    [0, 0, 400, 1000]
  );

  const handleGesture = (data: ChartGestureData) => {
    if (data.kind === GestureKind.Swipe) {
      scrollToView(data.nextView);
      return;
    }
    setView(data.nextView);
  };

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
      isCanvas={isCanvas}
      onGesture={handleGesture}
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

export default Pannable;
