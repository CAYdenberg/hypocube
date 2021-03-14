import React, { useState } from 'react';
import { Chart, XAxis, LineSeries, GestureKind } from '../src';

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
  const [xView, setXView] = useState<[number, number]>([50, 60]);

  return (
    <Chart
      height={300}
      width={300}
      view={{ x: xView, y: [0, 1000] }}
      gutter={[20, 20, 50, 50]}
      isCanvas={isCanvas}
      onGesture={(data) => {
        if (data.kind !== GestureKind.Drag) return;
        setXView(data.nextView.x);
      }}
    >
      <XAxis
        range={xView}
        tickPositions={tickPositions}
        getTickLabel={getDateLabel}
      />
      <LineSeries data={series} color="#5477a1" />
    </Chart>
  );
};
