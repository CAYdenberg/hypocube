import React from 'react';
import { contextualize, normalize } from '../../lib/normalize';
import {
  ChartEventMetaData,
  ChartState,
  ChartStyleOptions,
  Contextual,
} from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import Handle from '../primitives/Handle';
import { Line } from '../primitives/Line';
import { XTickMark, YTickMark, TickMarkProps } from './TickMarks';
import { AxisLabelProps, XAxisLabel, YAxisLabel } from './AxisLabels';
import { HandlerProps } from '../../lib/useHandle';
import selectHandlers from '../../lib/selectHandlers';

interface AxisProps extends HandlerProps {
  range?: [number, number];
  intercept?: number;
  tickPositions?: Contextual<number[]>;
  getTickLabel?: (value: number) => string;
  axisLabel?: string | null;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  renderTickMark?: React.FC<TickMarkProps>;
  renderAxisLabel?: React.FC<AxisLabelProps>;
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
    axisLabel,
  } = normalizeAxisProps(props, state, state.cartesianBox.x);
  const { axisColor, axisStrokeWidth, svgPointerEvents } = useChartStyle(
    props.chartStyle
  );
  const midPoint = (state.cartesianBox.xMin + state.cartesianBox.xMax) / 2;

  const TickMark = props.renderTickMark || XTickMark;
  const Label = props.renderAxisLabel || XAxisLabel;

  return (
    <Handle
      elementPosition={[range[0], intercept]}
      meta={props.handlerMeta}
      {...selectHandlers(props)}
    >
      <Line
        path={[
          [range[0], intercept],
          [range[1], intercept],
        ]}
        strokeWidth={axisStrokeWidth}
        stroke={axisColor}
        svgPointerEvents={svgPointerEvents}
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
      {axisLabel && (
        <Label
          position={[midPoint, intercept]}
          label={axisLabel}
          chartStyle={props.chartStyle}
        />
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
    axisLabel,
  } = normalizeAxisProps(props, state, state.cartesianBox.y);
  const { axisColor, axisStrokeWidth, svgPointerEvents } = useChartStyle(
    props.chartStyle
  );
  const midPoint = (state.cartesianBox.yMin + state.cartesianBox.yMax) / 2;

  const TickMark = props.renderTickMark || YTickMark;
  const Label = props.renderAxisLabel || YAxisLabel;

  return (
    <Handle
      elementPosition={[intercept, range[0]]}
      meta={props.handlerMeta}
      {...selectHandlers(props)}
    >
      <Line
        path={[
          [intercept, range[0]],
          [intercept, range[1]],
        ]}
        strokeWidth={axisStrokeWidth}
        stroke={axisColor}
        svgPointerEvents={svgPointerEvents}
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
      {axisLabel && (
        <Label
          position={[intercept, midPoint]}
          label={axisLabel}
          chartStyle={props.chartStyle}
        />
      )}
    </Handle>
  );
};
