import React from 'react';
import { contextualize, normalize } from '../../lib/normalize';
import { ChartStyleOptions, Contextual } from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyles } from '../base/ChartStyle';
import Handle from '../primitives/Handle';
import { Line } from '../primitives/Line';
import { XTickMark } from './TickMarks';

interface Props {
  range?: [number, number];
  yIntercept?: number;
  tickPositions?: Contextual<number[]>;
  tickLabel?: (value: number) => string;
  axisLabel?: string | null;
  overrideStyles?: ChartStyleOptions;
}

export const XAxisComposer = () => {
  const XAxis: React.FC<Props> = (props) => {
    const state = useChartState();
    const { cartesianBox } = state;

    const range = normalize(props.range, cartesianBox.x);
    const yIntercept = normalize<number>(props.yIntercept, 0);
    const tickPositions = contextualize(
      props.tickPositions,
      cartesianBox.x,
      state
    );
    const tickLabel = normalize(props.tickLabel, (value: number) =>
      value.toString()
    );
    // const axisLabel = normalize(props.axisLabel, null);
    const { axisColor, axisThickness } = useChartStyles(props.overrideStyles);

    return (
      <Handle elementPosition={[range[0], yIntercept]}>
        <Line
          path={[
            [range[0], yIntercept],
            [range[1], yIntercept],
          ]}
          strokeWidth={axisThickness}
          stroke={axisColor}
        />
        {tickPositions.map((pos) => (
          <XTickMark
            position={[pos, yIntercept]}
            label={tickLabel(pos)}
            overrideStyles={props.overrideStyles}
            key={pos}
          />
        ))}
      </Handle>
    );
  };

  return XAxis;
};

export const XAxis = XAxisComposer();
