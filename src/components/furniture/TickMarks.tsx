import React from 'react';
import { normalize } from '../../lib/normalize';
import { ChartStyleOptions, Point } from '../../types';
import { useChartStyle } from '../base/ChartStyle';
import { TranslatedLine } from '../primitives/Line';
import Text from '../primitives/Text';

export interface TickMarkProps {
  position: Point;
  index?: number;
  label?: string;
  chartStyle?: ChartStyleOptions;
}

export const XTickMark: React.FC<TickMarkProps> = (props) => {
  const position = props.position;
  const label = normalize(props.label, '');

  const {
    fontSize,
    axisColor,
    axisStrokeWidth,
    axisTickLength,
    axisTickOffset,
    axisTickModulus,
    axisTickLabelOffset,
    axisTickLabelModulus,
    svgPointerEvents,
  } = useChartStyle(props.chartStyle);

  const showTick =
    typeof props.index === 'undefined' || props.index % axisTickModulus === 0;

  if (!showTick) {
    return null;
  }

  const showLabel =
    typeof props.index === 'undefined' ||
    props.index % axisTickLabelModulus === 0;

  const labelAbsoluteOffset = axisTickLength + axisTickLabelOffset + fontSize;

  return (
    <React.Fragment>
      <TranslatedLine
        position={position}
        path={[
          [0, axisTickOffset],
          [0, axisTickOffset + axisTickLength],
        ]}
        strokeWidth={axisStrokeWidth}
        stroke={axisColor}
        svgPointerEvents={svgPointerEvents}
      />
      {showLabel && (
        <Text
          position={position}
          pxOffset={[0, labelAbsoluteOffset]}
          text={label}
          color={axisColor}
          align="center"
          fontSize={fontSize}
          svgPointerEvents={svgPointerEvents}
        />
      )}
    </React.Fragment>
  );
};

export const YTickMark: React.FC<TickMarkProps> = (props) => {
  const position = props.position;
  const label = normalize(props.label, '');

  const {
    axisColor,
    axisStrokeWidth,
    axisTickLength,
    axisTickOffset,
    axisTickModulus,
    axisTickLabelOffset,
    axisTickLabelModulus,
    fontSize,
    svgPointerEvents,
  } = useChartStyle(props.chartStyle);

  const showTick =
    typeof props.index === 'undefined' || props.index % axisTickModulus === 0;

  if (!showTick) {
    return null;
  }

  const showLabel =
    typeof props.index === 'undefined' ||
    props.index % axisTickLabelModulus === 0;

  const labelAbsoluteOffset = 0 - axisTickLength - axisTickLabelOffset;
  return (
    <React.Fragment>
      <TranslatedLine
        position={position}
        path={[
          [0 - axisTickOffset, 0],
          [0 - axisTickLength - axisTickOffset, 0],
        ]}
        strokeWidth={axisStrokeWidth}
        stroke={axisColor}
        svgPointerEvents={svgPointerEvents}
      />
      {showLabel && (
        <Text
          position={position}
          pxOffset={[labelAbsoluteOffset, fontSize / 2 - axisStrokeWidth]}
          text={label}
          color={axisColor}
          align="right"
          fontSize={fontSize}
          svgPointerEvents={svgPointerEvents}
        />
      )}
    </React.Fragment>
  );
};
