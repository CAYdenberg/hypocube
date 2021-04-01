import React from 'react';
import { Chart, XAxis, LineSeries, usePannableView, GestureKind } from '../src';

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
  const { view, isPanning, onGesture } = usePannableView(
    { x: [50, 60], y: [0, 1000] },
    (data) => {
      if (data.kind === GestureKind.Swipe) {
        return (time, cancel) => {
          if (time > 1) {
            cancel();
          }
          return {
            y: view.y,
            x: [
              view.x[0] - time * (data.nextView.x[0] - view.x[0]),
              view.x[1] - time * (data.nextView.x[1] - view.x[1]),
            ],
          };
        };
      }
      return { x: data.nextView.x, y: view.y };
    }
  );

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
      <LineSeries data={series} color="#5477a1" />
    </Chart>
  );
};
