import React, { useState } from 'react';
import {
  Chart,
  XAxis,
  YAxis,
  LineSeries,
  GestureKind,
  ChartStyleOptions,
  ChartGestureData,
  Viewbox,
} from '../src';
import usePannable from '../src/addons/usePannable';

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
  const { view, setView, scrollToView } = usePannable(
    [50, 0, 50, 1000],
    [0, 0, 400, 1000]
  );

  const handleGesture = (data: ChartGestureData) => {
    if (data.kind === GestureKind.Wheel) {
      console.log(data.phase, data.nextView.y);
    }

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
    <React.Fragment>
      <p>{`Width: ${view.width}, Height: ${view.height}`}</p>
      <Chart
        height={300}
        width={300}
        view={view}
        gutter={[20, 20, 50, 50]}
        isCanvas={isCanvas}
        onGesture={handleGesture}
      >
        <XAxis
          tickPositions={tickPositions}
          getTickLabel={getDateLabel}
          intercept={view.yMin}
        />
        <YAxis
          tickPositions={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
          intercept={view.xMin}
        />
        <LineSeries data={series} chartStyle={seriesStyle} />
      </Chart>
    </React.Fragment>
  );
};

export default Pannable;
