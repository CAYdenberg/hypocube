import React from 'react';
import { Chart, XAxis, useGestures, LineSeries } from '../src';

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
  const handleGestures = useGestures(console.log);

  return (
    <Chart
      height={300}
      width={300}
      view={{ x: [50, 60], y: [0, 1000] }}
      gutter={[20, 20, 50, 50]}
      isCanvas={isCanvas}
      {...handleGestures}
    >
      <XAxis
        range={[50, 60]}
        tickPositions={tickPositions}
        getTickLabel={getDateLabel}
      />
      <LineSeries data={series} color="#5477a1" />
    </Chart>
  );
};
