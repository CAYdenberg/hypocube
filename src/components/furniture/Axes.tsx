import React from 'react';
import { normalize } from '../../lib/normalize';
import { tickPos, normalizeGetTickLabel, tickIsShown } from '../../lib/ticks';
import { ChartEventMetaData, ChartStyleOptions } from '../../types';
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
  tickPositions?: Array<number | [number, string]>;
  getTickLabel?: (value: number) => string;
  axisLabel?: string | null;
  chartStyle?: ChartStyleOptions;
  handlerMeta?: ChartEventMetaData;
  renderTickMark?: React.FC<TickMarkProps>;
  renderAxisLabel?: React.FC<AxisLabelProps>;
}

const normalizeAxisProps = (
  props: AxisProps,
  naturalRange: [number, number]
) => {
  const range = normalize(props.range, naturalRange);
  const intercept = normalize<number>(props.intercept, 0);
  const tickPositions = normalize(props.tickPositions, []);
  const axisLabel = normalize(props.axisLabel, null);
  const getTickLabel = normalizeGetTickLabel(props.getTickLabel);

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
  } = normalizeAxisProps(props, state.cartesianBox.x);
  const {
    axisColor,
    axisStrokeWidth,
    svgPointerEvents,
    axisTickModulus,
    axisTickLabelModulus,
  } = useChartStyle(props.chartStyle);
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
      {tickPositions.map((tick, index) => {
        const pos = tickPos(tick);
        if (
          pos < range[0] ||
          pos > range[1] ||
          !tickIsShown(index, axisTickModulus)
        ) {
          return null;
        }

        return (
          <TickMark
            position={[pos, intercept]}
            label={
              tickIsShown(index, axisTickLabelModulus) ? getTickLabel(tick) : ''
            }
            chartStyle={props.chartStyle}
            key={pos}
          />
        );
      })}
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
  } = normalizeAxisProps(props, state.cartesianBox.y);
  const {
    axisColor,
    axisStrokeWidth,
    svgPointerEvents,
    axisTickModulus,
    axisTickLabelModulus,
  } = useChartStyle(props.chartStyle);
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
      {tickPositions.map((tick, index) => {
        const pos = tickPos(tick);
        if (
          pos < range[0] ||
          pos > range[1] ||
          !tickIsShown(index, axisTickModulus)
        ) {
          return null;
        }
        return (
          <TickMark
            position={[intercept, pos]}
            label={
              tickIsShown(index, axisTickLabelModulus) ? getTickLabel(tick) : ''
            }
            chartStyle={props.chartStyle}
            key={pos}
          />
        );
      })}
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
