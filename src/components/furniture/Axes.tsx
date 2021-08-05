import React from 'react';
import { contextualize, normalize } from '../../lib/normalize';
import { ChartState, ChartStyleOptions, Contextual } from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import Handle from '../primitives/Handle';
import { Line } from '../primitives/Line';
import { XTickMark, YTickMark, TickMarkProps } from './TickMarks';

interface AxisProps {
  range?: [number, number];
  intercept?: number;
  tickPositions?: Contextual<number[]>;
  getTickLabel?: (value: number) => string;
  axisLabel?: string | null;
  chartStyle?: ChartStyleOptions;
  renderTickMark?: React.FC<TickMarkProps>;
}

const normalizeAxisProps = (
  props: AxisProps,
  state: ChartState,
  naturalRange: [number, number]
) => {
  const range = normalize(props.range, naturalRange);
  const intercept = normalize<number>(props.intercept, 0);
  const tickPositions = contextualize(props.tickPositions, naturalRange, state);
  const getTickLabel = normalize(props.getTickLabel, (value: number) =>
    value.toString()
  );
  const axisLabel = normalize(props.axisLabel, null);

  return {
    range,
    intercept,
    tickPositions,
    getTickLabel,
    axisLabel,
  };
};

export const XAxis: React.FC<AxisProps> = (props) => {
  const state = useChartState();
  const {
    range,
    intercept,
    tickPositions,
    getTickLabel,
    // axisLabel,
  } = normalizeAxisProps(props, state, state.cartesianBox.x);
  const { axisColor, axisThickness } = useChartStyle(props.chartStyle);

  const TickMark = props.renderTickMark || XTickMark;

  return (
    <Handle elementPosition={[range[0], intercept]}>
      <Line
        path={[
          [range[0], intercept],
          [range[1], intercept],
        ]}
        strokeWidth={axisThickness}
        stroke={axisColor}
      />
      {tickPositions.map(
        (pos) =>
          pos >= range[0] &&
          pos <= range[1] && (
            <TickMark
              position={[pos, intercept]}
              label={getTickLabel(pos)}
              chartStyle={props.chartStyle}
              key={pos}
            />
          )
      )}
    </Handle>
  );
};

export const YAxis: React.FC<AxisProps> = (props) => {
  const state = useChartState();
  const {
    range,
    intercept,
    tickPositions,
    getTickLabel,
    // axisLabel,
  } = normalizeAxisProps(props, state, state.cartesianBox.y);
  // const axisLabel = normalize(props.axisLabel, null);
  const { axisColor, axisThickness } = useChartStyle(props.chartStyle);

  const TickMark = props.renderTickMark || YTickMark;

  return (
    <Handle elementPosition={[intercept, range[0]]}>
      <Line
        path={[
          [intercept, range[0]],
          [intercept, range[1]],
        ]}
        strokeWidth={axisThickness}
        stroke={axisColor}
      />
      {tickPositions.map(
        (pos) =>
          pos >= range[0] &&
          pos <= range[1] && (
            <TickMark
              position={[intercept, pos]}
              label={getTickLabel(pos)}
              chartStyle={props.chartStyle}
              key={pos}
            />
          )
      )}
    </Handle>
  );
};
