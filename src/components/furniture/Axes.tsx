import React from 'react';
import { contextualize, normalize } from '../../lib/normalize';
import { ChartState, ChartStyleOptions, Contextual } from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import Handle from '../primitives/Handle';
import { Line } from '../primitives/Line';
import { XTickMark, YTickMark, TickMarkProps } from './TickMarks';

interface AxisProps {
  /**
   * The start and end of the axis on the Cartesian scale. Defaults to the corresponding value in the Chart view
   */
  range?: [number, number];
  intercept?: number;
  tickPositions?: Contextual<number[]>;
  getTickLabel?: (value: number) => string;
  axisLabel?: string | null;
  chartStyle?: ChartStyleOptions;
}

interface XAxisComponents {
  XTickMark?: React.FC<TickMarkProps>;
}

const normalizeAxisProps = (props: AxisProps, state: ChartState) => {
  const { cartesianBox } = state;

  const range = normalize(props.range, cartesianBox.x);
  const intercept = normalize<number>(props.intercept, 0);
  const tickPositions = contextualize(
    props.tickPositions,
    cartesianBox.x,
    state
  );
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

const XAxisDefaultComponents = {
  XTickMark,
};

export const XAxisComposer = (Components: XAxisComponents = {}) => {
  const { XTickMark } = {
    ...XAxisDefaultComponents,
    ...Components,
  };

  const XAxis: React.FC<AxisProps> = (props) => {
    const state = useChartState();

    const {
      range,
      intercept,
      tickPositions,
      getTickLabel,
      // axisLabel,
    } = normalizeAxisProps(props, state);
    const { axisColor, axisThickness } = useChartStyle(props.chartStyle);

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
              <XTickMark
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

  return XAxis;
};

export const XAxis = XAxisComposer();

interface YAxisComponents {
  YTickMark?: React.FC<TickMarkProps>;
}

const YAxisDefaultComponents = {
  YTickMark,
};

export const YAxisComposer = (Components: YAxisComponents = {}) => {
  const { YTickMark } = {
    ...YAxisDefaultComponents,
    ...Components,
  };

  const YAxis: React.FC<AxisProps> = (props) => {
    const state = useChartState();

    const {
      range,
      intercept,
      tickPositions,
      getTickLabel,
      // axisLabel,
    } = normalizeAxisProps(props, state);
    // const axisLabel = normalize(props.axisLabel, null);
    const { axisColor, axisThickness } = useChartStyle(props.chartStyle);

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
            pos <= range[0] &&
            pos >= range[1] && (
              <YTickMark
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

  return YAxis;
};

export const YAxis = YAxisComposer();
