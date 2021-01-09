import React, { useContext } from 'react';
import { Contextual } from '../../types';
import { ChartContext } from '../Chart';
import Handle from '../primitives/Handle';
import { Line } from '../primitives/Line';

interface Props {
  range?: [number, number];
  yIntercept?: number;
  tickPositions?: Contextual<number[]>;
  tickLabel?: (value: number) => string;
  axisLabel?: string | null;
}

export const XAxis: React.FC<Props> = (props) => {
  const { cartesianBox } = useContext(ChartContext);

  const { range, yIntercept, tickPositions, tickLabel, axisLabel } = {
    range: cartesianBox.x,
    yIntercept: 0,
    tickPositions: cartesianBox,
    tickLabel: (value: number) => value,
    axisLabel: null,
    ...props,
  };

  return (
    <Handle elementPosition={[range[0], yIntercept]}>
      <Line
        path={[
          [range[0], yIntercept],
          [range[1], yIntercept],
        ]}
        strokeWidth={2}
        stroke="#666"
      />
    </Handle>
  );
};
